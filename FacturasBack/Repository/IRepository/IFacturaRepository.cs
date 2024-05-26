using FacturasBack.Models;

namespace FacturasBack.Repository.IRepository
{
    public interface IFacturaRepository : IRepositorio<Factura>
    {
        Task Actualizar( Factura modelo);
    }
}
