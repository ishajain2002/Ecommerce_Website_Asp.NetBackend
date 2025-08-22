using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace E_mart.Models
{
    [Table("config_master")]
    public class ConfigMaster
    {
        [Key]
        [Column("config_id")]
        public int ConfigId { get; set; }

        [Column("config_name")]
        public string? ConfigName { get; set; }
    }
}
