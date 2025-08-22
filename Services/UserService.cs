using E_mart.Dtos;
using E_mart.Repository;
using Microsoft.EntityFrameworkCore;

namespace E_mart.Services
{
    public class UserService : IUserService
    {
        private readonly E_MartDbContext _context;

        public UserService(E_MartDbContext context)
        {
            _context = context;
        }

        public async Task<UserDto> GetUserDetailsAsync(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                throw new Exception("User not found");

            return new UserDto
            {
                Username = user.Username,
                PhoneNo = user.PhoneNo,
                Email = user.Email,
                Loyalty = user.Loyalty,
                LoyaltyPoints = user.LoyaltyPoints
            };
        }

        public async Task UpdateUserAsync(string username, UpdateDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                throw new Exception($"User not found: {username}");
            user.Username = dto.Username;
            user.PhoneNo = dto.PhoneNo;
            user.Email = dto.Email;
            //user.LoyaltyPoints = dto.LoyaltyPoints;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
