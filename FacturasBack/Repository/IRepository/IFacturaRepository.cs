using FacturasBack.Models;
using FacturasBack.Models.DTO;


namespace FacturasBack.Repository.IRepository
{
    public interface IFacturaRepository : IRepositorio<Factura>
    {
        Task Actualizar( Factura modelo);
        Task<List<FacturaDTO>> ListaFacturasProveedor();
        Task<List<FacturaExportarDTO>> ListaFacturasxId(int id);
        Task<Byte[]> GenerarExcel(string nombreArchivo, List<FacturaExportarDTO> datos);
    }
}
