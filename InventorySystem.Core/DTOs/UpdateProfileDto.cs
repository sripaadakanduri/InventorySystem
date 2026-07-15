namespace InventorySystem.Core.DTOs
{
    public class UpdateProfileDto
    {
        public string Username { get; set; }
        public string Email { get; set; }

        // Only required when changing password
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }

        public string? Otp { get; set; }

        public string NotificationSchedule { get; set; } = "N";

    }
}
