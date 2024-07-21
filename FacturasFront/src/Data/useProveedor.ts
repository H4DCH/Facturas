import { IProveedor } from "../Interface/IProveedor";
import { appsettings } from "../Setting/appsetting"

export async function ListaProveedores(){
    try {
        const response = await fetch(`${appsettings.apiURL}proveedor`)
      if(response.ok){
        const apiResponse = await response.json();
        return apiResponse
    }
    } catch (error) {
     console.error(error)   
    }
}

export async function ObtenerProveedorPorId(id:number){
        try {
            const response = await fetch(`${appsettings.apiURL}proveedor/${id}`)
        if(response.ok){
            const apiResponse = await response.json();
            return apiResponse
        }
        } catch (error) {
         console.error(error)   
        }
    }

    
  export async function ActualizarProveedor(id: number,proveedor:IProveedor) {
    try {
     
    const response = await fetch(`${appsettings.apiURL}proveedor/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proveedor)
    })
      if(!response.ok){
        throw new Error('Error en la petición: ' + response.statusText);
      }
      const apiResponse = await response.json();
      console.log(apiResponse);
      return  apiResponse;
 
    } catch (error) {
      console.error;      
    }
  };

   
  export async function CrearProveedor(proveedor:IProveedor) {
    try {
     
    const response = await fetch(`${appsettings.apiURL}proveedor/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proveedor)
    })
      if(!response.ok){
        throw new Error('Error en la petición: ' + response.statusText);
      }
      const apiResponse = await response.json();
      return  apiResponse;
 
    } catch (error) {
      console.error;      
    }
  };

  export async function EliminarProveedor(id:number) {
    try {
     
    const response = await fetch(`${appsettings.apiURL}proveedor/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      if(!response.ok){
        throw new Error('Error en la petición: ' + response.statusText);
      }
      const apiResponse = await response.json();
      return  apiResponse;
 
    } catch (error) {
      console.error;      
    }
  };