using System.ComponentModel.DataAnnotations;

namespace FacturasBack.Models.DTO
{
    public class FacturaDTO
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Se debe ingresar el numero de factura")]
        public int NumeroFactura { get; set; }
        [Required(ErrorMessage = "Se debe ingresar el precio de la factura")]
        public double Precio { get; set; }
        public DateTime FechaFactura { get; set; }
        //Llave Foranea 
        public int ProveedorId { get; set; }
        public Proveedor Proveedor { get; set; }
    }
}
