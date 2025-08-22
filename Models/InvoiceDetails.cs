using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("invoice_details")]
    public class InvoiceDetails
    {
        [Key]
        [Column("invoice_dtl_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InvoiceDtlId { get; set; }

        [ForeignKey("Invoice")]
        [Column("invoice_id")]
        public int InvoiceId { get; set; }

        public virtual InvoiceMaster Invoice { get; set; }

        [ForeignKey("Product")]
        [Column("product_id")]
        public int ProductId { get; set; }

        public virtual ProductMaster Product { get; set; }

        [Column("quantity")]
        public int Quantity { get; set; }

        [Column("mrp")]
        public double Mrp { get; set; }

        [Column("loyal_price")]
        public double LoyalPrice { get; set; }

        [Column("loyalty_points")]
        public int LoyaltyPoints { get; set; }

        [Column("purchase_mode")]
        public PurchaseMode PurchaseMode { get; set; }
    }
}
