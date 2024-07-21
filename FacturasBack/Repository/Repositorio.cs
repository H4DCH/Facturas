using FacturasBack.Data;
using FacturasBack.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FacturasBack.Repository
{
    public class Repositorio<T> : IRepositorio<T> where T : class
    {
        private readonly Context contextFactura;
        
        public Repositorio(Context contextFactura)
        {
            this.contextFactura = contextFactura;
        }

        //Clase creada generica para no instanciar mas clases
        protected DbSet<T> EntitySet
        {
            get
            {
                return contextFactura.Set<T>();
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
           T entidad = await EntitySet.FindAsync(id);
            EntitySet.Remove(entidad);

            await Guardar();
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
            await contextFactura.SaveChangesAsync();
        }

        public async Task<T> Verfificacion(Expression<Func<T, bool>> expr)
        {
            return await EntitySet.AsNoTracking().FirstOrDefaultAsync(expr);
        }
    }
    
}
    