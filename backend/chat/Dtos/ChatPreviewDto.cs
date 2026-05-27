namespace chat.Dtos;

public record ChatPreviewDto(
    Guid Id,
    string Name,
    string Avatar,
    string LastMessage,
    string LastSenderName,
    DateTime LastMessageDate
);
