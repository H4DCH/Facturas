import React  from "react"
import { IApiResponse } from "../Interface/IApiResponse"
import { IFactura } from "../Interface/IFactura"
import { Button, Td, Tr } from "@chakra-ui/react"

interface Itemsprop{

    response : IApiResponse<IFactura[]>
}


const ItemsLista :React.FC<Itemsprop> = ({response}) => {
  return (
    <>
      {response.resultado.map((facturas)=>{
          return<Tr key={facturas.id}>
          <Td textAlign={'center'} >{facturas.numeroFactura}</Td>
          <Td textAlign={'center'}>{facturas.precio}</Td>
          <Td textAlign={'center'} >{new Date(facturas.fechaFactura).toLocaleDateString()}</Td>
          <Td textAlign={'center'} >{facturas.proveedorId}</Td>
          <Td textAlign={'center'} >
            <Button  colorScheme='teal' size='sm'>Button</Button> 
            <Button m={2} colorScheme='teal' size='sm'>Button</Button>
          </Td>
          </Tr>   
        })}
        
    </>
  )
}

export default ItemsLista
