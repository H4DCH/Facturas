import { useEffect, useState } from "react"
import * as  apiFunciones from "../../Data/useProveedor"
import { IProveedor } from "../../Interface/IProveedor";
import { Box, Button, Table, TableContainer, Tbody, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import ItemProveedor from "./ItemProveedor";
import ModalProveedor from "./ModalProveedor";
const ListaProveedores = () => {

const[proveedores, setProveedores] = useState<IProveedor[]|null>(null);
const[editProveedor, seteditProveedor] = useState<IProveedor|null>(null);
const { isOpen, onOpen, onClose } = useDisclosure()

const handleModal =(prov:IProveedor|null)=>{
  seteditProveedor(prov)
  onOpen();
}

    useEffect(()=>{
        apiFunciones.ListaProveedores()
        .then((resp)=>{
            setProveedores(resp.resultado)
        })
        .catch((e)=>{
            console.log(e)
        })
    },[proveedores])
  return (
    <>
      <Box w={550} mt={100} ml={350}>
      <TableContainer>
      <Button onClick={()=>handleModal(null)}>Nuevo Proveedor</Button>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th textAlign={"center"}>Id</Th>
              <Th textAlign={"center"}>Nombre Proveedor</Th>
              <Th textAlign={"center"}>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {proveedores?.map( prov =>(
              <ItemProveedor key={prov.id} proveedor={prov} clickEditar={handleModal}/> 
            ) )}
          </Tbody>
        </Table>
      </TableContainer>
    <ModalProveedor proveedor={editProveedor} onOpen={onOpen} onClose={onClose} isOpen={isOpen}/>
    </Box>
    </>
  )
}

export default ListaProveedores
