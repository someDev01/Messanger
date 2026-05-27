namespace chat.Models;

public class User
{
    public Guid Id { get; set; }

    public string Session { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string Number { get; set; } = string.Empty;

    public string HashPassword { get; set; } = string.Empty;

    public string? Avatar { get; set;} = string.Empty;

    public List<Message> SentMessages { get; set; } = [];

    public List<Message> ReceivedMessages { get; set; } = [];

    public DateTime CreatedAt { get; set; }
}
