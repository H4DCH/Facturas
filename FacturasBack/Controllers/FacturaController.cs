﻿using AutoMapper;
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

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/factura")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IFacturaRepository _facturaRepository;
        private readonly IMapper _mapper;
        private readonly ApiResponse response;
        private readonly VerificacionFecha _verificacionFecha;
        public FacturaController(IFacturaRepository _facturaRepository, IMapper mapper, VerificacionFecha verificacionFecha)
        {
            this._facturaRepository = _facturaRepository;
            _mapper = mapper;
            _verificacionFecha = verificacionFecha;
            response = new();
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ApiResponse>> ObtenerFacturas([FromQuery] PaginacionDTO paginacionDTO)
        {
            try
            {   
                var listaFacturas = await _facturaRepository.ObtenerTodosConPaginacion(paginacionDTO,p=>p.Proveedor);
                var listaDTO = _mapper.Map<PaginacionResponse<FacturaDTO>>(listaFacturas);
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
                return  response;
            }
        }

        [HttpGet("GenerarExcel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GenerarExcel()
        {
            try
            {
                var listaFacturas = await _facturaRepository.ListaFacturasProveedor();
                var listaDTO = _mapper.Map<List<FacturaExportarDTO>>(listaFacturas);

                var datos = await _facturaRepository.GenerarExcel("Facturas", listaDTO);

                return File(datos,
                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Facturas"
                    );

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse
                {
                    ErrorMessages = new List<string>{
                        ex.ToString()
                    },
                    EsExitoso = false,
                    StatusCode = HttpStatusCode.InternalServerError
                }) ; ;
            }
        }

        [HttpGet("{id:int}",Name ="ObtenerFacturaxId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> ObtenerFacturaXId([FromRoute]int id)
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

                return StatusCode(500,response);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> CrearFactura([FromBody] FacturaCreacionDTO modeloDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                
                bool verFecha = _verificacionFecha.fechaValida(modeloDTO.FechaFactura);

                if (!verFecha)
                {
                    response.EsExitoso = false;
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.ErrorMessages = new List<string>()
                    {
                        $"La fecha {modeloDTO.FechaFactura} es invalida"
                    };
                    return response;
                }
                     var verificacion = await _facturaRepository.Verfificacion(f => f.NumeroFactura == modeloDTO.NumeroFactura);
                 if (verificacion == null)
                    {
                    var modelonew = _mapper.Map<Factura>(modeloDTO);

                    await _facturaRepository.Crear(modelonew);
                    response.Resultado = modeloDTO;
                    response.StatusCode = HttpStatusCode.Created;
                    return CreatedAtRoute("ObtenerFacturaxId", new { id = modelonew.Id }, response);
                    }

                    response.EsExitoso = false;
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.ErrorMessages = new List<string>()
                        {
                            $"La factura ya existe"
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ApiResponse>> EliminarFactura([FromRoute]int id)
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
                    return response;
                }

                await _facturaRepository.Eliminar(verificacion.Id);
                response.StatusCode = HttpStatusCode.NoContent;
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
        public async Task<ActionResult<ApiResponse>> EditarFactura([FromRoute] int id,[FromBody] FacturaActualizacionDTO facturaDTO)
        {
            try
            {   if (id != 0)
                {
                    if (facturaDTO == null)
                    {
                        response.EsExitoso = false;
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.ErrorMessages = new List<string>
                        {
                            "Factura Invalida"
                        };
                        return response;
                    }
                    var existefactura = await _facturaRepository.Verfificacion(f => f.Id == id);
                    bool verFecha = _verificacionFecha.fechaValida(facturaDTO.FechaFactura);

                    if (verFecha)
                    {
                        if (existefactura != null)
                        {
                            var facturaActu = _mapper.Map<Factura>(facturaDTO);
                            await _facturaRepository.Actualizar(facturaActu);

                            response.Resultado = facturaActu;
                            response.StatusCode = HttpStatusCode.Created;
                            response.Resultado = facturaActu;
                            return  response;
                        }

                        response.EsExitoso = false;
                        response.StatusCode = HttpStatusCode.NotFound;
                        response.ErrorMessages = new List<string>()
                        {
                           $"Factura no encontrada con id: {id} no encontrada"
                            };
                        return response;
                    }

                    response.EsExitoso = false;
                    response.StatusCode = HttpStatusCode.BadRequest;
                    response.ErrorMessages = new List<string>()
                        {
                           $"La fecha debe ser igual o anterior a la fecha actual"
                            };
                    return response;

                }

                response.EsExitoso = false;
                response.StatusCode = HttpStatusCode.BadRequest;
                response.ErrorMessages = new List<string>()
                {
                    $"Id invalido"
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

    }    
    }

