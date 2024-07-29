import { useEffect, useState } from "react";
import * as ApiFunciones from "../../Data/useData";
import ItemsLista from "./ItemsLista";
import "../../Style/EstiloTabla.css";
import { Button, useDisclosure } from "@chakra-ui/react";
import { IFactura } from "../../Interface/IFactura";
import ModalFactura from "./ModalFactura";
import Nav from "../Nav";
const Lista = () => {
  const [factura, setFactura] = useState<IFactura[] | null>(null);
  const [editFactura, seteditFactura] = useState<IFactura | null>(null);
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleModal = (fact: IFactura | null) => {
    seteditFactura(fact);
    onOpen();
  };

  const handleGenerarExcel = ()=>{
    ApiFunciones.GenerarExcel();
  }

  useEffect(() => {
    const obtenerFacturas = async () => {
      try {
        const resp = await ApiFunciones.ObtenerFacturas();
        setFactura(resp.resultado);
      } catch (error) {
        console.error("Error al obtener facturas:", error);
      }
    };
    obtenerFacturas();
  }, [isOpen]);

  return (
    <>
      <Nav />
      <div className="Container-Tabla">
        <Button onClick={() => handleModal(null)}>Nueva Factura</Button>
        <Button bg={'green.500'} ml={5} onClick={()=> handleGenerarExcel()}>Generar Excel</Button>
        <table>
          <thead>
            <tr>
              <th>Numero de Factura</th>
              <th>Valor Factura</th>
              <th>Fecha Factura</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!factura ? (
              <tr>
                <td>Sin datos</td>
              </tr>
            ) : (
              factura.map((fact) => (
                <ItemsLista
                  key={fact.id}
                  factura={fact}
                  clickEditar={handleModal}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <ModalFactura
        factura={editFactura}
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
      />
    </>
  );
};

export default Lista;
