using E_mart.Models;

namespace E_mart.Dtos
{
    public class CartRequestDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public PurchaseMode PurchaseMode { get; set; }
    }
}
