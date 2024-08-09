import { IFactura } from "../Interface/IFactura";
import { appsettings } from "../Setting/appsetting";


export async function ObtenerFacturas(pagina:number) {
  try {
    const response = await fetch(`${appsettings.apiURL}factura?pagina=${pagina}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("error al obtener las facturas");
    }
    const apiResponse = await response.json();

    return apiResponse;
  } catch (error) {
    throw new Error(`Error en la petición: ${error}`);
  }
}

export async function GenerarExcel() {
  try {
    const response = await fetch(`${appsettings.apiURL}factura/GenerarExcel`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

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
    alert(error);
  }
}

export async function ObtenerPorId(id: number) {
  try {
    const response = await fetch(`${appsettings.apiURL}factura/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al traer la factura");
    }
    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
    throw error;
  }
}

export async function EliminarFactura(id: number) {
  try {
    const response = await fetch(`${appsettings.apiURL}factura/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error al eliminar la factura");
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
    throw error;
  }
}

export async function ActualizarFactura(id: number, factura: IFactura) {
  try {
    const response = await fetch(`${appsettings.apiURL}factura/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    });

    if (!response.ok) {
      throw new Error(`Error en la petición`);
    }

    const apiResponse = await response.json();

    return apiResponse;
  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
    throw error;
  }
}

export async function CrearFactura(factura: IFactura) {
  try {
    const response = await fetch(`${appsettings.apiURL}factura`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    });
    if (!response.ok) {
      throw new Error(`Error en la petición`);
    }

    const apiResponse = await response.json();
    return apiResponse;

  } catch (error) {
    console.error("Hubo un problema con la petición:", error);
    throw error;
  }
}
