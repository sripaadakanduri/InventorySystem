namespace InventorySystem.Core.Configurations
{
    public class EmailSettings
    {
        public string SmtpServer { get; set; } = string.Empty;

        public int Port { get; set; }

        public string SenderName { get; set; } = string.Empty;

        public string SenderEmail { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public bool EnableSsl { get; set; } = true;

        public int TimeoutMilliseconds { get; set; } = 30000;
    }
}
