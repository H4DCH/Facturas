using FacturasBack.Models;

namespace FacturasBack.Repository.IRepository
{
    public interface IUsuarioRepositorio
    {
        Task<Usuario> CrearUsuario(Usuario modelo);
        Task<string> InicioSesion(Usuario modelo);
    }
}
