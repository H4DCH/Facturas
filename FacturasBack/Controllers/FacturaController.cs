using AutoMapper;
using Azure;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;


namespace FacturasBack.Controllers
{
    [Route("api/factura")]
    [ApiController]
    public class FacturaController : ControllerBase
    {

        private readonly IFacturaRepository _facturaRepository;
        private readonly IMapper _mapper;
        private readonly ApiResponse response;
        public FacturaController(IFacturaRepository _facturaRepository, IMapper mapper)
        {
            this._facturaRepository = _facturaRepository;
            _mapper = mapper;
            response = new();
        }

        [HttpGet(Name = "ListaFacturas")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<ApiResponse>> ListaFacturas()
        {
            try
            {
                List<Factura> listaFacturas = await _facturaRepository.ListaFacturasProveedor();
                response.Resultado = _mapper.Map<List<FacturaDTO>>(listaFacturas);
                response.StatusCode = HttpStatusCode.OK;
                return Ok(response);
            }
            catch (Exception ex)
            {
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;
        }

        [HttpGet("{id:int}", Name = "FacturaxId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<ApiResponse>> FacturaxId(int id)
        {
            try
            {
                var factura = await _facturaRepository.ObtenerxId(id);

                if (factura == null)
                {
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.EsExitoso = false;
                    response.ErrorMessages = new List<string>()
                    {
                        $"Facura con Id: {id} no encontrado"
                    };
                    return NotFound(response);
                }

                response.Resultado = _mapper.Map<FacturaDTO>(factura);
                response.StatusCode = HttpStatusCode.OK;
                return Ok(response);

            }
            catch (Exception ex)
            {
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<ApiResponse>> FacturaNueva([FromBody] FacturaCreacionDTO modeloDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var verificacion = await _facturaRepository.Verfificacion(f => f.NumeroFactura == modeloDTO.NumeroFactura);

                if (verificacion == null)
                {
                    var modelonew = _mapper.Map<Factura>(modeloDTO);

                    await _facturaRepository.Crear(modelonew);
                    response.Resultado = modeloDTO;
                    response.StatusCode = HttpStatusCode.Created;
                    return CreatedAtRoute("FacturaxId", new { id = modelonew.Id }, response);
                }
                else
                    response.EsExitoso = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages = new List<string>()
                    {
                        "La factura ya existe"
                    };
                return BadRequest(response);
            }
            catch (Exception ex)
            {
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;
        }



        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<ActionResult<ApiResponse>> EliminarFactura(int id)
        {
            try
            {
                var verificacion = await _facturaRepository.Verfificacion(f => f.Id == id);

                if (verificacion == null)
                {
                    response.EsExitoso = false;
                    response.StatusCode = HttpStatusCode.NotFound;
                    response.ErrorMessages = new List<string>()
                    {
                        $"Factura con Id: {id} no encontrado"
                    };
                    return NotFound(response);
                }

                await _facturaRepository.Eliminar(verificacion.Id);
                response.StatusCode = HttpStatusCode.NoContent;
                return Ok(response);

            }
            catch (Exception ex)
            {
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
        public async Task<ActionResult<ApiResponse>> EditarFactura(int id, FacturaActualizacionDTO facturaDTO)
        {
            try
            {   if (id != 0)
                {
                    if (facturaDTO == null)
                    {
                        response.EsExitoso = false;
                        response.StatusCode = HttpStatusCode.BadRequest;
                        return BadRequest(response);
                    }
                    var existefactura = await _facturaRepository.Verfificacion(f => f.Id == id);

                    if (existefactura == null)
                    {
                        response.EsExitoso = false;
                        response.StatusCode = HttpStatusCode.NotFound;
                        response.ErrorMessages = new List<string>()
                        {
                            $"Factura no encontrada con id: {id} no encontrada"
                        };
                        return NotFound(response);
                    }
                    var facturaActu = _mapper.Map<Factura>(facturaDTO);
                    await _facturaRepository.Actualizar(facturaActu);

                    response.Resultado = facturaActu;
                    response.StatusCode = HttpStatusCode.Created;

                    return CreatedAtRoute("FacturaxId", new { id = facturaDTO.Id }, response);
                }

                response.EsExitoso = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages = new List<string>()
                {
                    $"Id invalido"
                };
                return BadRequest(response);
            }

            catch (Exception ex)
            {
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;
        }

    }    
    }

