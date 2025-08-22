using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E_mart.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

        [Column("username")]
        [MaxLength(30)]
        public string Username { get; set; }

        [Column("phone_no")]
        [MaxLength(10)]
        public string PhoneNo { get; set; }

        [Column("email")]
        [MaxLength(320)]
        public string Email { get; set; }

        [Column("password")]
        [MaxLength(100)]
        public string Password { get; set; }

        [Column("loyalty_points")]
        public int LoyaltyPoints { get; set; }

        [Column("loyalty")]
        public bool Loyalty { get; set; }
    }
}
