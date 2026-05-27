using chat.Db;
using Microsoft.EntityFrameworkCore;
using System;

namespace chat.Services.Avatar;

public class AvatarService(
    IWebHostEnvironment env,
    DataContext context)
{
    public async Task<string?> UploadAvatar(
        string session,
        IFormFile file,
        CancellationToken cancellationToken = default)
    {
        var rootPath =
            env.WebRootPath ??
            Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot"
            );

        var uploadsPath = Path.Combine(
            rootPath,
            "uploads",
            "avatars"
        );

        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var extension =
            Path.GetExtension(file.FileName);

        var fileName =
            $"{Guid.NewGuid()}{extension}";

        var fullPath =
            Path.Combine(uploadsPath, fileName);

        using (var stream =
               new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var avatarPath =
            $"/uploads/avatars/{fileName}";

        var user = await context.Users
            .Where(u => u.Session == session)
            .FirstOrDefaultAsync(cancellationToken);

        if (user is null)
        {
            return null;
        }

        user.Avatar = avatarPath;

        await context.SaveChangesAsync();

        return avatarPath;
    }
}