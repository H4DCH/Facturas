using AutoMapper;
using FacturasBack.Customs;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
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
        private readonly Utilidades _utilidades;
        private readonly IMapper _mapper;
        private readonly ApiResponse apiResponse;
        public UsuarioController(Context context,Utilidades utilidades,IMapper mapper  )
        {
            _context = context;
            _utilidades = utilidades;
            _mapper = mapper;
            apiResponse = new();
        }

        [HttpPost("Registro")]   
        public async Task<ActionResult<ApiResponse>> Registrarse(UsuarioDTO modeloDTO)
        {
            try
            {
                var verificorreo = _context.Usuarios.FirstOrDefaultAsync(c => c.Correo == modeloDTO.Correo);
                if (verificorreo != null)
                {
                    apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    apiResponse.EsExitoso = false;
                    apiResponse.ErrorMessages = new List<string>
                {
                 "El correo ya registrado"
                 };
                    return apiResponse;
                }

                var modelo = _mapper.Map<Usuario>(modeloDTO);
                modelo.Clave = _utilidades.EncriptarSHA256(modelo.Clave!);
                await _context.Usuarios.AddAsync(modelo);
                await _context.SaveChangesAsync();

                if (modelo.Id != 0)
                {
                    apiResponse.StatusCode = HttpStatusCode.OK;
                    apiResponse.Resultado = modelo;
                    return apiResponse;
                }
            }
            catch (Exception ex)
            {
                apiResponse.EsExitoso = false;
                apiResponse.ErrorMessages = new List<string>
                {
                    ex.ToString()
                };
            }

            return apiResponse;

        }

        [HttpPost("Login")]
        public async Task<ActionResult<ApiResponse>> Login(LoginDTO modelo)
        {
            try
            {
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
                var token = _utilidades.GenerarJWT(usuario);
                apiResponse.StatusCode = HttpStatusCode.OK;
                apiResponse.Resultado = token;

                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.EsExitoso = false;
                apiResponse.ErrorMessages = new List<string>
                {
                    ex.ToString()
                };
                return apiResponse;
            }
         
        }
    }
}
