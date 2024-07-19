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
import Nav from "./Nav";
const Lista = () => {
  const [factura, setFactura] = useState<IFactura[] | null>(null);
  const [editFactura,seteditFactura] = useState<IFactura | null>(null);
  const {onOpen,isOpen,onClose} = useDisclosure();

  const handleModal =(fact:IFactura|null)=>{
      seteditFactura(fact)
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
    <Nav/>
      <Box w={1000} mt={100} ml={220} display={"flex"} >
        <TableContainer>
        <>
        <Button onClick={()=>handleModal(null)} >Nueva Factura</Button>
        </>
          <Table variant="striped" colorScheme="teal" size="sm" >
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
                factura.map((fact)=>(
                  <ItemsLista key={fact.id} factura={fact} clickEditar={handleModal} />
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <ModalFactura factura={editFactura} onClose={onClose} onOpen={onOpen} isOpen={isOpen} />
    </>
  );
};

export default Lista;
