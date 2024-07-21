import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import * as apiPorveedor from "../../Data/useProveedor";
import { IFactura } from "../../Interface/IFactura";
const FacturasdeProveedor = () => {

  let idNumber:number;
   const id = useParams().id;
   id ? idNumber = parseInt(id):console.log("error");

   const [facturas ,setFacturas] = useState<IFactura[]|null>(null);

   useEffect(()=>{
      apiPorveedor.ObtenerProveedorPorId(idNumber)
      .then((resp)=>{
        setFacturas(resp.resultado.facturas);
      }).catch((e)=>{
        console.error(e);
      })
   },[])
   
  return (
    <>
    <ul>
      {facturas?.map((factura)=>(
        <li>{factura.numeroFactura}</li>
      ))}
    </ul>
    </>
  )
}

export default FacturasdeProveedor
