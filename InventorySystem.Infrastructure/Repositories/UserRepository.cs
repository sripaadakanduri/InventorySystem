using InventorySystem.Service.Data;
using InventorySystem.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace InventorySystem.Service.Repositories
{
    public class UserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User>  GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            email = email.Trim().ToLowerInvariant();

            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }
        
        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
        }
    }
}
