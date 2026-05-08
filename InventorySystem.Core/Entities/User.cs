namespace InventorySystem.Core.Entities
{
    public class User
    {
        public int id { get; set;  }
        public string Username { get; set; }
        public string Email { get; set; }

        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }

    }
}
