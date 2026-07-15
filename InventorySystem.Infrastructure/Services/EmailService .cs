using InventorySystem.Core.Configurations;
using InventorySystem.Service.Interfaces;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;

namespace InventorySystem.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            try
            {
                using var client = new SmtpClient(_settings.SmtpServer, _settings.Port)
                {
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(
                        _settings.Username,
                        _settings.Password),

                    EnableSsl = _settings.EnableSsl,
                    Timeout = _settings.TimeoutMilliseconds
                };

                var message = new MailMessage
                {
                    From = new MailAddress(
                        _settings.SenderEmail,
                        _settings.SenderName),

                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                message.To.Add(to);

                await client.SendMailAsync(message);

                Console.WriteLine("Email Sent Successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Email Error: {ex.Message}. SMTP={_settings.SmtpServer}:{_settings.Port}, SSL={_settings.EnableSsl}, Timeout={_settings.TimeoutMilliseconds}ms");
                throw;
            }
        }
    }
}
