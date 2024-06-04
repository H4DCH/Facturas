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