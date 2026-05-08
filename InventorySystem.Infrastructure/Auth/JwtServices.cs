
using System.IdentityModel.Tokens.Jwt;
using InventorySystem.Core.Entities;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
namespace InventorySystem.Infrastructure.Auth
{
    public class JwtServices
    {
        private readonly IConfiguration _configuration;

        public JwtServices(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name , user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var  token  = new JwtSecurityToken(

                claims:claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials:credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
