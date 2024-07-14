using FacturasBack.Models;
using Microsoft.EntityFrameworkCore;

namespace FacturasBack.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {

        }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<Proveedor> Proveedores { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }    
    }
}
