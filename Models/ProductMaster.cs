using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("product_master")]
    public class ProductMaster
    {
        [Key]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("prod_name", TypeName = "varchar(20)")]
        public string? ProdName { get; set; }

        [Column("prod_sdesc", TypeName = "varchar(200)")]
        public string? ProdSdesc { get; set; }

        [Column("prod_bdesc", TypeName = "varchar(1000)")]
        public string? ProdBdesc { get; set; }

        [Column("mrp_price")]
        public decimal? MrpPrice { get; set; }

        [Column("loyalty_points")]
        public int? LoyaltyPoints { get; set; }

        [Column("product_img", TypeName = "varchar(50)")]
        public string? ProductImg { get; set; }

        [Column("loyal_price")]
        public decimal? LoyalPrice { get; set; }

        // Foreign Key to CtgMaster
        [Required]
        [ForeignKey("Category")]
        [Column("ctg_master_id")]
        public int? CtgMasterId { get; set; }

        public virtual CtgMaster? Category { get; set; }

        public virtual ICollection<CartDetails>? CartDetails { get; set; }
    }
}
