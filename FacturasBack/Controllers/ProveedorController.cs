using AutoMapper;
using AutoMapper.Configuration.Annotations;
using AutoMapper.Configuration.Conventions;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace FacturasBack.Controllers
{
    [Route("api/proveedor")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IProveedorRepository _proveedorRepository;
        public ProveedorController(IProveedorRepository proveedorRepository, IMapper mapper)
        {
            _proveedorRepository = proveedorRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProveedorDTO>>> ListaProveedor()
        {
            List<Proveedor> proveedores = await _proveedorRepository.ObtenerTodos();

            if (proveedores == null)
            {
                return NotFound();
            }
            List<ProveedorDTO> proveedoresDTO = _mapper.Map<List<ProveedorDTO>>(proveedores);

            return Ok(proveedoresDTO);
        }

        [HttpGet("{id:int}", Name = "ProveedorxId")]
        public async Task<ActionResult<ProveedorDTO>> ProveedorxId(int id)
        {
            var proveedor = await _proveedorRepository.ListaFacturasProveedor(id);
            if (proveedor == null)
            {
                return NotFound("Proveedor no encontrao");
            }

            var proveedorDTO = _mapper.Map<ProveedorDTO>(proveedor);

            return Ok(proveedorDTO);

        }

        [HttpPost]
        public async Task<ActionResult> ProveedorNuevo(ProveedorCreacionDTO modeloCreacionDTO)
        {
            var verificacion = await _proveedorRepository.Verfificacion(p => p.NombreProveedor == modeloCreacionDTO.NombreProveedor );

            if (verificacion == null)
            {
                var modeloNuevo = _mapper.Map<Proveedor>(modeloCreacionDTO);

                await _proveedorRepository.Crear(modeloNuevo);

                var modeloDTO = _mapper.Map<ProveedorDTO>(modeloNuevo);

                return CreatedAtRoute("ProveedorxId", new {id = modeloNuevo.Id }, modeloDTO);
            }

            return BadRequest($"El proveedor con nombre {modeloCreacionDTO.NombreProveedor} ya existe");
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> EliminarProveedor(int id)
        {
            var verificacion = _proveedorRepository.ObtenerxId(id);

            if (verificacion !=null)
            {
                await _proveedorRepository.Eliminar(id);
                return NoContent();
            }
            return NotFound($"El proveedor con id {id} no existe");

        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> ActualizarProveedor(int id, ProveedorActualizacionDTO proveedorDTO)
        {
            if (proveedorDTO != null || proveedorDTO?.Id != id ) 
            {
                var nombreExiste = await _proveedorRepository.Verfificacion(p => p.NombreProveedor == proveedorDTO.NombreProveedor);

                if (nombreExiste !=null)
                {
                    return BadRequest($"El nombre de proveedor {proveedorDTO.NombreProveedor} ya se encuntra registrado");
                }
                 
                var modelo = _mapper.Map<Proveedor>(proveedorDTO);

                await _proveedorRepository.Actualizar(modelo);

                return NoContent();
            }

                return NotFound($"No se encontro el proveedor con id:{id}");
            }       
        }
        

    
}
