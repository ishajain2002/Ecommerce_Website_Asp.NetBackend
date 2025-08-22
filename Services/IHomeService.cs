using E_mart.Dtos;
using E_mart.Models;

namespace E_mart.Services
{
    public interface IHomeService
    {
        Task<List<CtgMaster>> GetCategoriesAsync();
        Task<List<CtgMaster>> GetSubCategoriesAsync(string subCtgName);
        Task<int?> GetCategoryMasterIdAsync(string ctgId);
        Task<List<ProductMaster>> GetProductsAsync(int ctgMasterId);
        Task<List<ProductDetailsDto>> GetProductDetailsAsync(int productId);
        Task<List<CtgMaster>> GetProductsWithOfferAsync();
        Task<ProductMaster?> GetProductAsync(int productId);
        Task<ProductMaster?> GetProductFromTableAsync(int ctgMasterId);
    }
}
