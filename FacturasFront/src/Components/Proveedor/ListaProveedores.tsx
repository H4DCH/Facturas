import { useEffect, useState } from "react";
import * as apiFunciones from "../../Data/useProveedor";
import { IProveedor } from "../../Interface/IProveedor";
import { Button, useDisclosure } from "@chakra-ui/react";
import ItemProveedor from "./ItemProveedor";
import ModalProveedor from "./ModalProveedor";
import Nav from "../Nav";
const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState<IProveedor[] | null>(null);
  const [editProveedor, seteditProveedor] = useState<IProveedor | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleModal = (prov: IProveedor | null) => {
    seteditProveedor(prov);
    onOpen();
  };

  useEffect(() => {
    const ObtenerProveedores = async () => {
      try {
        const resp = await apiFunciones.ListaProveedores();
        setProveedores(resp.resultado);
      } catch (error) {
        console.error(error);
      }
    };
    ObtenerProveedores();
  }, [isOpen]);
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
                key={prov.id}
                proveedor={prov}
                clickEditar={handleModal}
              />
            ))}
          </tbody>
        </table>
        <ModalProveedor
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
