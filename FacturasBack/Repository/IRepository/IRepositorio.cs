using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Linq.Expressions;

namespace FacturasBack.Repository.IRepository
{
    public interface IRepositorio<T> where T : class
    {
        Task<List<T>> ObtenerTodos();
        Task<T> ObtenerxId(int id);
        Task<T> Crear(T modelo);
        Task Eliminar(int id);
        Task<T> Verfificacion(Expression<Func< T, bool>> expr);
    }
}
