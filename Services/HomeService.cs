using E_mart.Dtos;
using E_mart.Models;
using E_mart.Repository;
using Microsoft.EntityFrameworkCore;

namespace E_mart.Services
{
    public class HomeService : IHomeService
    {
        private readonly E_MartDbContext _context;

        public HomeService(E_MartDbContext context)
        {
            _context = context;
        }

        public async Task<List<CtgMaster>> GetCategoriesAsync()
        {
            return await _context.CtgMasters
                .Where(c => c.SubCtgName == null && c.Flag == false)
                .ToListAsync();
        }

        public async Task<List<CtgMaster>> GetSubCategoriesAsync(string subCtgName)
        {
            return await _context.CtgMasters
                .Where(c => c.SubCtgName == subCtgName && c.Flag == false)
                .ToListAsync();
        }

        public async Task<int?> GetCategoryMasterIdAsync(string ctgId)
        {
            var cat = await _context.CtgMasters
                .FirstOrDefaultAsync(c => c.CtgId == ctgId);
            return cat?.CtgMasterId;
        }

        public async Task<List<ProductMaster>> GetProductsAsync(int ctgMasterId)
        {
            return await _context.ProductMasters
                .Where(p => p.CtgMasterId == ctgMasterId)
                .ToListAsync();
        }

        public async Task<List<ProductDetailsDto>> GetProductDetailsAsync(int productId)
        {
            // If you added ProdDetailMaster and ConfigMaster entity classes:
            if (_context.Set<ProdDetailMaster>() != null && _context.Set<ConfigMaster>() != null)
            {
                var query = from p in _context.ProdDetailMasters
                            join c in _context.ConfigMasters on p.ConfigId equals c.ConfigId
                            where p.ProductId == productId
                            select new ProductDetailsDto
                            {
                                ProductId = (int)p.ProductId,
                                ConfigName = c.ConfigName,
                                ConfigDtls = p.ConfigDtls
                            };

                return await query.ToListAsync();
            }

            // Fallback: try raw SQL projection if you do not want entity classes (less type-safe)
            var sql = @"
                SELECT p.product_id AS ProductId, c.config_name AS ConfigName, p.config_dtls AS ConfigDtls
                FROM prod_detail_master p
                JOIN config_master c ON p.config_id = c.config_id
                WHERE p.product_id = {0}";

            // EF Core can't map raw SQL to DTO directly, so use ADO.NET if you must. Prefer adding entity types.
            throw new InvalidOperationException("ProdDetailMaster/ConfigMaster not configured in DbContext. Add these entities or map via ADO.NET.");
        }

        public async Task<List<CtgMaster>> GetProductsWithOfferAsync()
        {
            return await _context.CtgMasters
                .Where(c => c.SubCtgName == null && c.Flag == true)
                .ToListAsync();
        }

        public async Task<ProductMaster?> GetProductAsync(int productId)
        {
            return await _context.ProductMasters
                .FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task<ProductMaster?> GetProductFromTableAsync(int ctgMasterId)
        {
            return await _context.ProductMasters
                .FirstOrDefaultAsync(p => p.CtgMasterId == ctgMasterId);
        }
    }
}
