namespace chat.Dtos;

public record SendMessageDto(Guid ReceiverId, string Text);
