namespace FacturasBack.Models
{
    public class Proveedor
    {
        public int Id { get; set; }
        public string NombreProveedor { get; set; } = string.Empty; 
        public DateTime FechaActualizacion { get; set; }
        public List<Factura>? facturas { get; set; } 
    }
}
