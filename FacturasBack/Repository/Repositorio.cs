using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FacturasBack.Repository
{
    public class Repositorio<T> : IRepositorio<T> where T : class
    {
        private readonly Context context;
        
        public Repositorio(Context context)
        {
            this.context = context;
        }

        protected DbSet<T> EntitySet
        {
            get
            {
                return context.Set<T>();
            }
        }

        public async Task<T> Crear(T modelo)
        {
            EntitySet.Add(modelo);
            await Guardar();
            return modelo;  
        }

        public async Task Eliminar(int id)
        {
           var entidad = await EntitySet.FindAsync(id);
            if (entidad != null)
            {

                EntitySet.Remove(entidad);
                await Guardar();
            }

        }

        public async Task<List<T>> ObtenerTodos()
        {
            return await EntitySet.ToListAsync();   
        }

        public async Task<T> ObtenerxId(int id)
        {
            return await EntitySet.FindAsync(id);
        }

        public async Task Guardar()
        {
            await context.SaveChangesAsync();
        }

        public async Task<T> Verfificacion(Expression<Func<T, bool>> expr)
        {
            return await EntitySet.AsNoTracking().FirstOrDefaultAsync(expr);
        }   

        public async Task<PaginacionResponse<T>> ObtenerTodosConPaginacion(PaginacionDTO paginacionDTO,params Expression<Func<T, object>>[]includes)
        {
            var query =  EntitySet.AsQueryable();

            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            var totalResultado = await query.CountAsync();

            var resultado = await query
                .Skip((paginacionDTO.pagina - 1) * paginacionDTO.datosPorPagina)
                .Take(paginacionDTO.datosPorPagina)
                .ToListAsync();

            return new PaginacionResponse<T>(resultado, totalResultado,paginacionDTO.pagina,paginacionDTO.datosPorPagina);
        }
    }
    
}
    