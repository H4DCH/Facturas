import { IFactura } from "../Interface/IFactura";
import { appsettings } from "../Setting/appsetting";


export async function ObtenerFacturas() {
  const response = await fetch(`${appsettings.apiURL}factura`);
  if(response.ok){
    const datosapi = await response.json();
    return datosapi;
  }
}
    
  export async function ObtenerPorId(id:number) {
    const response = await fetch(`${appsettings.apiURL}factura/${id}`);
    if(response.ok){
      const datosapi = await response.json();
      return datosapi;
    }
  }
  
  export async function EliminarFactura(id: number) {
    const response = await fetch(`${appsettings.apiURL}factura/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
      const respuesta = await response.json();
      console.log(respuesta);
      return respuesta;
    }
    throw new Error('Error al eliminar la factura');
  }

  export async function ActualizarFactura(id: number,factura:IFactura) {
    fetch(`${appsettings.apiURL}factura/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(factura)
    })
      .then(response => {
        if (!response.ok) {
        throw new Error('Error en la petición: ' + response.statusText);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Hubo un problema con la petición:', error);
      })};

      
  export async function CrearFactura(factura:IFactura) {
    fetch(`${appsettings.apiURL}factura`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(factura)
    })
      .then(response => {
        if (!response.ok) {
        throw new Error('Error en la petición: ' + response.statusText);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Hubo un problema con la petición:', error);
      })};