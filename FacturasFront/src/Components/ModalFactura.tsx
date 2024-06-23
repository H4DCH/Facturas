import { useForm } from "react-hook-form";
import { IFactura } from "../Interface/IFactura";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import "../Style/EstilosFormularios.css";
import * as apiFunciones from "../Data/useData";
import { useEffect, useState } from "react";
import { IProveedor } from "../Interface/IProveedor";
import * as apiFuncionesProv from "../Data/useProveedor"

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
    formState: { errors },
  } = useForm<IFactura>({
    defaultValues: {
      id: factura?.id,
      numeroFactura: factura?.numeroFactura,
      precio: factura?.precio,
      fechaFactura: fechaFormateda,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data && data.id) {
        await apiFunciones.ActualizarFactura(data.id, data);
        onClose();
      }
      else {
        await apiFunciones.CrearFactura(data)
        onClose()
      }
    } catch (error) {
      console.log("Error con el proceso:", error);
    }
  });

 const [proveedores , setProveedor] = useState<IProveedor[]>();

  useEffect(()=>{
    apiFuncionesProv.ListaProveedores()
    .then((resp)=>{
      setProveedor(resp)
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
              <input type="hidden" {...register("id")} />

              <label>
                Número de factura
                <input
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
                <input
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
                <input
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
                <select {...register("proveedorId")} value={factura?.proveedorId}>
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
            <button className="buttonForm" type="button" onClick={onClose}>
              CANCELAR
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalFactura;
