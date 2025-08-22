using E_mart.Dtos;
using E_mart.Models;
using E_mart.Repository;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Drawing;
using QuestPDF.Previewer;
using System;

namespace E_mart.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly E_MartDbContext _context;

        public InvoiceService(E_MartDbContext context)
        {
            _context = context;
        }

        //public async Task<string> GenerateInvoiceAsync(InvoiceRequestDto dto, string username)
        //{
        //    // 1️⃣ Get user
        //    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        //    if (user == null)
        //        throw new Exception($"User not found: {username}");

        //    // 2️⃣ Get active cart for user
        //    var cartMaster = await _context.CartMasters
        //        .Include(c => c.CartDetails)
        //        .ThenInclude(cd => cd.Product)
        //        .FirstOrDefaultAsync(c => c.UserId == user.UserId);

        //    if (cartMaster == null)
        //        throw new Exception("No active cart found");

        //    // 3️⃣ Create invoice master
        //    var invoiceMaster = new InvoiceMaster
        //    {
        //        UserId = user.UserId,
        //        InvoiceDate = DateTime.Now,
        //        TotalPayment = dto.TotalPayment,
        //        Tax = dto.Tax,
        //        FinalPayment = dto.FinalPayment
        //    };

        //    _context.InvoiceMasters.Add(invoiceMaster);
        //    await _context.SaveChangesAsync();

        //    // 4️⃣ Add invoice details
        //    foreach (var cd in cartMaster.CartDetails)
        //    {
        //        var detail = new InvoiceDetails
        //        {
        //            InvoiceId = invoiceMaster.InvoiceId,
        //            ProductId = cd.ProductId,
        //            Quantity = cd.Quantity,
        //            Mrp = (double)cd.Mrp,
        //            LoyalPrice = (double)cd.LoyalPrice,
        //            LoyaltyPoints = cd.LoyaltyPoints,
        //            PurchaseMode = cd.PurchaseMode
        //        };
        //        _context.InvoiceDetails.Add(detail);
        //    }

        //    // 5️⃣ Remove cart after checkout
        //    _context.CartDetails.RemoveRange(cartMaster.CartDetails);
        //    _context.CartMasters.Remove(cartMaster);
        //    user.LoyaltyPoints += 100;
        //    _context.Update(user);
        //    await _context.SaveChangesAsync();

        //    return "Invoice created successfully!";
        //}

        public async Task<List<InvoiceViewDto>> GetAllInvoicesForUserAsync(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                throw new Exception("User not found");

            var invoices = await _context.InvoiceMasters
                .Where(i => i.UserId == user.UserId)
                .ToListAsync();

            return invoices.Select(i => new InvoiceViewDto
            {
                InvoiceId = i.InvoiceId,
                InvoiceDate = i.InvoiceDate.Value.ToString("yyyy-MM-dd"),
                TotalPayment = i.TotalPayment,
                Tax = i.Tax,
                FinalPayment = i.FinalPayment
            }).ToList();
        }

        public async Task<List<InvoiceDetailsDto>> GetInvoiceDetailsAsync(int invoiceId, string username)
        {
            // 1️⃣ Get invoice with user info
            var invoice = await _context.InvoiceMasters
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

            if (invoice == null)
                throw new Exception("Invoice not found");

            if (invoice.User.Username != username)
                throw new Exception("Access denied to invoice");

            // 2️⃣ Get details with product info
            var details = await _context.InvoiceDetails
                .Include(d => d.Product)
                .Where(d => d.InvoiceId == invoiceId)
                .ToListAsync();

            // 3️⃣ Map to DTOs
            return details.Select(d => new InvoiceDetailsDto
            {
                ProductId = d.Product.ProductId,
                ProductName = d.Product.ProdName,
                ProductImg = d.Product.ProductImg,
                Quantity = d.Quantity,
                PurchaseMode = d.PurchaseMode.ToString(),
                UnitPrice = GetUnitPrice(d),
                Subtotal = GetSubtotal(d)
            }).ToList();
        }


        public async Task<byte[]> GenerateInvoicePdfAsync(int invoiceId, string username)
        {
            QuestPDF.Settings.License = LicenseType.Community;

            var invoice = await _context.InvoiceMasters
                .Include(i => i.User)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);

            if (invoice == null)
                throw new Exception("Invoice not found");

            if (invoice.User.Username != username)
                throw new Exception("Access denied to invoice");

            var details = await _context.InvoiceDetails
                .Include(d => d.Product)
                .Where(d => d.InvoiceId == invoiceId)
                .ToListAsync();

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(0);
                    page.DefaultTextStyle(x => x.FontSize(12).FontFamily("Arial"));

                    // ===== Top Banner =====
                    page.Header().Height(100).Background("#F44336").Row(row =>
                    {
                        row.RelativeItem().PaddingLeft(20).Column(col =>
                        {
                            col.Item().AlignMiddle().Text("Apni Dukaan")
                                .FontSize(28).Bold().FontColor(Colors.White);
                            col.Item().Text("Your Friendly Store").FontSize(12).FontColor("#F5F5F5");
                        });

                        row.ConstantItem(200).AlignRight().PaddingRight(20).Column(col =>
                        {
                            col.Item().Text($"Invoice #: {invoice.InvoiceId}").FontColor(Colors.White);
                            col.Item().Text($"Date: {invoice.InvoiceDate:dd MMM yyyy}").FontColor(Colors.White);
                        });
                    });

                    // ===== Content =====
                    page.Content().PaddingHorizontal(25).PaddingVertical(15).Column(col =>
                    {
                        col.Spacing(15);

                        // Client Info
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(left =>
                            {
                                left.Item().Text($"Client Name: {invoice.User.Username}").Bold();
                                left.Item().Text($"Invoice No: {invoice.InvoiceId}");
                                left.Item().Text($"Issue Date: {invoice.InvoiceDate:dd MMM yyyy}");
                            });

                            row.RelativeItem().Column(right =>
                            {
                                right.Item().Text("Client Address:").Bold();
                                right.Item().Text("City Name, State, India");
                            });
                        });

                        // Table
                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(4); // Product
                                columns.RelativeColumn(2); // Price
                                columns.RelativeColumn(1); // Qty
                                columns.RelativeColumn(2); // Total
                            });

                            // Header row
                            table.Header(header =>
                            {
                                header.Cell().Background(Colors.Grey.Darken3).Padding(5).Text("Item Description").FontColor(Colors.White);
                                header.Cell().Background(Colors.Grey.Darken3).Padding(5).AlignRight().Text("Price").FontColor(Colors.White);
                                header.Cell().Background(Colors.Grey.Darken3).Padding(5).AlignCenter().Text("Count").FontColor(Colors.White);
                                header.Cell().Background(Colors.Grey.Darken3).Padding(5).AlignRight().Text("Total").FontColor(Colors.White);
                            });

                            // Rows
                            foreach (var d in details)
                            {
                                var unitPrice = GetUnitPrice(d);
                                var subtotal = GetSubtotal(d);

                                table.Cell().Padding(5).Text(d.Product.ProdName);
                                table.Cell().Padding(5).AlignRight().Text($"{unitPrice:C}");
                                table.Cell().Padding(5).AlignCenter().Text(d.Quantity.ToString());
                                table.Cell().Padding(5).AlignRight().Text($"{subtotal:C}");
                            }
                        });

                        // Summary Box
                        col.Item().AlignRight().Table(table =>
                        {
                            table.ColumnsDefinition(c =>
                            {
                                c.RelativeColumn();
                                c.RelativeColumn();
                            });

                            table.Cell().ColumnSpan(2).Background("#FF9800").Padding(8)
                                .Text("Summary").Bold().FontColor(Colors.White);

                            table.Cell().Text("Sub Total");
                            table.Cell().AlignRight().Text($"{invoice.TotalPayment:C}");

                            table.Cell().Text("Tax");
                            table.Cell().AlignRight().Text($"{invoice.Tax:C}");

                            table.Cell().Text("Final Payment").Bold();
                            table.Cell().AlignRight().Text($"{invoice.FinalPayment:C}").Bold().FontColor(Colors.Green.Darken2);
                        });

                        // Payment Methods
                        col.Item().PaddingTop(10).Text("Payment Methods:").Bold();
                        col.Item().Text("We accept UPI, Credit/Debit Cards, Net Banking");
                        col.Item().Text("Pay via UPI: apnidukaan@upi").FontColor(Colors.Blue.Medium);
                    });

                    // ===== Footer =====
                    page.Footer().Background("#F5F5F5").Padding(10).AlignCenter()
                        .Text("❤ Thank you for shopping with Apni Dukaan!")
                        .FontSize(10).FontColor(Colors.Grey.Medium);
                });
            });

            return document.GeneratePdf();
        }




        public async Task<int> GenerateInvoiceAsync(InvoiceRequestDto dto, string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                throw new Exception($"User not found: {username}");

            var cartMaster = await _context.CartMasters
                .Include(c => c.CartDetails)
                .ThenInclude(cd => cd.Product)
                .FirstOrDefaultAsync(c => c.UserId == user.UserId);

            if (cartMaster == null)
                throw new Exception("No active cart found");

            var invoiceMaster = new InvoiceMaster
            {
                UserId = user.UserId,
                InvoiceDate = DateTime.Now,
                TotalPayment = dto.TotalPayment,
                Tax = dto.Tax,
                FinalPayment = dto.FinalPayment
            };

            _context.InvoiceMasters.Add(invoiceMaster);
            await _context.SaveChangesAsync();

            foreach (var cd in cartMaster.CartDetails)
            {
                var detail = new InvoiceDetails
                {
                    InvoiceId = invoiceMaster.InvoiceId,
                    ProductId = cd.ProductId,
                    Quantity = cd.Quantity,
                    Mrp = (double)cd.Mrp,
                    LoyalPrice = (double)cd.LoyalPrice,
                    LoyaltyPoints = cd.LoyaltyPoints,
                    PurchaseMode = cd.PurchaseMode
                };
                _context.InvoiceDetails.Add(detail);
            }

            _context.CartDetails.RemoveRange(cartMaster.CartDetails);
            _context.CartMasters.Remove(cartMaster);

            if (user.Loyalty == true) {
                user.LoyaltyPoints += (int)(invoiceMaster.FinalPayment * 0.5);
            }
            


            _context.Update(user);

            await _context.SaveChangesAsync();

            return invoiceMaster.InvoiceId;
        }








        // 🔹 Helper methods to keep switch logic clean
        private decimal GetUnitPrice(InvoiceDetails d)
        {
            return d.PurchaseMode switch
            {
                PurchaseMode.MRP => d.Product.MrpPrice ?? 0,
                PurchaseMode.LOYAL_PRICE => d.Product.LoyalPrice ?? 0,
                PurchaseMode.LOYALTY_POINTS => d.Product.LoyalPrice ?? 0,
                _ => 0
            };
        }

        private decimal GetSubtotal(InvoiceDetails d)
        {
            return d.PurchaseMode switch
            {
                PurchaseMode.MRP => (d.Product.MrpPrice ?? 0) * d.Quantity,
                PurchaseMode.LOYAL_PRICE => (d.Product.LoyalPrice ?? 0) * d.Quantity,
                PurchaseMode.LOYALTY_POINTS => (d.Product.LoyalPrice ?? 0) * d.Quantity,
                _ => 0
            };
        }
    }
}
