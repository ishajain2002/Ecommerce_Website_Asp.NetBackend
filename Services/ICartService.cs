using E_mart.Dtos;

namespace E_mart.Services
{
    public interface ICartService
    {
        Task<string> AddProductToCartAsync(CartRequestDto request, string username);
        Task<List<CartViewDto>> GetCartDetailsByUserIdAsync(int userId);
        Task UpdateCartQuantitiesAsync(List<CartUpdateRequestDto> updates);
        Task DeleteCartItemAsync(int cartDetailId,string username);
        Task<int> GetUserIdByUsernameAsync(string username);
    }
}
