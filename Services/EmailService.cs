using System.Net.Mail;
using System.Net;

namespace E_mart.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendInvoiceEmailAsync(string toEmail, byte[] pdfBytes, string fileName)
        {
            using (var message = new MailMessage())
            {
                message.From = new MailAddress(_config["EmailSettings:From"]);
                message.To.Add(toEmail);
                message.Subject = "Your Invoice from Apni Dukaan";
                message.Body = "Dear Customer,\n\nThank you for shopping with us. Please find your invoice attached.\n\nRegards,\nApni Dukaan";
                message.Attachments.Add(new Attachment(new MemoryStream(pdfBytes), fileName, "application/pdf"));

                using (var client = new SmtpClient(_config["EmailSettings:SmtpServer"], int.Parse(_config["EmailSettings:Port"])))
                {
                    client.Credentials = new NetworkCredential(_config["EmailSettings:Username"], _config["EmailSettings:Password"]);
                    client.EnableSsl = true;
                    await client.SendMailAsync(message);
                }
            }
        }
    }
}
