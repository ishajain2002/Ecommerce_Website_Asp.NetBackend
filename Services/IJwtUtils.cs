using E_mart.Models;

namespace E_mart.Services
{
    public interface IJwtUtils
    {
        string GenerateToken(User user);
    }
}
