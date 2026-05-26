namespace chat.Dtos;

public record MessageDto(
    Guid Id,
    Guid SenderId,
    string Text,
    DateTime SendedAt);
