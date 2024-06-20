import React, {useState } from "react";
import { Button, Td, Tr, useDisclosure } from "@chakra-ui/react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaTrashCan } from "react-icons/fa6";
import { IFactura } from "../Interface/IFactura";
import ModalFactura from "./ModalFactura";
import * as ApiFunciones from "../Data/useData"

const ItemsLista: React.FC<{ facturas: IFactura[] | null }> = ({
  facturas,
}) => {
  const [datosFactura, setDatosFactura] = useState<IFactura | null>(null);

  const handleEditar = (factura: IFactura) => {
    setDatosFactura(factura);
    onOpen();
  };

  const handleEliminar = async(id:number)=>{
    try {
      await ApiFunciones.EliminarFactura(id);
      
    } catch (error) {
      console.error(error)
    }
  }
  const {onOpen,isOpen,onClose} = useDisclosure();

  return (
    <>
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
              <HiOutlinePencilSquare />
            </Button>
            <Button onClick={()=>handleEliminar(factura.id)}>
              <FaTrashCan />
            </Button>
          </Td>
        </Tr>
      ))}
      {datosFactura && <ModalFactura factura={datosFactura} onOpen={onOpen} isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default ItemsLista;
