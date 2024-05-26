namespace FacturasBack.Models.DTO
{
    public class ProveedorActualizacionDTO
    {
        public int Id { get; set; } 
        public string NombreProveedor { get; set; } = string.Empty;
        public DateTime FechaActualizacion { get; set; }
        public ProveedorActualizacionDTO()
        {
            FechaActualizacion = DateTime.Now;
        }
    }
    
}
