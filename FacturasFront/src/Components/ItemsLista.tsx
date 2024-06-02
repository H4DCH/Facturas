import React, { useState } from "react";
import { Button, Td, Tr } from "@chakra-ui/react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { FaTrashCan } from "react-icons/fa6";
import { IFactura } from "../Interface/IFactura";
import ModalFactura from "./ModalFactura";

const ItemsLista: React.FC<{ facturas: IFactura[] | null }> = ({
  facturas,
}) => {
  const [open, setOpen] = useState(false);
  const [facturamodal, setFacturaModal] = useState<IFactura | null>(null);

  const AbrirModal = (factura: IFactura) => {
    setFacturaModal(factura);
    setOpen(true);
  };

  const CerrarModal = () => {
    setFacturaModal(null);
    setOpen(false);
  };

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
            <Button m={3} onClick={() => AbrirModal(factura)}><HiOutlinePencilSquare /></Button>
            <Button><FaTrashCan /></Button>
          </Td>
        </Tr>
      ))}
      <ModalFactura
        isOpen={open}
        onClose={CerrarModal}
        factura={facturamodal}
      />
    </>
  );
};

export default ItemsLista;
