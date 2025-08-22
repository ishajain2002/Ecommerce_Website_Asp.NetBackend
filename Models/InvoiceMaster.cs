using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("invoice_master")]
    public class InvoiceMaster
    {
        [Key]
        [Column("invoice_id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InvoiceId { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        public virtual User User { get; set; }

        [Column("invoice_date")]
        public DateTime? InvoiceDate { get; set; }  // Nullable like Java LocalDate

        [Column("total_payment")]
        public double TotalPayment { get; set; }

        [Column("tax")]
        public double Tax { get; set; }

        [Column("final_payment")]
        public double FinalPayment { get; set; }
    }
}
