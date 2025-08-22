using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("ctg_master")]
    public class CtgMaster
    {
        [Key]
        [Column("ctg_master_id")]
        public int CtgMasterId { get; set; }

        [Required]
        [Column("ctg_id", TypeName = "varchar(20)")]
        public string? CtgId { get; set; }

        [Column("sub_ctg_name", TypeName = "varchar(20)")]
        public string? SubCtgName { get; set; }

        [Column("ctg_name", TypeName = "varchar(30)")]
        public string? CtgName { get; set; }

        [Column("ctg_img_path", TypeName = "varchar(50)")]
        public string? CtgImgPath { get; set; }

        [Column("flag")]
        public bool? Flag { get; set; }

        public virtual ICollection<ProductMaster>? Products { get; set; }

       

        // If there's a relationship with Product or other table, define it here
        // Example:
        // public ICollection<Product> Products { get; set; }
    }
}
