using E_mart.Dtos;
using E_mart.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace E_mart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddProductToCart([FromBody] CartRequestDto request)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var result = await _cartService.AddProductToCartAsync(request, username);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetCartDetails()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var userId = await _cartService.GetUserIdByUsernameAsync(username);
            var cartDetails = await _cartService.GetCartDetailsByUserIdAsync(userId);

            if (!cartDetails.Any())
                return NoContent();

            return Ok(cartDetails);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateQuantities([FromBody] List<CartUpdateRequestDto> updates)
        {
            await _cartService.UpdateCartQuantitiesAsync(updates);
            return Ok("Cart updated successfully.");
        }

        [HttpDelete("delete/{cartDetailId}")]
        public async Task<IActionResult> DeleteCartItem(int cartDetailId)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            await _cartService.DeleteCartItemAsync(cartDetailId,username);
            return Ok("Cart item deleted successfully");
        }
    }
}
