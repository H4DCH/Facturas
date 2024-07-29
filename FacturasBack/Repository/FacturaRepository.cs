using AutoMapper;
using ClosedXML.Excel;
using FacturasBack.Data;
using FacturasBack.Models;
using FacturasBack.Models.DTO;
using FacturasBack.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Reflection;

namespace FacturasBack.Repository
{
    public class FacturaRepository : Repositorio<Factura>, IFacturaRepository
    {
        private readonly IMapper _mapper;
        private readonly Context context;
        public FacturaRepository(Context context,IMapper mapper) : base(context)
        {
            this.context = context;
            _mapper = mapper;
        }

        public async Task Actualizar(Factura modelo)
        {
            context.Facturas.Update(modelo);
            await Guardar();
        }

        public Task<byte[]> GenerarExcel(string nombreArchivo, List<FacturaExportarDTO> datos)
        {
            DataTable dataTable = new DataTable(nombreArchivo);

            Type type = typeof(FacturaExportarDTO);

            PropertyInfo[] properties = type.GetProperties();
            foreach (var prop in properties)
            {
                if (prop.PropertyType.IsClass && prop.PropertyType != typeof(string))
                {
                    PropertyInfo[] relatedProperties = prop.PropertyType.GetProperties();
                    foreach (var relatedProp in relatedProperties)
                    {
                        dataTable.Columns.Add($"{prop.Name}_{relatedProp.Name}", Nullable.GetUnderlyingType(relatedProp.PropertyType) ?? relatedProp.PropertyType);
                    }
                }
                else
                {
                    dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
                }
            }

            foreach (var item in datos)
            {
                DataRow row = dataTable.NewRow();
                foreach (var prop in properties)
                {
                    if (prop.PropertyType.IsClass && prop.PropertyType != typeof(string))
                    {
                        var relatedObject = prop.GetValue(item, null);
                        if (relatedObject != null)
                        {
                            PropertyInfo[] relatedProperties = prop.PropertyType.GetProperties();
                            foreach (var relatedProp in relatedProperties)
                            {
                                row[$"{prop.Name}_{relatedProp.Name}"] = relatedProp.GetValue(relatedObject, null);
                            }
                        }
                    }
                    else
                    {
                        row[prop.Name] = prop.GetValue(item, null);
                    }
                }
                dataTable.Rows.Add(row);
            }
            using (XLWorkbook wb = new XLWorkbook())
            {
                wb.Worksheets.Add(dataTable);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    return Task.FromResult(stream.ToArray());
                }
            }
        }

        public async Task<List<FacturaDTO>> ListaFacturasProveedor()
        {
           var Lista = await context.Facturas.Include(p => p.Proveedor).ToListAsync();

            var listaMap = _mapper.Map<List<FacturaDTO>>(Lista);  

            return listaMap;
        }

        public async Task<List<FacturaExportarDTO>> ListaFacturasxId(int id)
        {
            var lista = await context.Facturas.Include(p => p.Proveedor).Where(p => p.ProveedorId == id).ToListAsync();
            var listaDTO = _mapper.Map<List<FacturaExportarDTO>>(lista);

            return listaDTO;
        }
    }
}
