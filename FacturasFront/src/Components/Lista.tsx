import { useEffect, useState } from "react";
import * as ApiFunciones from "../Data/useData";
import ItemsLista from "./ItemsLista";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { IFactura } from "../Interface/IFactura";

const Lista = () => {
  const [factura, setFactura] = useState<IFactura[] | null>(null);

  useEffect(() => {
    ApiFunciones.ObtenerFacturas()
      .then((resp) => {
        setFactura(resp.resultado);
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  return (
    <>
      <Box w={1000} mt={100} ml={190}>
        <TableContainer>
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
                  <Td colSpan={5} textAlign={'center'} fontSize={25}>Sin datos</Td></Tr>
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
