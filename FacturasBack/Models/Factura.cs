using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace FacturasBack.Models
{
    public class Factura
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "Se debe ingresar el numero de factura")]
        public int NumeroFactura { get; set; }
        [Required(ErrorMessage = "Se debe ingresar el precio de la factura")]
        public double Precio { get; set; }
        public DateTime FechaFactura { get; set; }
        public DateTime FechaActualizacion { get; set; }

        //Llave Fornea 
        public int ProveedorId { get; set; }    
        //Propiedad de navegacion
        public Proveedor Proveedor { get; set; }    

    }

    

}
