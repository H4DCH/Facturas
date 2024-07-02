using FacturasBack.Models;
using FacturasBack.Models.DTO;

namespace FacturasBack.Repository.IRepository
{
    public interface IFacturaRepository : IRepositorio<Factura>
    {
        Task Actualizar( Factura modelo);
    }
}
