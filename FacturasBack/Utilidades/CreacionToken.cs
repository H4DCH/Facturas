using FacturasBack.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FacturasBack.Customs
{
    public class CreacionToken
    {
        private readonly IConfiguration _configuration; 
        // se hace para traer la informacion del appsettings, donde esta el JWT
        public CreacionToken(IConfiguration configuration)
        {
            _configuration = configuration; 
        }

        public string EncriptarSHA256(string texto)
        {
            // instancia del SHA256 y creacion de objeto
            using (SHA256 sha256Hash = SHA256.Create())
            {
                //Computar el hash
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(texto));
                //Convertir array de bytes a string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        public string GenerarJWT(Usuario modelo)
        {
            //Se crea info de usuario para el token
            var userClaims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,modelo.Id.ToString()),
                new Claim(ClaimTypes.Email, modelo.Correo!)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            // Crear detalles del Token
            var jwtConfig = new JwtSecurityToken(
                claims : userClaims,
                expires: DateTime.UtcNow.AddMinutes(20),
                signingCredentials: credentials
                );

            return new JwtSecurityTokenHandler().WriteToken(jwtConfig);
        }
    }
}
