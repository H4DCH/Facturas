import { ILogin } from "../Interface/ILogin";
import { appsettings } from "../Setting/appsetting";

export async function Login(usuario:ILogin) {
    try {
        const response = await fetch(`${appsettings.apiURL}usuario/Login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(usuario)       
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