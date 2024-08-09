using FacturasBack.Data;
using FacturasBack.Models;
using Microsoft.EntityFrameworkCore;

namespace FacturasBack.Repository.IRepository
{
    public class ProveedorRepository : Repositorio<Proveedor>, IProveedorRepository
    {
        private readonly Context context;
        public ProveedorRepository(Context context) : base(context)
        {
            this.context = context;
        }

        public async Task Actualizar(Proveedor modelo)
        {         
            context.Proveedores.Update(modelo);
            await Guardar();
        }

        public async Task<Proveedor> ListaFacturasProveedor(int id)
        {
            var Proveedor = await context.Proveedores.Include(f => f.facturas).FirstOrDefaultAsync(p => p.Id == id);

            return Proveedor;
        }
    }
}
