using E_mart.Dtos;

namespace E_mart.Services
{
    public interface IAuthService
    {
        Task<bool> RegisterAsync(RegisterRequestDto dto);
        Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
    }
}
