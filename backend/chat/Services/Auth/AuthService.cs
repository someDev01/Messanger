using chat.Db;
using chat.Dtos;
using chat.Models;
using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace chat.Services.Auth;

public class AuthService(
    IValidator<RegisterDto> validator,
    DataContext context)
{
    public async Task<Result.Result> Register(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var validationResult = await validator.ValidateAsync(dto, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
            return Result.Result.Failure(errors);
        }

        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        var session = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        var user = new User()
        {
            Id = Guid.NewGuid(),
            Session = session,
            Name = dto.UserName,
            Number = await GenerationNumber(),
            HashPassword = hash,
            CreatedAt = DateTime.UtcNow,
        };

        await context.AddAsync(user, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return Result.Result.Success();
    }

    private async Task<string> GenerationNumber()
    {
        string number;
        var random = new Random();
        do
        {
            number = new string(Enumerable.Range(0, 4)
                .Select(_ => (char)('0' + random.Next(0, 10)))
                .ToArray());
        }
        while (await context.Users.AnyAsync(u => u.Number == number));

        return number;
    }

    public async Task<Result.Result<string>> Login(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        var validationResult = await validator.ValidateAsync(dto, cancellationToken);
        if (!validationResult.IsValid)
        {
            var errors = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
            return Result.Result<string>.Failure(errors);
        }

        var user = await context.Users.FirstOrDefaultAsync(u => u.Name == dto.UserName, cancellationToken);
        if (user is null)
            return Result.Result<string>.Failure("Такого пользователя нет");

        bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.HashPassword);
        if (!isValid)
            return Result.Result<string>.Failure("Пароль неверный");

        return Result.Result<string>.Success(user.Session);  
    }

    public async Task<Result.Result<(string name, Guid id, string number, string? avatar)>> CheckMe(string session, CancellationToken cancellationToken = default)
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Session == session, cancellationToken);
        if (user is null)
            return Result.Result<(string name, Guid id, string number, string? avatar)>.Failure("Токен не совпадает");

        return Result.Result<(string name, Guid id, string number, string? avatar)>.Success(
            (user.Name, user.Id, user.Number, user.Avatar));

    }

    public async Task<Guid> GetUserId(string session, CancellationToken cancellationToken = default)
    {
        var userId = await context.Users
            .Where(u => u.Session == session)
            .Select(u => u.Id)
            .FirstOrDefaultAsync(cancellationToken);

        return userId;
    }

    public async Task<bool> ExistingAndSavePushSubscription(Guid userId, PushSubscriptionDto dto)
    {
        var existing = await context.PushSubscriptions.FirstOrDefaultAsync(p => p.UserId == userId && p.Endpoint == dto.Endpoint);
        if(existing is null)
        {
            await context.PushSubscriptions.AddAsync(new models.PushSubscription
            {
                UserId = userId,
                Endpoint = dto.Endpoint,
                P256dh = dto.P256dh,
                Auth = dto.Auth,
                CreatedAt = DateTime.UtcNow,
            });
            await context.SaveChangesAsync();
            return true;
        }

        return true;

    }
    

    public async Task<List<SearchUserDto>> SearchUsers(
    string session,
    string query,
    CancellationToken cancellationToken = default)
    {
        var currentUser = await context.Users
            .FirstOrDefaultAsync(
                u => u.Session == session,
                cancellationToken);

        if (currentUser is null)
            return [];

        return await context.Users

            .Where(u =>
                u.Id != currentUser.Id
                &&
                u.Name.Contains(query)
            )

            .Select(u => new SearchUserDto(
                u.Id,
                u.Name,
                u.Avatar,
                u.Number
            ))

            .Take(20)

            .ToListAsync(cancellationToken);
    }
}
