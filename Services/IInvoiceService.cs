using E_mart.Dtos;

namespace E_mart.Services
{
    public interface IInvoiceService
    {
        //Task<string> GenerateInvoiceAsync(InvoiceRequestDto dto, string username);
        Task<List<InvoiceViewDto>> GetAllInvoicesForUserAsync(string username);
        Task<List<InvoiceDetailsDto>> GetInvoiceDetailsAsync(int invoiceId, string username);

        Task<byte[]> GenerateInvoicePdfAsync(int invoiceId, string username);

        Task<int> GenerateInvoiceAsync(InvoiceRequestDto dto, string username);
    }
}
