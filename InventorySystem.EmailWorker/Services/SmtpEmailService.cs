using InventorySystem.Core.Configurations;
using InventorySystem.Service.Interfaces;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace InventorySystem.EmailWorker.Services
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
            await SendEmailWithAttachmentAsync(to, subject, body, null, null);
        }

        public async Task SendEmailWithAttachmentAsync(string to, string subject, string body, byte[]? attachmentData = null, string? attachmentName = null)
        {
            try
            {
                using var client = new SmtpClient(_settings.SmtpServer, _settings.Port)
                {
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    EnableSsl = false,
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

                if (attachmentData != null && !string.IsNullOrEmpty(attachmentName))
                {
                    var attachment = new Attachment(new MemoryStream(attachmentData), attachmentName, "application/pdf");
                    if (attachment.ContentDisposition != null)
                    {
                        attachment.ContentDisposition.CreationDate = DateTime.Now;
                        attachment.ContentDisposition.ModificationDate = DateTime.Now;
                        attachment.ContentDisposition.ReadDate = DateTime.Now;
                        attachment.ContentDisposition.FileName = attachmentName;
                        attachment.ContentDisposition.Size = attachmentData.Length;
                        attachment.ContentDisposition.DispositionType = System.Net.Mime.DispositionTypeNames.Attachment;
                    }
                    message.Attachments.Add(attachment);
                }

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
