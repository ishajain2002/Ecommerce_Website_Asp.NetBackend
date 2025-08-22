using E_mart.Dtos;

namespace E_mart.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUserDetailsAsync(string username);
        Task UpdateUserAsync(string username, UpdateDto dto);
    }
}
