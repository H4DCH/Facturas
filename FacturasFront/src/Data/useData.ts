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
      return respuesta; // Devolver la respuesta si es necesario
    }
    throw new Error('Error al eliminar la factura');
  }

  export async function ActualizarFactura(id: number,factura:IFactura) {
    const response = await fetch(`${appsettings.apiURL}factura/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' 
      },
      body:JSON.stringify(factura)
    });
   
    if (response.ok) {
      const respuesta = await response.json();
      return respuesta;
    }
    throw new Error('Error al eliminar la factura');
  }