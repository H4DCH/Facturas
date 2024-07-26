import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import * as apiPorveedor from "../../Data/useProveedor";
import { IFactura } from "../../Interface/IFactura";
import Nav from "../Nav";
import { Button } from "@chakra-ui/react";
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
   
   const clickExportar=(id:number)=>{
      apiPorveedor.GenerarExcel(id);
   }
  return (
    <>
    <Nav/>
    <Button bg="green.500" onClick={()=>{clickExportar(idNumber)}}>Exportar a excel</Button>
    <table>
      <thead>
        <tr>
        <th>Numero de Factura</th>
        <th>Valor Factura</th>
        <th>Fecha Factura</th>
        </tr>
      </thead>
      <tbody>
        {facturas?.map((factura)=>(
          <tr key={factura.id} >
            <td>{factura.numeroFactura}</td>
            <td>{factura.precio}</td>
            <td>{factura.fechaFactura}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  )
}

export default FacturasdeProveedor
