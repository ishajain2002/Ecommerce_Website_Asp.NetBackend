using E_mart.Models;
using E_mart.Services;
using Microsoft.AspNetCore.Mvc;

namespace E_mart.Controllers
{
    [ApiController]
    [Route("api")]
    public class HomeController : ControllerBase
    {
        private readonly IHomeService _homeService;

        public HomeController(IHomeService homeService)
        {
            _homeService = homeService;
        }

        // GET /api/Home
        [HttpGet("Home")]
        public async Task<ActionResult<List<CtgMaster>>> GetProductCategories()
        {
            var categories = await _homeService.GetCategoriesAsync();
            return Ok(categories);
        }

        // GET /api/Home/{s}
        [HttpGet("Home/{s}")]
        public async Task<IActionResult> GetSubCategories(string s)
        {
            var subcatlist = await _homeService.GetSubCategoriesAsync(s);
            if (subcatlist.Any())
                return Ok(subcatlist);

            return NotFound("No subcategories found");
        }

        // GET /api/Home/Products/{s}
        [HttpGet("Home/Products/{s}")]
        public async Task<IActionResult> GetProducts(string s)
        {
            var catMasterId = await _homeService.GetCategoryMasterIdAsync(s);
            if (catMasterId == null)
                return NotFound("Category not found");

            var productlist = await _homeService.GetProductsAsync(catMasterId.Value);
            if (productlist.Any())
                return Ok(productlist);

            return NotFound("No products found");
        }

        // GET /api/Home/offer
        [HttpGet("Home/offer")]
        public async Task<ActionResult<List<CtgMaster>>> GetProductsWithOffer()
        {
            var list = await _homeService.GetProductsWithOfferAsync();
            return Ok(list);
        }

        // GET /api/Home/getproduct/{product_id}
        [HttpGet("Home/getproduct/{product_id}")]
        public async Task<IActionResult> GetSingleProduct(int product_id)
        {
            var product = await _homeService.GetProductAsync(product_id);
            return product == null ? NotFound() : Ok(product);
        }

        // GET /api/Home/getspecialproduct/{ctg_master_id}
        [HttpGet("Home/getspecialproduct/{ctg_master_id}")]
        public async Task<IActionResult> GetProductsFromProduct(int ctg_master_id)
        {
            var product = await _homeService.GetProductFromTableAsync(ctg_master_id);
            return product == null ? NotFound() : Ok(product);
        }

        // GET /api/Home/productdetail/{product_id}
        [HttpGet("Home/productdetail/{product_id}")]
        public async Task<IActionResult> GetDetails(int product_id)
        {
            var details = await _homeService.GetProductDetailsAsync(product_id);
            if (details == null || !details.Any())
                return NotFound("No product details found");
            return Ok(details);
        }
    }
}
