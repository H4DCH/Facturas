using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace FacturasBack.Repository
{
    public class FacturaRepository : Repositorio<Factura>, IFacturaRepository
    {
        private readonly Context context;
        public FacturaRepository(Context context) : base(context)
        {
            this.context = context;
        }

        public async Task Actualizar(Factura modelo)
        {
            context.Facturas.Update(modelo);
            await Guardar();
        }
    }
}
