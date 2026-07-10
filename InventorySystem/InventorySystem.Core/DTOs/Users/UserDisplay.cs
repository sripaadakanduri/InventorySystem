namespace InventorySystem.Core.DTOs.Users
{
    public class UserDisplay:UserDto
    {
        public string CreatedAt { get; set; } = string.Empty;

        public string LastLoginAt { get; set; } = string.Empty;
    }
}