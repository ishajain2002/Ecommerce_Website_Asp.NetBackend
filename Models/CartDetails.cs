using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("cart_details")]
    public class CartDetails
    {
        [Key]
        [Column("cart_d_id")]
        public int CartDetailId { get; set; }

        // Foreign key to CartMaster
        [Column("cart_id")]
        [ForeignKey(nameof(Cart))]
        public int CartId { get; set; }
        public virtual CartMaster Cart { get; set; }

        // Foreign key to ProductMaster
        [Column("product_id")]
        [ForeignKey(nameof(Product))]
        public int ProductId { get; set; }
        public virtual ProductMaster Product { get; set; }

        [Column("quantity", TypeName = "int")]
        [Required]
        public int Quantity { get; set; }

        [Column("mrp", TypeName = "decimal(18,2)")]
        [Required]
        public decimal Mrp { get; set; }

        [Column("loyal_price", TypeName = "decimal(18,2)")]
        [Required]
        public decimal LoyalPrice { get; set; }

        [Column("loyalty_points", TypeName = "int")]
        [Required]
        public int LoyaltyPoints { get; set; }

        [Column("purchase_mode")]
        [Required]
        public PurchaseMode PurchaseMode { get; set; }
    }
}
