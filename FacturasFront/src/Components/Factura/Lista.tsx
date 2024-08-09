import { useEffect, useState } from "react";
import * as ApiFunciones from "../../Data/useFactura";
import ItemsLista from "./ItemsLista";
import "../../Style/EstiloTabla.css";
import { Button, useDisclosure } from "@chakra-ui/react";
import { IFactura } from "../../Interface/IFactura";
import ModalFactura from "./ModalFactura";
import Nav from "../Nav";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const Lista = () => {

  const [factura, setFactura] = useState<IFactura[] | null>(null);
  const [editFactura, seteditFactura] = useState<IFactura | null>(null);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [refrescar,setRefrescar] = useState<boolean>(false);
  const [pagina,setPagina] = useState<number>(1);
  const navigate = useNavigate();
  const handleModal = (fact: IFactura | null) => {
    seteditFactura(fact);
    onOpen();
  };


  const handleGenerarExcel = () => {
    ApiFunciones.GenerarExcel();
  };  

  const actualizarRefrescar =(refresh:boolean)=>{
    setRefrescar(refresh);
  }

  const paginaSiguiente =()=>{
    if (factura && factura.length !== 0) {
      setPagina(pagina + 1);
    }
  }

  const paginaAnterior =()=>{
    pagina> 0 && setPagina(pagina-1);
  }


  useEffect(() => {
    const obtenerFacturas = async () => {
      try {
        const resp = await ApiFunciones.ObtenerFacturas(pagina);
        setFactura(resp.resultado);
      } catch (error) {
        navigate('/login')
        Swal.fire({
          title: "Inicia Sesión Nuevamente",
          icon: "warning",

        });
      }
    };
    obtenerFacturas();
    actualizarRefrescar(false);
  }, [refrescar,pagina]);

  return (
    <>
      <Nav />
      <div className="Container-Tabla">
        <Button onClick={() => handleModal(null)}>Nueva Factura</Button>
        <Button bg={"green.500"} ml={5} onClick={() => handleGenerarExcel()}>
          Generar Excel
        </Button>
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
            {!factura? (
              <tr>
                <td>Sin datos</td>
              </tr>
            ) : (
              factura.map((fact) => (
                <ItemsLista
                  actualizarRefrescar={actualizarRefrescar}
                  key={fact.id}
                  factura={fact}
                  clickEditar={handleModal}
                />
              ))
            )}
          </tbody>
        </table>

        {pagina > 1 ? (
          <Button onClick={paginaAnterior}>Pagina Anterior</Button>
        ) : (
          <Button disabled>Pagina Anterior</Button>
        )}
          <Button onClick={paginaSiguiente}>Pagina Siguiente</Button>
      </div>
      <ModalFactura
        actualizarRefrescar={actualizarRefrescar}
        factura={editFactura}
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
      />
    </>
  );
};

export default Lista;
