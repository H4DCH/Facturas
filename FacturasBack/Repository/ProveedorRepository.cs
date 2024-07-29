using AutoMapper;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FacturasBack.Repository.IRepository
{
    public class ProveedorRepository : Repositorio<Proveedor>, IProveedorRepository
    {
        private readonly Context context;
        private readonly IMapper _mapper;
        public ProveedorRepository(Context context, IMapper mapper) : base(context)
        {
            this.context = context;
            _mapper = mapper;
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
