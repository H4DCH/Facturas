import { useEffect, useState } from "react";
import * as apiFunciones from "../../Data/useProveedor";
import { IProveedor } from "../../Interface/IProveedor";
import { Button, useDisclosure } from "@chakra-ui/react";
import ItemProveedor from "./ItemProveedor";
import ModalProveedor from "./ModalProveedor";
import Nav from "../Nav";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState<IProveedor[] | null>(null);
  const [editProveedor, seteditProveedor] = useState<IProveedor | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refrescar , setRefrescar] = useState<boolean>(false);
  const [pagina,setPagina] = useState<number>(1);
  const navigate = useNavigate();

  const handleModal = (prov: IProveedor | null) => {
    seteditProveedor(prov);
    onOpen();
  };

  const paginaSiguiente =()=>{
    if (proveedores && proveedores.length !== 0) {
      setPagina(pagina + 1);
    }
  }

  const paginaAnterior =()=>{
    pagina> 0 && setPagina(pagina-1);
  }


  const actualizarRefrescar=(refresh:boolean)=>{
    setRefrescar(refresh)
  }

  useEffect(() => {
    const ObtenerProveedores = async () => {
      try {
        const resp = await apiFunciones.ListaProveedores(pagina);
        setProveedores(resp.resultado);
      } catch (error) {
        navigate('/login')
        Swal.fire({
          title: "Inicia Sesión Nuevamente",
          icon: "warning",
        });
      }
    };
    ObtenerProveedores();
    actualizarRefrescar(false);
  }, [refrescar,pagina]);
  return (
    <>
      <Nav />
      <div className="Container-Tabla">
        <Button onClick={() => handleModal(null)}>Nuevo Proveedor</Button>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nombre Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores?.map((prov) => (
              <ItemProveedor
                actualizarRefrescar={actualizarRefrescar}
                key={prov.id}
                proveedor={prov}
                clickEditar={handleModal}
              />
            ))}
          </tbody>
        </table>
        {pagina > 1 ? (
          <Button onClick={paginaAnterior}>Pagina Anterior</Button>
        ) : (
          <Button disabled>Pagina Anterior</Button>
        )}
          <Button onClick={paginaSiguiente}>Pagina Siguiente</Button>
        <ModalProveedor
          actualizarRefrescar={actualizarRefrescar}
          proveedor={editProveedor}
          onOpen={onOpen}
          onClose={onClose}
          isOpen={isOpen}
        />
      </div>
    </>
  );
};

export default ListaProveedores;
