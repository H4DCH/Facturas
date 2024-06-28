import React, { useState } from "react";
import { Button, Td, Tr, useDisclosure } from "@chakra-ui/react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaTrashCan } from "react-icons/fa6";
import { IFactura } from "../Interface/IFactura";
import ModalFactura from "./ModalFactura";
import * as ApiFunciones from "../Data/useData";
import Swal from "sweetalert2";

const ItemsLista: React.FC<{ facturas: IFactura[] | null }> = ({facturas}) => {

  const [datosFactura, setDatosFactura] = useState<IFactura | null>(null);

  const handleEditar = (factura: IFactura) => {
    setDatosFactura(factura);
    onOpen();
  };

  const handleEliminar = async (id: number) => {
    try {
      Swal.fire({
        title: "Esta seguro de eliminar esta factura?",
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
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <>
    
    {facturas && (
        <ModalFactura
          factura={datosFactura}
          onOpen={onOpen}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
      {facturas?.map((factura) => (
        <Tr key={factura.id}>
          <Td textAlign={"center"}>{factura.numeroFactura}</Td>
          <Td textAlign={"center"}>{factura.precio}</Td>
          <Td textAlign={"center"}>
            {new Date(factura.fechaFactura).toLocaleDateString()}
          </Td>
          <Td textAlign={"center"}>{factura.proveedorId}</Td>
          <Td textAlign={"center"}>
            <Button m={3} onClick={() => handleEditar(factura)}>
              <HiOutlinePencilSquare /> Editar
            </Button>    
            <Button onClick={() => handleEliminar(factura.id)}>
               <FaTrashCan />Eliminar
            </Button>
          </Td>
        </Tr>
      ))}
    </>
  );
};

export default ItemsLista;
