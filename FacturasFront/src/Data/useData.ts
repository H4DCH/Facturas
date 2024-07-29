import { IFactura } from "../Interface/IFactura";
import { appsettings } from "../Setting/appsetting";


export async function ObtenerFacturas() {
try {
  const token = sessionStorage.getItem('token');
  if(!token){
    throw new Error('No se encontro Token valido');
  }
  const response = await fetch(`${appsettings.apiURL}factura`,{
    method : 'GET',
    headers : {
      'Authorization':`Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type' : 'application/json'
    }
  });
  if(response.ok){
    const datosapi = await response.json();
    return datosapi;
  }else {
    const datosapi = await response.json();
    throw new Error(`Error : ${datosapi.errorMessages}`);
  }
} catch (error) {
  console.log(error)
}  
}



export async function GenerarExcel(){

  try {

    const response = await fetch(`${appsettings.apiURL}factura/Exportar`)
    if(response.ok){
      const apiResponse = await response.blob();

      let fileName = 'Facturas.xlsx';

      const url = URL.createObjectURL(apiResponse);

      const a = document.createElement('a');
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