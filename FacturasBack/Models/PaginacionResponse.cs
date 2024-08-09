using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;

namespace FacturasBack.Models
{
    public class PaginacionResponse<T> where T : class
    {
        public int totalResultado { get; set; }
        public int numeroPagina { get; set; }
        public int tamañoPagina { get; set; }
        public List<T> resultados { get; set; }

        public PaginacionResponse(List<T> resultados,int totalResultado, int numeroPagina, int tamañoPagina)
        {
            this.resultados = resultados;
            this.totalResultado = totalResultado;
            this.numeroPagina = numeroPagina;
            this.tamañoPagina = tamañoPagina;
        }
    }
}
