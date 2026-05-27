using chat.Dtos;
using chat.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace chat.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
    AuthService authService,
    AvatarService avatarService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await authService.Register(dto);
        if(!result.IsSuccess)
            return BadRequest(result.Error);

        return Ok(new
        {
            success = true,
            mes = "Регистрация прошла успешно"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] RegisterDto dto)
    {
        var result = await authService.Login(dto);
        if (!result.IsSuccess) 
            return BadRequest(new 
            {
                success = result.IsSuccess,
                result.Error 
            });

        return Ok(new 
        {
            success = result.IsSuccess,
            session = result.Value,
            mes = "ВЫ успешно вошли"
        });
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var header = Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(header))
            return Unauthorized();

        var session = header.Replace("Bearer ", "");
        var res = await authService.CheckMe(session);
        if (!res.IsSuccess)
            return Unauthorized(res.Error);

        return Ok(new 
        {   
            success = true,
        });
    }

    [HttpGet("profile")]
    public async Task<IActionResult> Profile()
    {
        var header = Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(header))
            return Unauthorized();

        var session = header.Replace("Bearer ", "");

        var res = await authService.CheckMe(session);
        if (!res.IsSuccess)
            return Unauthorized(res.Error);
        Console.WriteLine(res.Value.name);
        return Ok(new
        {
            success = true,
            res.Value.name,
            res.Value.number,
            res.Value.id,
        });
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
    [FromQuery] string query)
    {
        var session = Request.Headers.Authorization
            .ToString()
            .Replace("Bearer ", "");

        var users =
            await authService.SearchUsers(
                session,
                query);

        return Ok(users);
    }

    [HttpPost("upload-avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile file)
    {
        var session = Request.Headers.Authorization
            .ToString()
            .Replace("Bearer ", "");

        var avatar =
            await avatarService.UploadAvatar(
                session,
                file
            );

        return Ok(new
        {
            success = true,
            avatar
        });
    }
}
