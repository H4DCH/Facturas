using FacturasBack.Models;
using FacturasBack.Models.DTO;

namespace FacturasBack.Repository.IRepository
{
    public interface IProveedorRepository : IRepositorio<Proveedor>
    {
        Task Actualizar(Proveedor modelo);
        Task <Proveedor> ListaFacturasProveedor(int id);
        Task<List<FacturaDTO>> ListaFacturasxId(int id);
    }
}
