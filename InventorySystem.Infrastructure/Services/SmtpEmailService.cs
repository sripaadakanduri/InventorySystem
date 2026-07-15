using InventorySystem.Core.Configurations;
using InventorySystem.Service.Interfaces;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace InventorySystem.Service.Services
{
    public class SmtpEmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public SmtpEmailService(IOptions<EmailSettings> options)
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
                    EnableSsl = false,               // smtp4dev default
                    UseDefaultCredentials = true,
                    Timeout = _settings.TimeoutMilliseconds
                };

                using var message = new MailMessage
                {
                    From = new MailAddress(
                        _settings.SenderEmail,
                        _settings.SenderName),

                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                message.To.Add(to);

                Console.WriteLine($"Connecting to {_settings.SmtpServer}:{_settings.Port}");
                Console.WriteLine("Sending email...");

                await client.SendMailAsync(message);

                Console.WriteLine("Email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Email Error: {ex.Message}. SMTP={_settings.SmtpServer}:{_settings.Port}, Timeout={_settings.TimeoutMilliseconds}ms");

                throw;
            }
        }
    }
}