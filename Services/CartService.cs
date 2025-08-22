using Azure.Core;
using E_mart.Dtos;
using E_mart.Models;
using E_mart.Repository;
using Microsoft.EntityFrameworkCore;

namespace E_mart.Services
{
    public class CartService : ICartService
    {
        private readonly E_MartDbContext _context;

        public CartService(E_MartDbContext context)
        {
            _context = context;
        }

        public async Task<string> AddProductToCartAsync(CartRequestDto request, string username)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username)
                ?? throw new Exception("User not found");

            var product = await _context.ProductMasters
                .FirstOrDefaultAsync(p => p.ProductId == request.ProductId)
                ?? throw new Exception("Product not found");

            var cart = await _context.CartMasters
                .Include(c => c.CartDetails)
                .FirstOrDefaultAsync(c => c.UserId == user.UserId);

            if (cart == null)
            {
                cart = new CartMaster
                {
                    CartDate = DateTime.UtcNow,
                    UserId = user.UserId
                };
                _context.CartMasters.Add(cart);
                await _context.SaveChangesAsync();
            }

            var cartDetail = await _context.CartDetails
                .FirstOrDefaultAsync(cd =>
                    cd.CartId == cart.CartId &&
                    cd.ProductId == product.ProductId &&
                    cd.PurchaseMode == request.PurchaseMode);

            if (cartDetail == null)
            {
                cartDetail = new CartDetails
                {
                    CartId = cart.CartId,
                    ProductId = product.ProductId,
                    PurchaseMode = request.PurchaseMode,
                    Quantity = request.Quantity,
                    Mrp = (decimal)product.MrpPrice,
                    LoyalPrice = (decimal)product.LoyalPrice,
                    LoyaltyPoints = (int)product.LoyaltyPoints
                };
                _context.CartDetails.Add(cartDetail);
            }
            else
            {
                cartDetail.Quantity += request.Quantity;
            }


            if (request.PurchaseMode == PurchaseMode.LOYALTY_POINTS && user.Loyalty == true) {

                user.LoyaltyPoints -= (int)product.LoyaltyPoints;
            }

            await _context.SaveChangesAsync();
            return "Product added to cart successfully";
        }

        public async Task<List<CartViewDto>> GetCartDetailsByUserIdAsync(int userId)
        {
            var cartDetailsList = await _context.CartDetails
                .Include(cd => cd.Product)
                .Where(cd => cd.Cart.UserId == userId)
                .ToListAsync();

            return cartDetailsList.Select(cd =>
            {
                var dto = new CartViewDto
                {
                    CartDetailId = cd.CartDetailId,
                    ProductId = cd.Product.ProductId,
                    ProductName = cd.Product.ProdName,
                    ProductImg = cd.Product.ProductImg,
                    Quantity = cd.Quantity,
                    PurchaseMode = cd.PurchaseMode.ToString()
                };

                switch (cd.PurchaseMode)
                {
                    case PurchaseMode.MRP:
                        dto.UnitPrice = (decimal)cd.Product.MrpPrice;
                        dto.Subtotal = (decimal)(cd.Product.MrpPrice * cd.Quantity);
                        break;
                    case PurchaseMode.LOYAL_PRICE:
                        dto.UnitPrice = (decimal)cd.Product.LoyalPrice;
                        dto.Subtotal = (decimal)(cd.Product.LoyalPrice * cd.Quantity);
                        break;
                    case PurchaseMode.LOYALTY_POINTS:
                        dto.UnitPrice = (decimal)cd.Product.LoyalPrice;
                        dto.Subtotal = (decimal)(cd.Product.LoyalPrice * cd.Quantity);
                        break;
                }
                return dto;
            }).ToList();
        }

        public async Task UpdateCartQuantitiesAsync(List<CartUpdateRequestDto> updates)
        {
            foreach (var dto in updates)
            {
                var cartDetail = await _context.CartDetails
                    .FirstOrDefaultAsync(cd => cd.CartDetailId == dto.CartDetailId)
                    ?? throw new Exception($"Cart detail not found for ID: {dto.CartDetailId}");

                cartDetail.Quantity += dto.Quantity;
            }
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCartItemAsync(int cartDetailId,string username)
        {

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username)
                ?? throw new Exception("User not found");


            var cartDetail = await _context.CartDetails
                .Include(cd => cd.Cart)
                .FirstOrDefaultAsync(cd => cd.CartDetailId == cartDetailId)
                ?? throw new Exception("Cart detail not found");

            var cartId = cartDetail.CartId;

            _context.CartDetails.Remove(cartDetail);
            await _context.SaveChangesAsync();

            if (cartDetail.PurchaseMode == PurchaseMode.LOYALTY_POINTS && user.Loyalty == true) {
                user.LoyaltyPoints += cartDetail.LoyaltyPoints;
                await _context.SaveChangesAsync();
            }
            bool hasOtherItems = await _context.CartDetails.AnyAsync(cd => cd.CartId == cartId);
            if (!hasOtherItems)
            {
                var cart = await _context.CartMasters.FindAsync(cartId);
                if (cart != null)
                {
                    _context.CartMasters.Remove(cart);
                    await _context.SaveChangesAsync();
                }
            }

            
        }

        public async Task<int> GetUserIdByUsernameAsync(string username)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username)
                ?? throw new Exception($"User not found with username: {username}");
            return user.UserId;
        }
    }
}
