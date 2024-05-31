import { useEffect, useState } from "react";
import { appsettings } from "../Setting/appsetting";


export function useFecth(entidad:string) {

const [data,setData] = useState(null);

useEffect(()=>{
    fetch(appsettings.apiURL+entidad)
    .then((response) => response.json())
    .then((data) => setData(data));
},[])

}