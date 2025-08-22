using E_mart.Dtos;
using E_mart.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_mart.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize] // Protect all endpoints
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // GET /api/user/me
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetLoggedInUser()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            var userDto = await _userService.GetUserDetailsAsync(username);
            return Ok(userDto);
        }

        // PUT /api/user/updateuser
        [HttpPut("updateuser")]
        public async Task<IActionResult> UpdateUser(UpdateDto dto)
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            await _userService.UpdateUserAsync(username, dto);
            return Ok("Loyalty points updated successfully");
        }
    }
}
