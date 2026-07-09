using chat.models;
using chat.Models;
using Microsoft.EntityFrameworkCore;

namespace chat.Db;

public class DataContext(DbContextOptions<DataContext> options): DbContext(options)
{
    public DbSet<User> Users { get; set; }

    public DbSet<PushSubscription> PushSubscriptions { get; set; }

    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(m => m.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Receiver)
            .WithMany(u => u.ReceivedMessages)
            .HasForeignKey(m => m.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasIndex(i => i.Number)
            .IsUnique();

        modelBuilder.Entity<PushSubscription>()
            .HasOne(p => p.User)
            .WithMany(u => u.PushSubscriptions)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
