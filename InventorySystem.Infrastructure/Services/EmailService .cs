using InventorySystem.Core.Configurations;
using InventorySystem.Service.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace InventorySystem.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }


        public async Task SendEmailAsync(
            string to,
            string subject,
            string body)
        {
            var email = new MimeMessage();

            email.From.Add(
                new MailboxAddress(
                    _settings.SenderName,
                    _settings.SenderEmail));

            email.To.Add(
                MailboxAddress.Parse(to));

            email.Subject = subject;

            email.Body = new TextPart("plain")
            {
                Text = body
            };


            using var client = new SmtpClient();

            try
            {
                // Testing only
                client.CheckCertificateRevocation = false;


                Console.WriteLine(
                    $"Connecting SMTP {_settings.SmtpServer}:{_settings.Port}");


                SecureSocketOptions socketOptions;

                if (_settings.EnableSsl &&
                    _settings.Port == 465)
                {
                    socketOptions = SecureSocketOptions.SslOnConnect;
                }
                else if (_settings.EnableSsl &&
                         _settings.Port == 587)
                {
                    socketOptions = SecureSocketOptions.StartTls;
                }
                else
                {
                    socketOptions = SecureSocketOptions.Auto;
                }


                // CONNECT
                using var connectTimeout =
                    new CancellationTokenSource(
                        TimeSpan.FromMilliseconds(
                            _settings.TimeoutMilliseconds));


                await client.ConnectAsync(
                    _settings.SmtpServer,
                    _settings.Port,
                    socketOptions,
                    connectTimeout.Token);


                Console.WriteLine("SMTP Connected");


                // AUTHENTICATE
                using var authTimeout =
                    new CancellationTokenSource(
                        TimeSpan.FromMilliseconds(
                            _settings.TimeoutMilliseconds));


                await client.AuthenticateAsync(
                    _settings.Username,
                    _settings.Password,
                    authTimeout.Token);


                Console.WriteLine("SMTP Authenticated");


                // SEND
                using var sendTimeout =
                    new CancellationTokenSource(
                        TimeSpan.FromMilliseconds(
                            _settings.TimeoutMilliseconds));


                await client.SendAsync(
                    email,
                    sendTimeout.Token);


                Console.WriteLine("Email Sent");


                // DISCONNECT
                if (client.IsConnected)
                {
                    await client.DisconnectAsync(true);
                }


                Console.WriteLine("SMTP Disconnected");
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine(
                    "SMTP operation timed out.");

                throw new Exception(
                    "Email sending timed out.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Email Error: {ex.Message}");

                Console.WriteLine(
                    ex.StackTrace);

                throw;
            }
        }
    }
}