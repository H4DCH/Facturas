using AutoMapper;
using FacturasBack.Customs;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;   
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FacturasBack.Controllers
{
    [Route("api/usuario")]
    [ApiController]
    [AllowAnonymous]
    public class UsuarioController : ControllerBase
    {
        private readonly Context _context;
        private readonly CreacionToken _utilidades;
        private readonly IMapper _mapper;
        private readonly ApiResponse apiResponse;
        private readonly IUsuarioRepositorio _usuarioRepository;

        public UsuarioController(Context context,CreacionToken utilidades,IMapper mapper, IUsuarioRepositorio usuarioRepository)
        {
            _context = context;
            _utilidades = utilidades;
            _mapper = mapper;
            _usuarioRepository = usuarioRepository;
            apiResponse = new();
        }

        [HttpPost("RegistroUsuario")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<ApiResponse>> RegistroUsuario([FromBody]UsuarioDTO modeloDTO)
        {
            try
            {
                if(modeloDTO == null)
                {
                    apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    apiResponse.EsExitoso = false;
                    apiResponse.ErrorMessages = new List<string>
                    {
                        "Todos los datos son obligatorios"
                    };
                    return BadRequest(apiResponse);
                }

                var verificorreo = await _context.Usuarios.FirstOrDefaultAsync(c => c.Correo == modeloDTO.Correo);

                if (verificorreo !=null)
                {
                    apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    apiResponse.EsExitoso = false;
                    apiResponse.ErrorMessages = new List<string>
                {
                 "El correo ya registrado"
                 };
                    return BadRequest(apiResponse);
                }

                var modelo = _mapper.Map<Usuario>(modeloDTO);
                var usuarioNuevo = await _usuarioRepository.CrearUsuario(modelo);

                apiResponse.StatusCode = HttpStatusCode.OK;
                apiResponse.Resultado = usuarioNuevo;

                return CreatedAtAction("RegistroUsuario",apiResponse);

            }
            catch (Exception ex)
            {
                apiResponse.StatusCode = HttpStatusCode.InternalServerError;
                apiResponse.EsExitoso = false;
                apiResponse.ErrorMessages = new List<string>
                {   
                    ex.ToString()
                };

                return StatusCode(500,apiResponse);
            }     

        }

        [HttpPost("InicioSesion")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse>> InicioSesion([FromBody]LoginDTO modelo)
        {
            try
            {
                if(modelo == null)
                {
                    apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    apiResponse.EsExitoso = false;
                    apiResponse.ErrorMessages = new List<string>
                    {
                        "Se debe ingresar correo y contraseña"
                    };

                    return BadRequest(apiResponse);

                }
                var usuario = await _context.Usuarios.
                Where(m => m.Correo == modelo.Correo && m.Clave == _utilidades.EncriptarSHA256(modelo.Clave)).FirstOrDefaultAsync();
                if (usuario == null)
                {
                    apiResponse.StatusCode = HttpStatusCode.NotFound;
                    apiResponse.EsExitoso = false;
                    apiResponse.ErrorMessages = new List<string>
                {
                    "Usuario o contraseña incorrectos"
                };
                    return apiResponse;
                }

                var modeloDTO = _mapper.Map<Usuario>(modelo);
           
                apiResponse.StatusCode = HttpStatusCode.OK;
                apiResponse.Resultado = _usuarioRepository.InicioSesion(modeloDTO);

                return Ok(apiResponse);
            }
            catch (Exception ex)
            {
                apiResponse.StatusCode = HttpStatusCode.InternalServerError;
                apiResponse.EsExitoso = false;
                apiResponse.ErrorMessages = new List<string>
                {
                    ex.ToString()
                };
                return StatusCode(500,apiResponse);
            }
         
        }
    }
}
