using AutoMapper;
using FacturasBack.Customs;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FacturasBack.Controllers
{
    [Route("api/usuario")]
    [ApiController]
    [AllowAnonymous]
    public class UsuarioController : ControllerBase
    {
        private readonly Context _context;
        private readonly Utilidades _utilidades;
        private readonly IMapper _mapper;
        public UsuarioController(Context context,Utilidades utilidades,IMapper mapper  )
        {
            _context = context;
            _utilidades = utilidades;
            _mapper = mapper;
        }

        [HttpPost("Registro")]   
        public async Task<ActionResult> Registrarse(UsuarioDTO modeloDTO)
        {
            var modelo = _mapper.Map<Usuario>(modeloDTO);
            modelo.Clave = _utilidades.EncriptarSHA256(modelo.Clave!);
            await _context.Usuarios.AddAsync(modelo);
            await _context.SaveChangesAsync();

            if (modelo.Id != 0)
                return StatusCode(StatusCodes.Status200OK, new {isSuccess = true});
            else
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = false });
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login(LoginDTO modelo)
        {
            var usuario = await _context.Usuarios.
                Where(m => m.Correo == modelo.Correo && m.Clave == _utilidades.EncriptarSHA256(modelo.Clave)).FirstOrDefaultAsync();

            if (usuario == null)
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, token = "" });
            else
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, token = _utilidades.GenerarJWT(usuario) });
        }
    }
}
