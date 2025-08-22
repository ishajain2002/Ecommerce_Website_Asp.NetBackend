using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("cart_master")]
    public class CartMaster
    {
        [Key]
        [Column("cart_id")]
        public int CartId { get; set; }

        [Column("cart_dt", TypeName = "date")]
        [Required]
        public DateTime CartDate { get; set; }

        // Foreign key to User
        [Column("user_id")]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public virtual User User { get; set; }

        public virtual ICollection<CartDetails> CartDetails { get; set; }

    }
}
