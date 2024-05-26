﻿using FacturasBack.Models;

namespace FacturasBack.Repository.IRepository
{
    public interface IProveedorRepository : IRepositorio<Proveedor>
    {
        Task Actualizar(Proveedor modelo);
        Task <Proveedor> ListaFacturasProveedor(int id);
    }
}
