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
            console.log(apiResponse)
            return apiResponse
        }
        } catch (error) {
         console.error(error)   
        }
    }
