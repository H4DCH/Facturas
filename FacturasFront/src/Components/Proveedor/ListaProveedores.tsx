import { useEffect, useState } from "react"
import * as  apiFunciones from "../../Data/useProveedor"
import { IProveedor } from "../../Interface/IProveedor";
import { Box, Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import ItemProveedor from "./ItemProveedor";
const ListaProveedores = () => {

const[proveedores, setProveedores] = useState<IProveedor[]|null>(null);

    useEffect(()=>{
        apiFunciones.ListaProveedores()
        .then((resp)=>{
            setProveedores(resp.resultado)
        })
        .catch((e)=>{
            console.log(e)
        })
    },[])
  return (
    <>
      <Box w={500} mt={100} ml={420}>
      <TableContainer>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th textAlign={"center"}>Id</Th>
              <Th textAlign={"center"}>Nombre Proveedor</Th>
              <Th textAlign={"center"}>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            <ItemProveedor proveedores={proveedores}/>
            
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
    </>
  )
}

export default ListaProveedores
