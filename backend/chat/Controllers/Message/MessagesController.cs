using chat.Dtos;
using chat.Services.Auth;
using chat.Services.Message;
using Microsoft.AspNetCore.Mvc;

namespace chat.Controllers.Message;

[ApiController]
[Route("api/[controller]")]
public class MessagesController(
    MessageService messageService,
    AuthService authService) : ControllerBase
{
    [HttpPost("send")]
    public async Task<IActionResult> Send([FromBody] SendMessageDto dto)
    {
        var header = Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(header))
            return Unauthorized();

        var session = header.Replace("Bearer ", "");

        var senderId = await authService.GetUserId(session);

        var result = await messageService.SendMessage(senderId, dto);

        return Ok(result);
    }

    [HttpGet("chats")]
    public async Task<IActionResult> GetChats()
    {
        var header =
            Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(header))
            return Unauthorized();

        var session =
            header.Replace("Bearer ", "");

        var chats =
            await messageService.GetChats(session);

        return Ok(chats);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetMessages(Guid userId)
    {
        var header =
            Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(header))
            return Unauthorized();

        var session =
            header.Replace("Bearer ", "");

        var messages =
            await messageService.GetMessages(
                session,
                userId);

        return Ok(messages);
    }

}
