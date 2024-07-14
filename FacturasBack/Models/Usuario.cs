using System.ComponentModel.DataAnnotations;

namespace FacturasBack.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="El nombre es obligatorio")]  
        public string? Nombre { get; set; }
        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress]
        public string? Correo { get; set; }
        public string? Clave { get; set; }
    }
}
