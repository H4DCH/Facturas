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
import * as apiFunciones from "../Data/useData"

type propsModal = {
  factura: IFactura | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ModalFactura: React.FC<propsModal> = ({ factura, isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFactura>();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
    try {
      if (data && data.id) {
        const resp = await apiFunciones.ActualizarFactura(data.id, data);
        console.log(resp);
      }
    } catch (error) {
      console.log('Error al actualizar la factura:', error);
    }
  });

  const fechaFormateda = factura?.fechaFactura
    ? new Date(factura.fechaFactura).toISOString().substr(0, 10)
    : undefined;

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
              <input type="hidden" {...register("id")} defaultValue={factura?.id}/>
              <label>Número de factura</label>
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
                defaultValue={factura?.numeroFactura}
              />
              {errors.numeroFactura && (
                <span>{errors.numeroFactura.message}</span>
              )}

              <label>Precio de factura</label>
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
                defaultValue={factura?.precio}
              />
              {errors.precio && <span>{errors.precio.message}</span>}

              <label>Fecha de Factura</label>
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
                defaultValue={fechaFormateda}
              />
              {errors.fechaFactura && (
                <span>{errors.fechaFactura.message}</span>
              )}

              <label>Proveedor</label>
              <select {...register("proveedorId")}>
                <option value={factura?.proveedorId}>
                  {factura?.proveedorId}
                </option>
              </select>
            </form>
          </ModalBody>
          <ModalFooter>
            <button className="buttonForm" type="submit" onClick={onSubmit}>
              EDITAR
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
