using chat.Db;
using chat.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using WebPush;

namespace chat.Services.Message;

public class MessageService(DataContext context)
{
    public async Task<MessageDto> SendMessage(
        Guid senderId,
        SendMessageDto dto,
        CancellationToken cancellationToken = default)
    {
        var message = new Models.Message()
        {
            Id = Guid.NewGuid(),
            Text = dto.Text,
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            SendedAt = DateTime.UtcNow,
        };

        await context.Messages.AddAsync(message, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        var subs = await context.PushSubscriptions
            .Where(p => p.UserId == dto.ReceiverId)
            .ToListAsync();

        var senderName = await context.Users.FirstOrDefaultAsync(u => u.Id == message.SenderId);
        var paload = JsonSerializer.Serialize(new
        {
            title = senderId,
            body = message.Text,
            icon = ""
        });

        foreach(var sub in subs)
        {
            var subscription = new PushSubscription(sub.Endpoint, sub.P256dh, sub.Auth);
            var vapidDetails = new VapidDetails(
                "mailto: vocal.ru", 
                "BF7hknOjK-AJprw9Kkec6wnn-Z8EU0S-bk9rCQufgmws22qPMhF1szd0ns1Wv9Ig7RM0kzFIJSXoJsbBDDVBfGQ",
                "rI2RB69chRKcQy1ECtejNagAyx7oM63Dagpd4mvM4hM");
            var client = new WebPushClient();

            client.SendNotification(subscription, paload, vapidDetails);

        }

        return new MessageDto(
            message.Id,
            message.SenderId,
            message.Text,
            message.SendedAt
        );
    }

    public async Task<List<ChatPreviewDto>> GetChats(
    string session,
    CancellationToken cancellationToken = default)
    {
        var currentUser = await context.Users
            .FirstOrDefaultAsync(
                u => u.Session == session,
                cancellationToken);

        if (currentUser is null)
            return [];

        var chats = await context.Messages
            .Where(m => m.SenderId == currentUser.Id || m.ReceiverId == currentUser.Id)
            .OrderByDescending(m => m.SendedAt)
            .ToListAsync(cancellationToken);

        var result = chats
            .GroupBy(m =>
                m.SenderId == currentUser.Id
                    ? m.ReceiverId
                    : m.SenderId)

            .Select(g =>
            {
                var lastMessage =
                    g.First();

                var otherUserId =
                    lastMessage.SenderId == currentUser.Id
                        ? lastMessage.ReceiverId
                        : lastMessage.SenderId;

                var otherUser = context.Users
                    .First(u => u.Id == otherUserId);

                return new ChatPreviewDto(
                    otherUser.Id,
                    otherUser.Name,
                    otherUser.Avatar,
                    lastMessage.Text,
                    lastMessage.SenderId == currentUser.Id
                        ? "Вы"
                        : otherUser.Name,
                    lastMessage.SendedAt
                );
            })

            .ToList();

        return result;
    }


    public async Task<List<MessageDto>> GetMessages(
        string session,
        Guid otherUserId,
        CancellationToken cancellationToken = default)
    {
        var currentUser = await context.Users
            .FirstOrDefaultAsync(
                u => u.Session == session,
                cancellationToken);

        if (currentUser is null)
            return [];

        var messages = await context.Messages

            .Where(m =>

                (m.SenderId == currentUser.Id &&
                 m.ReceiverId == otherUserId)

                ||

                (m.SenderId == otherUserId &&
                 m.ReceiverId == currentUser.Id)

            )

            .OrderBy(m => m.SendedAt)

            .Select(m => new MessageDto(
                m.Id,
                m.SenderId,
                m.Text,
                m.SendedAt))
            .ToListAsync(cancellationToken);

        return messages;
    }
}
