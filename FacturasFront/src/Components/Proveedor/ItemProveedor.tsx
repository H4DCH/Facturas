import { Button } from "@chakra-ui/react";
import { FaRegEye, FaTrashCan } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IProveedor } from "../../Interface/IProveedor";
import Swal from "sweetalert2";
import * as apiFunciones from "../../Data/useProveedor";
import { Link } from "react-router-dom";

type PropsItmes = {
  proveedor: IProveedor | null;
  clickEditar: (prov: IProveedor | null) => void;
  actualizarRefrescar:(valorRefresh:boolean)=>void;
};

const ItemProveedor: React.FC<PropsItmes> = ({ proveedor, clickEditar,actualizarRefrescar }) => {
  const handleClick = () => {
    clickEditar(proveedor);

  };

  const cambioRefresh=()=>{
    actualizarRefrescar(true);
  }

  const handleEliminar = async (id: number) => {
    try {
      Swal.fire({
        title: "Esta seguro de eliminar esta factura?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await apiFunciones.EliminarProveedor(id).then((response) => {
            if (response.esExitoso){
              Swal.fire("Eliminado Correctamente", "", "success");
              cambioRefresh();
            } else {
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
      <tr>
        <td>{proveedor?.id}</td>
        <td>{proveedor?.nombreProveedor}</td>
        <td>
          <Button onClick={handleClick}>
            <HiOutlinePencilSquare /> Editar
          </Button>
          <Button
            ml={3}
            onClick={() => proveedor && handleEliminar(proveedor.id)}
          >
            <FaTrashCan />
            Eliminar
          </Button>
          <Button
            ml={3}
          >
            <FaRegEye />
            <Link to={`/proveedor/${proveedor?.id}`}>Ver Facturas</Link>
          </Button>
        </td>
      </tr>
    </>
  );
};

export default ItemProveedor;
