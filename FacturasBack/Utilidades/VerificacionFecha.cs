namespace FacturasBack.Utilidades
{
    public class VerificacionFecha
    {
        public bool fechaValida(DateTime fecha)
        {
            DateTime fechaActual = DateTime.Now;
            
            bool valido = true;

            int resultado = DateTime.Compare(fecha, fechaActual);

            if (resultado < 0 || resultado == 0)
            {
                return valido;
            }
            else { return valido = false; }
        }

    }
}
