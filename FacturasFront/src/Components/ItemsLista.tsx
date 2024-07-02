import React from "react";
import { Button, Td, Tr } from "@chakra-ui/react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaTrashCan } from "react-icons/fa6";
import { IFactura } from "../Interface/IFactura";
import * as ApiFunciones from "../Data/useData";
import Swal from "sweetalert2";

type propsModal ={
  factura:IFactura | null;
  clickEditar:(factura:IFactura|null)=>void;
}

const ItemsLista: React.FC<propsModal> = ({factura,clickEditar}) => {


  const handleEditar = () => {
    clickEditar(factura);
  };

  const handleEliminar = async (id: number) => {
    try {
      Swal.fire({
        title: "Esta seguro de eliminar esta factura?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Eliminar"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Eliminado Correctamente", "", "success");
           ApiFunciones.EliminarFactura(id);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Tr>
        <Td textAlign={"center"}>{factura?.numeroFactura}</Td>
        <Td textAlign={"center"}>${factura?.precio}</Td>
        <Td textAlign={"center"}>
          {factura && factura.fechaFactura && (
            <>{new Date(factura.fechaFactura).toLocaleDateString()}</>
          )}
        </Td>
        <Td textAlign={"center"}>{factura?.proveedorId}</Td>
        <Td textAlign={"center"}>
          <Button m={3} onClick={()=>handleEditar()}>
            <HiOutlinePencilSquare /> Editar
          </Button>
          <Button onClick={() =>factura && handleEliminar(factura.id)}>
            <FaTrashCan />
            Eliminar
          </Button>
        </Td>
      </Tr>
    </>
  );
};

export default ItemsLista;
