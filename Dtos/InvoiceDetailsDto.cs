namespace E_mart.Dtos
{
    public class InvoiceDetailsDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductImg { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal { get; set; }
        public string PurchaseMode { get; set; }
    }
}
