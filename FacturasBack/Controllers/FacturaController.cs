using AutoMapper;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace FacturasBack.Controllers
{
    [Route("api/factura")]
    [ApiController]
    public class FacturaController : ControllerBase
    {
        private readonly IFacturaRepository _facturaRepository;
        private readonly IMapper _mapper;
        public FacturaController(IFacturaRepository _facturaRepository, IMapper mapper)
        {
            this._facturaRepository = _facturaRepository;
            _mapper = mapper;
        }

        [HttpGet(Name = "ListaFacturas")]
        public async Task<ActionResult<List<FacturaDTO>>> ListaFacturas()
        {
            List<Factura> listaFacturas = await _facturaRepository.ObtenerTodos();

            List<FacturaDTO> facturasDTO = _mapper.Map<List<FacturaDTO>>(listaFacturas);

            return Ok(facturasDTO);
        }

        [HttpGet("{id:int}",Name = "FacturaxId")]
        public async Task<ActionResult<FacturaDTO>> FacturaxId(int id)
        {
            var factura = await _facturaRepository.ObtenerxId(id);

            if(factura== null)
            {
                return NotFound();
            }

            var facturaDTO = _mapper.Map<FacturaDTO>(factura);

            return Ok(facturaDTO);
        }

        [HttpPost]
        public async Task<ActionResult<FacturaCreacionDTO>> FacturaNueva([FromBody] FacturaCreacionDTO modeloDTO)
        {
            var verificacion = await _facturaRepository.Verfificacion(f => f.NumeroFactura == modeloDTO.NumeroFactura);

            if (verificacion == null)
            {
                var modelonew = _mapper.Map<Factura>(modeloDTO);

               await _facturaRepository.Crear(modelonew);

                return CreatedAtRoute("FacturaxId", new { id = modelonew.Id},_mapper.Map<FacturaDTO>(modelonew));
            }
            else 

            return BadRequest("La factura ya existe");
           
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> EliminarFactura(int id)
        {
            var verificacion = await _facturaRepository.Verfificacion(f => f.Id == id);

            if (verificacion==null)
            {
                return NotFound();
            }

            await _facturaRepository.Eliminar(verificacion.Id);
            return NoContent();
            
        }
        [HttpPut("id:int")]
        public async Task<ActionResult> EditarFactura(int id,FacturaActualizacionDTO facturaDTO)
        {
            if(facturaDTO.Id == id)
            {
                if (facturaDTO == null)
                {
                    return BadRequest();
                }
                var existefactura = await _facturaRepository.Verfificacion(f => f.Id == id);

                if (existefactura == null)
                {
                    return NotFound();
                }
                var facturaActu = _mapper.Map<Factura>(facturaDTO);

                await _facturaRepository.Actualizar(facturaActu);

                return CreatedAtRoute("FacturaxId",new { id = facturaDTO.Id },facturaDTO);
            }

             return BadRequest($"El Id: {id} de la factura {facturaDTO.NumeroFactura} no encontrado");   
        }

    }

  }
