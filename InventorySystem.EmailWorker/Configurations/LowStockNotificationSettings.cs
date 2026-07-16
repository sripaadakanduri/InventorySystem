namespace InventorySystem.Core.Configurations
{
    public class LowStockNotificationSettings
    {
        public int Threshold { get; set; }
        public int MaxProductsInEmail { get; set; }
        public string ProductPageUrl { get; set; } = string.Empty;
    }
}