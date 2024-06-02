import { appsettings } from "../Setting/appsetting";


export async function ObtenerFacturas(entidad:string) {
  const response = await fetch(appsettings.apiURL+entidad);
  if(response.ok){
    const datosapi = await response.json();
    return datosapi;
  }
}
    
  export async function ObtenerPorId(entidad:string,id:number) {
    const response = await fetch(`${appsettings.apiURL}${entidad}/${id}`);
    if(response.ok){
      const datosapi = await response.json();
      return datosapi;
    }
  }