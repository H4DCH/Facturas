namespace FacturasBack.Models.DTO
{
    public class ProveedorDTO
    {
        public int Id { get; set; }
        public string NombreProveedor { get; set; } = string.Empty;
        public List<FacturaDTO>? facturas { get; set; }
    }
}
