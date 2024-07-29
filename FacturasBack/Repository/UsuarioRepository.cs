using FacturasBack.Customs;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Repository.IRepository;

namespace FacturasBack.Repository
{
    public class UsuarioRepository : IUsuarioRepositorio
    {
        private readonly Context _context;
        private readonly CreacionToken _utilidades;

        public UsuarioRepository(Context context,CreacionToken utilidades)
        {
            _context = context;
            _utilidades = utilidades;
        }

        public async Task<Usuario> CrearUsuario(Usuario modelo)
        {
            modelo.Clave = _utilidades.EncriptarSHA256(modelo.Clave);
            _context.Usuarios.Add(modelo);
             await Guardar();
            return modelo;

        }

        public Task<string> InicioSesion(Usuario modelo)
        {
            var token =  _utilidades.GenerarJWT(modelo);
            return Task.FromResult(token);

        }

        private async Task Guardar()
        {
            await _context.SaveChangesAsync();
        }
    }
}
