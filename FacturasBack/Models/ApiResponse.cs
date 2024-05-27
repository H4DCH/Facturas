using System.Net;

namespace FacturasBack.Models
{
    public class ApiResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public bool EsExitoso { get; set; } = true;
        public List<string> ErrorMessages { get; set;}
        public Object Resultado { get; set; }
    }
}
