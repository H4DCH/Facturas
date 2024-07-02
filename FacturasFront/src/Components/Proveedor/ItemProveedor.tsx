import { Button, Td, Tr } from "@chakra-ui/react";
import { FaTrashCan } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IProveedor } from "../../Interface/IProveedor";
import Swal from "sweetalert2";
import * as  apiFunciones from "../../Data/useProveedor"

type PropsItmes = {
  proveedor : IProveedor | null;
  clickEditar:(prov:IProveedor|null)=>void;
}


const ItemProveedor: React.FC<PropsItmes> = ({proveedor,clickEditar}) => {

  const handleClick = ()=>{
    clickEditar(proveedor);
  }

  const handleEliminar = async (id: number) => {
    try {
      Swal.fire({
        title: "Esta seguro de eliminar esta factura?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
      }).then((result) => {
        if (result.isConfirmed) {
          apiFunciones.EliminarProveedor(id).then((response) => {
            if (response.esExitoso)
              Swal.fire("Eliminado Correctamente", "", "success");
            else {
              Swal.fire({
                title: response.errorMessages,
                icon: "error",
              });
            }
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
        <Tr>
          <Td textAlign={"center"}>{proveedor?.id}</Td>
          <Td textAlign={"center"}>{proveedor?.nombreProveedor}</Td>
          <Td textAlign={"center"}>
            <Button onClick={handleClick}>
              <HiOutlinePencilSquare /> Editar
            </Button>
            <Button ml={3} onClick={()=>proveedor && handleEliminar(proveedor.id)}>
              <FaTrashCan />
              Eliminar
            </Button>
          </Td>
        </Tr>
    </>
  );
};

export default ItemProveedor;
