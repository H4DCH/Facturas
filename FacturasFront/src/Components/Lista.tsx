import { useEffect, useState } from "react";
import * as ApiFunciones from "../Data/useData";
import ItemsLista from "./ItemsLista";
import {
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { IFactura } from "../Interface/IFactura";
import ModalFactura from "./ModalFactura";
const Lista = () => {
  const [factura, setFactura] = useState<IFactura[] | null>(null);
  const {onOpen,isOpen,onClose} = useDisclosure();

  const AbrirModal =()=>{
    onOpen();
  }

  useEffect(() => {
    ApiFunciones.ObtenerFacturas()
      .then((resp) => {
        setFactura(resp.resultado);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [factura]);

  return (
    <>
      <Box w={1000} mt={100} ml={220} display={"flex"} >
        <TableContainer>
        <>
        <Button onClick={AbrirModal}>Nueva Factura</Button>
        <ModalFactura factura={null} isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
        </>
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th textAlign={"center"}>Numero de Factura</Th>
                <Th textAlign={"center"}>Valor Factura</Th>
                <Th textAlign={"center"}>Fecha Factura</Th>
                <Th textAlign={"center"}>Proveedor</Th>
                <Th textAlign={"center"}>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {!factura ? (
                <Tr>
                  <Td colSpan={5} textAlign={"center"} fontSize={25}>
                    Sin datos
                  </Td>
                </Tr>
              ) : (
                <ItemsLista facturas={factura} />
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default Lista;
