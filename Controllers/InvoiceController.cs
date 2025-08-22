using E_mart.Dtos;
using E_mart.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using E_mart.Repository;

namespace E_mart.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        //public InvoiceController(IInvoiceService invoiceService)
        //{
        //    _invoiceService = invoiceService;
        //}

        private readonly EmailService _emailService;
        private readonly E_MartDbContext _context;

        public InvoiceController(
            IInvoiceService invoiceService,
            EmailService emailService,
            E_MartDbContext context)
        {
            _invoiceService = invoiceService;
            _emailService = emailService;
            _context = context;
        }

        //[HttpPost("generate")]
        //public async Task<IActionResult> GenerateInvoice([FromBody] InvoiceRequestDto dto)
        //{
        //    var username = User.FindFirstValue(ClaimTypes.Name);
        //    var result = await _invoiceService.GenerateInvoiceAsync(dto, username);
        //    return Ok(result);
        //}

        [HttpGet("all")]
        public async Task<IActionResult> GetAllInvoicesForUser()
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var invoices = await _invoiceService.GetAllInvoicesForUserAsync(username);
            return Ok(invoices);
        }

        [HttpGet("{invoiceId}")]
        public async Task<IActionResult> GetInvoiceDetails(int invoiceId)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var details = await _invoiceService.GetInvoiceDetailsAsync(invoiceId, username);
            return Ok(details);
        }

        [HttpGet("pdf/{invoiceId}")]
        public async Task<IActionResult> DownloadInvoicePdf(int invoiceId)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            var pdfBytes = await _invoiceService.GenerateInvoicePdfAsync(invoiceId, username);

            return File(pdfBytes, "application/pdf", $"Invoice_{invoiceId}.pdf");
        }

        [Authorize]
        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout([FromBody] InvoiceRequestDto dto)
        {
            var username = User.FindFirstValue(ClaimTypes.Name);
            if (string.IsNullOrEmpty(username))
                return Unauthorized();

            // Create invoice from cart
            var invoiceId = await _invoiceService.GenerateInvoiceAsync(dto, username);

            // Generate PDF for invoice
            var pdfBytes = await _invoiceService.GenerateInvoicePdfAsync(invoiceId, username);

            // Get user email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return NotFound("User not found");

            // Send invoice email
            await _emailService.SendInvoiceEmailAsync(user.Email, pdfBytes, $"Invoice_{invoiceId}.pdf");

            return Ok(new { message = "Order placed and invoice emailed successfully", invoiceId });
        }
    }
}
