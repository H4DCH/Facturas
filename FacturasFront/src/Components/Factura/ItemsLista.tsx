import React from "react";
import { Button } from "@chakra-ui/react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaTrashCan } from "react-icons/fa6";
import { IFactura } from "../../Interface/IFactura";
import * as ApiFunciones from "../../Data/useFactura";
import Swal from "sweetalert2";
import "../../Style/EstiloTabla.css";

type propsModal = {
  factura: IFactura | null;
  clickEditar: (factura: IFactura | null) => void;
  actualizarRefrescar:(valorRefresh:boolean)=>void;
};

const ItemsLista: React.FC<propsModal> = ({ factura, clickEditar,actualizarRefrescar }) => {
  const handleEditar = () => {
    clickEditar(factura);
  };

  const actualizarEstados=()=>{
    actualizarRefrescar(true);
  }

  const handleEliminar = async (id: number) => {
    try {
      Swal.fire({
        title: "Esta seguro de eliminar esta factura?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const Response = await ApiFunciones.EliminarFactura(id);
          if(Response && Response.esExitoso){
            Swal.fire("Eliminado Correctamente", "", "success"); actualizarEstados() ;
          }  
          else{
            console.log(Response);
            Swal.fire("Ha ocurrido un error", "", "error");
          }
          
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <tr>
        <td>{factura?.numeroFactura}</td>
        <td>${factura?.precio}</td>
        <td>
          {factura && factura.fechaFactura && (
            <>{new Date(factura.fechaFactura).toLocaleDateString()}</>
          )}
        </td>
        <td>{factura?.proveedor.nombreProveedor}</td>
        <td>
          <Button m={3} onClick={() => handleEditar()}>
            <HiOutlinePencilSquare /> Editar
          </Button>
          <Button onClick={() => factura && handleEliminar(factura.id)}>
            <FaTrashCan />
            Eliminar
          </Button>
        </td>
      </tr>
    </>
  );
};

export default ItemsLista;
