namespace chat.Dtos;

public record ChatPreviewDto(
    Guid Id,
    string Name,
    string LastMessage,
    string LastSenderName,
    DateTime LastMessageDate
);
