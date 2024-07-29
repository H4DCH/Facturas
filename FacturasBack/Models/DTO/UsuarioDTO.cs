using System.ComponentModel.DataAnnotations;

namespace FacturasBack.Models.DTO
{
    public class UsuarioDTO
    {
        [Required(ErrorMessage ="El nombre es obligatorio")]
        public string Nombre { get; set; }
        [Required(ErrorMessage = "El correo es obligatorio")]
        public string Correo { get; set; }
        [Required(ErrorMessage = "La clave es obligatorio")]
        public string Clave { get; set; }
    }
}
