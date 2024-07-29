using AutoMapper;
using FacturasBack.Models;
using FacturasBack.Models.DTO;

namespace FacturasBack.AutoMapper
{
    public class ProfileMapper : Profile
    {
        public ProfileMapper()
        {
            #region Factura
            CreateMap<Factura, FacturaDTO>().ReverseMap();
            CreateMap<Factura, FacturaCreacionDTO>().ReverseMap();
            CreateMap<Factura, FacturaActualizacionDTO>().ReverseMap();
            CreateMap<Factura, FacturaExportarDTO>().ReverseMap();
            CreateMap<FacturaDTO, FacturaExportarDTO>().ReverseMap();

            #endregion

            #region Proveedor
            CreateMap<Proveedor, ProveedorDTO>().ReverseMap();
            CreateMap<Proveedor, ProveedorActualizacionDTO>().ReverseMap();
            CreateMap<Proveedor, ProveedorCreacionDTO>().ReverseMap();
            CreateMap<Proveedor, ProveedorExportarDTO>().ReverseMap();
            #endregion

            #region Usuario
            CreateMap<Usuario, UsuarioDTO>().ReverseMap();
            CreateMap<Usuario, LoginDTO>().ReverseMap();
            #endregion


        }
    }
}
