namespace chat.Models;

public class Message
{
    public Guid Id { get; set; }

    public string Text { get; set; } = string.Empty;

    public Guid SenderId { get; set; }

    public User Sender { get; set; }

    public Guid ReceiverId { get; set; }

    public User Receiver { get; set; }

    public DateTime SendedAt { get; set; }
}
