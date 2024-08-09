using AutoMapper;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using FacturasBack.Utilidades;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace FacturasBack.Controllers
{
    [Route("api/proveedor")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IProveedorRepository _proveedorRepository;
        private readonly IFacturaRepository _facturaRepository;
        private readonly ApiResponse response;
        private readonly Mayusculas _mayusculas;
        public ProveedorController(IProveedorRepository proveedorRepository, IMapper mapper, Mayusculas mayusculas, IFacturaRepository facturaRepository)
        {
            _proveedorRepository = proveedorRepository;
            _mapper = mapper;
            _mayusculas = mayusculas;
            response = new();
            _facturaRepository = facturaRepository;
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse>> ObtenerProveedores([FromQuery] PaginacionDTO paginacionDTO)
        {
            try
            {
                var proveedores = await _proveedorRepository.ObtenerTodosConPaginacion(paginacionDTO);
                

                if (proveedores == null)
                {
                    response.EsExitoso = false;
                    response.Resultado = HttpStatusCode.NotFound;
                    response.ErrorMessages = new List<string>() {
                        "Proveedores no encontradas."
                    };
                    return response;
                }

                var listaDTO = _mapper.Map<PaginacionResponse<ProveedorDTO>>(proveedores);
                response.Resultado = listaDTO.resultados;
                response.StatusCode = HttpStatusCode.OK;

                return response;

            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
                return response;
            }

        }


        [HttpGet("{id:int}", Name = "ProveedorxId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> ObtenerProveedorXId([FromRoute]int id)
        {
            try
            {
                var proveedor = await _proveedorRepository.ListaFacturasProveedor(id);
                if (proveedor == null)
                {
                    response.EsExitoso = false;
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.ErrorMessages = new List<string>()
                    {
                        "Proveedor no encontrado"
                    };
                    return response;
                }

                response.Resultado = _mapper.Map<ProveedorDTO>(proveedor);
                response.StatusCode = HttpStatusCode.OK;

                return response;

            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };

                return response;
            }
        }


        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> CrearProveedor([FromBody]ProveedorCreacionDTO modeloCreacionDTO)
        {
            try
            {
                var verificacion = await _proveedorRepository.Verfificacion(p => p.NombreProveedor == modeloCreacionDTO.NombreProveedor);

                if (verificacion == null)
                {
                    modeloCreacionDTO.NombreProveedor = _mayusculas.ConvertirAMayusculas(modeloCreacionDTO.NombreProveedor);
                    var modeloNuevo = _mapper.Map<Proveedor>(modeloCreacionDTO);
                    await _proveedorRepository.Crear(modeloNuevo);

                    response.Resultado = _mapper.Map<ProveedorDTO>(modeloNuevo);
                    response.StatusCode = HttpStatusCode.OK;

                    return CreatedAtRoute("ProveedorxId", new { id = modeloNuevo.Id }, response);
                }

                response.EsExitoso = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages = new List<string>()
                {
                    $"El proveedor con nombre {modeloCreacionDTO.NombreProveedor} ya existe"
                };

                return response;

            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };

                return response;
            }
        }


        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse>> EliminarProveedor([FromRoute]int id)
        {
            try
            {
                var verificacion = await _proveedorRepository.ObtenerxId(id);

                if (verificacion != null)
                {
                    await _proveedorRepository.Eliminar(id);
                    response.StatusCode = HttpStatusCode.NoContent;
                    return response;
                }
                response.EsExitoso = false;
                response.StatusCode = HttpStatusCode.NotFound;
                response.ErrorMessages = new List<string>()
                {
                    $"El proveedor con id {id} no existe"
                };
                return response;

            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };

                return response;
            }
        }




        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> EditarProveedor([FromRoute]int id,[FromBody] ProveedorActualizacionDTO proveedorDTO)
        {
            try
            {

                if (proveedorDTO != null || proveedorDTO?.Id != id)
                {
                    var nombreExiste = await _proveedorRepository.Verfificacion(p => p.NombreProveedor == proveedorDTO!.NombreProveedor);

                    if (nombreExiste != null)
                    {
                        response.EsExitoso = false;
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.ErrorMessages = new List<string>()
                        {
                            $"El nombre {proveedorDTO!.NombreProveedor} ya se encuntra registrado"
                        };
                        return response;
                    }

                    var modelo = _mapper.Map<Proveedor>(proveedorDTO);

                    await _proveedorRepository.Actualizar(modelo);
                    response.Resultado = modelo;
                    response.StatusCode = HttpStatusCode.Created;

                    return CreatedAtRoute("ProveedorxId", new { id = proveedorDTO!.Id }, response);
                }
                response.EsExitoso = false;
                response.StatusCode = HttpStatusCode.NotFound;
                response.ErrorMessages = new List<string>()
                {
                    $"No se encontro el proveedor con id:{id}"
                };

                return response;
            }
            catch (Exception ex)
            {
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };

                return response;
            }

        }
        [HttpGet("GenerarExcel")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async  Task<IActionResult> GenerarExcel([FromQuery]int idProveedor)
        {
            try
            {
                if (idProveedor <= 0)
                {
                    return StatusCode(400, new ApiResponse
                    {
                        EsExitoso = false,
                        StatusCode = HttpStatusCode.BadRequest,
                        ErrorMessages = new List<string> { $"El id {idProveedor} es invalido" }
                    });
                }
                var lista = await _facturaRepository.ListaFacturasxId(idProveedor);

                if (lista == null)
                {
                    return StatusCode(404, new ApiResponse
                    {
                        EsExitoso = false,
                        StatusCode = HttpStatusCode.NotFound,
                        ErrorMessages = new List<string> { $"Las facturas del proveedor con id:{idProveedor} no han sido encontradas" }
                    });
                }

                var nombreProveedor = _proveedorRepository?.ObtenerxId(idProveedor);

                var nombre = $"Facturas {nombreProveedor?.Result.NombreProveedor}";
                var datos = await _facturaRepository.GenerarExcel(nombre, lista);

                return File(datos,
                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                     nombre
                    );
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    EsExitoso = false,
                    ErrorMessages = new List<string>
                    {
                        ex.ToString()
                    }
                    
                });
                ;
                ;
            }
        }

    }
    
}
