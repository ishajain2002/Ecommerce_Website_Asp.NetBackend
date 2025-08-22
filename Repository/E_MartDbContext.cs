using E_mart.Models;
using Microsoft.EntityFrameworkCore;

namespace E_mart.Repository
{
    public class E_MartDbContext : DbContext
    {
        public E_MartDbContext(DbContextOptions<E_MartDbContext> options) : base(options)
        {
        }

        // DbSets for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<ProductMaster> ProductMasters { get; set; }
        public DbSet<CtgMaster> CtgMasters { get; set; }
        public DbSet<CartMaster> CartMasters { get; set; }
        public DbSet<CartDetails> CartDetails { get; set; }
        public DbSet<InvoiceMaster> InvoiceMasters { get; set; }
        public DbSet<InvoiceDetails> InvoiceDetails { get; set; }
        public DbSet<ProdDetailMaster> ProdDetailMasters { get; set; }
        public DbSet<ConfigMaster> ConfigMasters { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Enum mapping as string for PurchaseMode
            modelBuilder
                .Entity<CartDetails>()
                .Property(cd => cd.PurchaseMode)
                .HasConversion<string>();

            modelBuilder
                .Entity<InvoiceDetails>()
                .Property(id => id.PurchaseMode)
                .HasConversion<string>();

            // User -> CartMaster (1:N)
            modelBuilder.Entity<CartMaster>()
                .HasOne(cm => cm.User)
                .WithMany() // No navigation property in User
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // CartMaster -> CartDetails (1:N)
            modelBuilder.Entity<CartDetails>()
                .HasOne(cd => cd.Cart)
                .WithMany(cm => cm.CartDetails)
                .HasForeignKey(cd => cd.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            // ProductMaster -> CartDetails (1:N)
            modelBuilder.Entity<CartDetails>()
                .HasOne(cd => cd.Product)
                .WithMany(pm => pm.CartDetails)
                .HasForeignKey(cd => cd.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            // CtgMaster -> ProductMaster (1:N)
            modelBuilder.Entity<ProductMaster>()
                .HasOne(pm => pm.Category)
                .WithMany(cm => cm.Products)
                .HasForeignKey(pm => pm.CtgMasterId)
                .OnDelete(DeleteBehavior.Cascade);

            // InvoiceMaster -> User (M:1)
            modelBuilder.Entity<InvoiceMaster>()
                .HasOne(im => im.User)
                .WithMany() // No navigation property in User
                .HasForeignKey(im => im.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // InvoiceDetails -> InvoiceMaster (M:1)
            modelBuilder.Entity<InvoiceDetails>()
                .HasOne(id => id.Invoice)
                .WithMany() // No navigation property in InvoiceMaster
                .HasForeignKey(id => id.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // InvoiceDetails -> ProductMaster (M:1)
            modelBuilder.Entity<InvoiceDetails>()
                .HasOne(id => id.Product)
                .WithMany() // No navigation property in ProductMaster for invoices
                .HasForeignKey(id => id.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
