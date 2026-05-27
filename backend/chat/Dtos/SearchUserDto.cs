namespace chat.Dtos;

public record SearchUserDto(
    Guid Id,
    string Name,
    string Avatar,
    string Number
);
