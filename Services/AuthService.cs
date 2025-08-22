using E_mart.Dtos;
using E_mart.Models;
using E_mart.Repository;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace E_mart.Services
{
    public class AuthService : IAuthService
    {
        private readonly E_MartDbContext _context;
        private readonly IJwtUtils _jwtUtils;

        public AuthService(E_MartDbContext context, IJwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }

        public async Task<bool> RegisterAsync(RegisterRequestDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email))
                return false;

            var hashedPassword = HashPassword(dto.Password);

            var user = new User
            {
                Username = dto.Username,
                PhoneNo = dto.PhoneNo,
                Email = dto.Email,
                Password = hashedPassword,
                LoyaltyPoints = 0,
                Loyalty = dto.Loyalty
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var hashedPassword = HashPassword(dto.Password);
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username && u.Password == hashedPassword);

            if (user == null)
                return null;

            var token = _jwtUtils.GenerateToken(user);

            return new LoginResponseDto
            {
                Token = token,
                Username = user.Username
            };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
        }
    }
}
