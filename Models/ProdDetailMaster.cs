using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("prod_detail_master")]
    public class ProdDetailMaster
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }                // primary key of the detail table (adjust if different)

        [Column("product_id")]
        public int? ProductId { get; set; }

        [Column("config_id")]
        public int? ConfigId { get; set; }

        [Column("config_dtls")]
        public string? ConfigDtls { get; set; }

        // navigation not required but you can add if you like:
        public ConfigMaster? Config { get; set; }
    }
}
