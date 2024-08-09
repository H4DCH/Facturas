import { IProveedor } from "../Interface/IProveedor";
import { appsettings } from "../Setting/appsetting";


export async function ListaProveedores(pagina:number=1) {
  try {
    const response = await fetch(`${appsettings.apiURL}proveedor?pagina=${pagina}`, {
      method: "GET",
      headers: {
        'Authorization' : `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("error al obtener los proveedores");
      
    }
    const apiResponse = await response.json();

    return apiResponse;
  } catch (error) {
    throw new Error(`Error en la petición: ${error}`);

  }
}


export async function ObtenerProveedorPorId(id: number) {
  try {
    const response = await fetch(`${appsettings.apiURL}proveedor/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al obtener el proveedor");
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    throw new Error(`Error en la peticion: ${error}`);
  }
}

export async function GenerarExcel(id: number) {
  try {
    const response = await fetch(
      `${appsettings.apiURL}proveedor/GenerarExcel?idProveedor=${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const apiResponse = await response.blob();

      let fileName = "Facturas.xlsx";

      const url = URL.createObjectURL(apiResponse);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);
    }
  } catch (error) {
    throw new Error(`Error en la peticion: ${error}`);
  }
}

export async function ActualizarProveedor(id: number, proveedor: IProveedor) {
  try {
    const response = await fetch(`${appsettings.apiURL}proveedor/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proveedor),
    });
    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    throw new Error(`Error en la peticion: ${error}`);
  }
}

export async function CrearProveedor(proveedor: IProveedor) {
  try {
    const response = await fetch(`${appsettings.apiURL}proveedor/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proveedor),
    });

    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }
    const apiResponse = await response.json();
    return apiResponse;
    
  } catch (error) {
    throw new Error(`Error en la peticion: ${error}`);
  }
}

export async function EliminarProveedor(id: number) {
  try {
    const response = await fetch(`${appsettings.apiURL}proveedor/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error en la petición: " + response.statusText);
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    throw new Error(`Error en la peticion: ${error}`);
  }
}
