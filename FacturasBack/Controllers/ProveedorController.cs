using AutoMapper;
using AutoMapper.Configuration.Annotations;
using AutoMapper.Configuration.Conventions;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using FacturasBack.Utilidades;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using System.Data;
using System.Net;

namespace FacturasBack.Controllers
{
    [Route("api/proveedor")]
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
        public async Task<ActionResult<ApiResponse>> ListaProveedor()
        {
            try
            {
                List<Proveedor> proveedores = await _proveedorRepository.ObtenerTodos();
                if (proveedores == null)
                {
                    response.EsExitoso = false;
                    response.Resultado = HttpStatusCode.NotFound;
                    response.ErrorMessages = new List<string>() {
                        "Facturas no encontradas."
                    };
                    return response;
                }
                response.Resultado = _mapper.Map<List<ProveedorDTO>>(proveedores);
                response.StatusCode = HttpStatusCode.OK;

                return response;

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


        [HttpGet("{id:int}", Name = "ProveedorxId")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse>> ProveedorxId(int id)
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
        public async Task<ActionResult<ApiResponse>> ProveedorNuevo(ProveedorCreacionDTO modeloCreacionDTO)
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
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;
        }


        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse>> EliminarProveedor(int id)
        {
            try
            {
                var verificacion = _proveedorRepository.ObtenerxId(id);

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
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;
        }




        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<ActionResult<ApiResponse>> ActualizarProveedor(int id, ProveedorActualizacionDTO proveedorDTO)
        {
            try
            {

                if (proveedorDTO != null || proveedorDTO?.Id != id)
                {
                    var nombreExiste = await _proveedorRepository.Verfificacion(p => p.NombreProveedor == proveedorDTO.NombreProveedor);

                    if (nombreExiste != null)
                    {
                        response.EsExitoso = false;
                        response.StatusCode = HttpStatusCode.BadRequest;
                        response.ErrorMessages = new List<string>()
                        {
                            $"El nombre {proveedorDTO.NombreProveedor} ya se encuntra registrado"
                        };
                        return response;
                    }

                    var modelo = _mapper.Map<Proveedor>(proveedorDTO);

                    await _proveedorRepository.Actualizar(modelo);
                    response.Resultado = modelo;
                    response.StatusCode = HttpStatusCode.Created;

                    return CreatedAtRoute("ProveedorxId", new { id = proveedorDTO.Id }, response);
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
                response.EsExitoso = false;
                response.ErrorMessages = new List<string>()
                {
                    ex.ToString()
                };
            }
            return response;

        }
        [HttpGet("Exportar")]
        public async Task<FileResult> Exportar(int idProveedor)
        {
            var lista = await _proveedorRepository.ListaFacturasxId(idProveedor);
            var nombreProveedor = _proveedorRepository?.ObtenerxId(idProveedor);

            var nombre = $"Facturas {nombreProveedor?.Result.NombreProveedor}";
            return await (GenerarExcel(nombre,lista));
        }

        private Task<FileResult> GenerarExcel(string NombreArcvhivo, List<FacturaDTO> facturas)
        {
            DataTable dataTable = new DataTable(NombreArcvhivo);

            dataTable.Columns.AddRange(new DataColumn[]
            {
                new DataColumn("Nombre Proveedor"),
                new DataColumn("Numero"),
                new DataColumn("Precio"),
                new DataColumn("Fecha")
            });

            foreach (var factura in facturas)
            {
                dataTable.Rows.Add(
                    factura.Proveedor.NombreProveedor,
                    factura.NumeroFactura,
                    factura.Precio,
                    factura.FechaFactura);
            }

            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dataTable);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return Task.FromResult<FileResult>(File(stream.ToArray(),
                        "application/vnd.openx" +
                        "" +
                        "mlformats-officedocument.spreadsheetml.sheet",
                        NombreArcvhivo));
                }
            }
        }
    }
}
