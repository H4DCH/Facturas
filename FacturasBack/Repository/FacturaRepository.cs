using AutoMapper;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace FacturasBack.Repository
{
    public class FacturaRepository : Repositorio<Factura>, IFacturaRepository
    {
        private readonly IMapper _mapper;
        private readonly Context context;
        public FacturaRepository(Context context,IMapper mapper) : base(context)
        {
            this.context = context;
            _mapper = mapper;
        }

        public async Task Actualizar(Factura modelo)
        {
            context.Facturas.Update(modelo);
            await Guardar();
        }

        public async Task<List<FacturaDTO>> ListaFacturasProveedor()
        {
           var Lista = await context.Facturas.Include(p => p.Proveedor).ToListAsync();

            var listaMap = _mapper.Map<List<FacturaDTO>>(Lista);  

            return listaMap;
        }
    }
}
