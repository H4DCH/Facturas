using DocumentFormat.OpenXml.Presentation;

namespace FacturasBack.Models.DTO
{
    public class FacturaExportarDTO
    {
        public int numeroFactura { get; set; }
        public double precio { get; set; }
        public DateTime fechaFactura { get; set; }
        public int ProveedorId {get;set;}
        public ProveedorExportarDTO? Proveedor { get; set; } 

    }
}
