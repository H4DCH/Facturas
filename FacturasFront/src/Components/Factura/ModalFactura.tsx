import { useForm } from "react-hook-form";
import { IFactura } from "../../Interface/IFactura";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import "../../Style/EstilosFormularios.css";
import * as apiFunciones from "../../Data/useData";
import { useEffect, useState } from "react";
import { IProveedor } from "../../Interface/IProveedor";
import * as apiFuncionesProv from "../../Data/useProveedor"
import Swal from "sweetalert2";

type propsModal = {
  factura: IFactura | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ModalFactura: React.FC<propsModal> = ({ factura, isOpen, onClose }) => {

  const fechaFormateda = factura?.fechaFactura
    ? new Date(factura.fechaFactura).toISOString().substr(0, 10)
    : undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFactura>();


  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data && data.id) {
        await apiFunciones.ActualizarFactura(data.id, data);
        Swal.fire({
          title: "Factura Actualizada",
          icon: "success"
        });
        reset();
        onClose();
      }
      else {
        await apiFunciones.CrearFactura(data)
        Swal.fire({
          title: "Factura Creada",
          icon: "success"
        });
        reset();
        onClose()
      }
    } catch (error) {
      console.log("Error con el proceso:", error);
    }
  });

  const handleClose =()=>{
    reset();
    onClose();
  }

 const [proveedores , setProveedor] = useState<IProveedor[]>();

  useEffect(()=>{
    apiFuncionesProv.ListaProveedores()
    .then((resp)=>{
      setProveedor(resp.resultado)
    })
  },[])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {factura?.numeroFactura ? (
              <h4>Edicion de Factura</h4>
            ) : (
              <h4>Creacion de Factura</h4>
            )}
          </ModalHeader>
          <ModalBody>
            <form onSubmit={onSubmit}>
              <input defaultValue={factura?.id} type="hidden" {...register("id")} />
              <label>
                Número de factura
                <input defaultValue={factura?.numeroFactura}
                  {...register("numeroFactura", {
                    required: {
                      value: true,
                      message: "Numero de factura obligatorio",
                    },
                    validate: (value) => {
                      if (value <= 0) {
                        return "Numero de factura invalido";
                      }
                      return true;
                    },
                  })}
                  type="number"
                  placeholder="Ingrese el numero de factura"
                />
                {errors.numeroFactura && (
                  <span>{errors.numeroFactura.message}</span>
                )}
              </label>

              <label>
                Precio de factura
                <input defaultValue={factura?.precio}
                  {...register("precio", {
                    required: {
                      value: true,
                      message: "Precio de factura obligatorio",
                    },
                    validate: (value) => {
                      if (value <= 0) {
                        return "El precio deber ser mayor a 0";
                      }
                      return true;
                    },
                  })}
                  type="number"
                  placeholder="Ingrese el precio de factura"
                />
                {errors.precio && <span>{errors.precio.message}</span>}
              </label>

              <label>
                Fecha de Factura
                <input defaultValue={fechaFormateda}
                  {...register("fechaFactura", {
                    required: {
                      value: true,
                      message: "Fecha de factura requerido",
                    },
                    validate: (value) => {
                      const fechaActual = new Date();
                      const fechaFactura = new Date(value);

                      if (fechaFactura > fechaActual) {
                        return "Fecha invalida";
                      }
                      return true;
                    },
                  })}
                  type="date"
                  placeholder="Ingrese la fecha de la factura"
                />
                {errors.fechaFactura && (
                  <span>{errors.fechaFactura.message}</span>
                )}
              </label>
              <label>
                Proveedor
                <select {...register("proveedorId") } defaultValue={factura?.proveedorId}>
                    {proveedores?.map((prov)=>(
                      <option key={prov.id} value={prov.id}>{prov.nombreProveedor}</option>
                    ))}
                </select>
              </label>
            </form>
          </ModalBody>
          <ModalFooter>
            <button className="buttonForm" type="submit" onClick={onSubmit}>
              {factura && factura.numeroFactura ? "EDITAR" : "CREAR"}
            </button>
            <button className="buttonForm" type="button" onClick={handleClose}>
              CANCELAR
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalFactura;
