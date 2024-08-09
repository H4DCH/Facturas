namespace FacturasBack.Utilidades
{
    public  class Mayusculas
    {
        public string ConvertirAMayusculas(string palabra)
        {
            if (string.IsNullOrEmpty(palabra))
            {
                return palabra;
            }
            return palabra.ToUpper();
        }
    }
}
