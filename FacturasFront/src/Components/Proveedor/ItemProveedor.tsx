import { Td, Tr } from "@chakra-ui/react"
import { IProveedor } from "../../Interface/IProveedor"

const ItemProveedor: React.FC<{proveedores:IProveedor[]|null }> = ({proveedores}) => {
  return (
    <>
      {proveedores?.map((prov)=>(
        <Tr key={prov.id}>
            <Td>{prov.id}</Td>
            <Td>{prov.nombreProveedor}</Td>
        </Tr>
      ))}
    </>
  )
}

export default ItemProveedor
