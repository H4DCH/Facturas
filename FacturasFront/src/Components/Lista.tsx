import { useEffect, useState } from 'react';
import { IFactura } from '../Interface/IFactura';
import { appsettings } from '../Setting/appsetting';
import { IApiResponse } from '../Interface/IApiResponse';
import {Table,Thead,Tr,Th,TableCaption,TableContainer, Box, Tbody} from '@chakra-ui/react'
import ItemsLista from './ItemsLista';

const Lista = () => {

  const [factura,setFacturas] = useState<IApiResponse<IFactura[]>>();

  const obtenerFacturas = async()=>{
    try {
  const resultado = await fetch(`${appsettings.apiURL}factura`)
      if(resultado.ok){
        const data = await resultado.json();
        setFacturas(data);
        console.log(data)        
      }
    } catch (error) {
        console.log("Error al traer los datos:" ,error)
    }}

    useEffect(()=>{
      obtenerFacturas()
    },[])
    
    if (!factura) {
      return <div>Cargando...</div>;
  }
  
  return (
    <div>
      <Box  w={1000} mt={100} ml={190} >
      <TableContainer>
  <Table variant='striped' colorScheme='teal'>
    <TableCaption>Imperial to metric conversion factors</TableCaption>
    <Thead>
      <Tr >
        <Th textAlign={'center'}>Numero de Factura</Th>
        <Th textAlign={'center'}>Valor Factura</Th>
        <Th textAlign={'center'}>Fecha Factura</Th>
        <Th textAlign={'center'}>Proveedor</Th>
        <Th textAlign={'center'}>Acciones</Th>
      </Tr>
    </Thead>
    <Tbody>
        <ItemsLista response  = {factura} />
        </Tbody>
  </Table>
</TableContainer>
</Box>
    </div>
);
}

export default Lista
