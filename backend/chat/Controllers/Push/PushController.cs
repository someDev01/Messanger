using chat.Dtos;
using chat.Services.Auth;
using Microsoft.AspNetCore.Mvc;

namespace chat.Controllers.Push;

[ApiController]
[Route("api/[controller]")]
public class PushController(AuthService authService) : ControllerBase
{
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionDto dto)
    {
        var header = Request.Headers.Authorization.ToString();

        if (string.IsNullOrEmpty(header))
            return Unauthorized();

        var session = header.Replace("Bearer ", "");
        var userId = await authService.GetUserId(session);

        var result = await authService.ExistingAndSavePushSubscription(userId, dto);

        return Ok();
    }
}
