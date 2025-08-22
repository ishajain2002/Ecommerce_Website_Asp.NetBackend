namespace E_mart.Dtos
{
    public class InvoiceViewDto
    {
        public int InvoiceId { get; set; }
        public string InvoiceDate { get; set; }
        public double TotalPayment { get; set; }
        public double Tax { get; set; }
        public double FinalPayment { get; set; }
    }
}
