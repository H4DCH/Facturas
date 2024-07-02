import {  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { IProveedor } from "../../Interface/IProveedor";
import { useForm } from "react-hook-form";
import * as  ApiFunciones from "../../Data/useProveedor";
import Swal from "sweetalert2";

type propsModal = {
  proveedor: IProveedor | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const ModalProveedor: React.FC<propsModal> = ({proveedor,isOpen,onClose}) => {

    const {register,handleSubmit,reset,formState:{errors}} = useForm<IProveedor>();

    const cerrarModal = () => {
      reset();
      onClose();
    };
    const onSubmit = handleSubmit(async (data) => {
      try {
        if (data && data.id) {
          ApiFunciones.ActualizarProveedor(data.id, data).then(
            (apiResponse) => {
              console.log(apiResponse)
              if (apiResponse.esExitoso) {
                reset();
                onClose();
                Swal.fire({
                  title: "Proveedor Actualizado",
                  icon: "success",
                });
              }
              else{
                reset()
                onClose()
                Swal.fire({
                  title: apiResponse.errorMessages,
                  icon: "error",
                });
              }
            }
          );
        }else{
          ApiFunciones.CrearProveedor(data).then(
            (apiResponse) => {
              console.log(apiResponse)
              if (apiResponse.esExitoso) {
                reset();
                onClose();
                Swal.fire({
                  title: "Proveedor Actualizado",
                  icon: "success",
                });
              }
              else{
                reset()
                onClose()
                Swal.fire({
                  title: apiResponse.errorMessages,
                  icon: "error",
                });
              }
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    });


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {proveedor?.id ? (
              <h4>Edicion de Proveedor</h4>
            ) : (
              <h4>Creacion de Proveedor</h4>
            )}
          </ModalHeader>
          <ModalBody>
          <form className="formProveedor" >
              <input defaultValue={proveedor?.id} type="hidden" {...register("id")} />
              <label>
                Nombre Proveedor
                <input defaultValue={proveedor?.nombreProveedor}
                  {...register("nombreProveedor", {
                    required: {
                      value: true,
                      message: "Nombre del proveedor es obligatorio",
                    },
                    validate: (value) => {
                      if (value.length <=0) {
                        return "Nombre de la factura invalido";
                      }
                      return true;
                    },
                  })}
                  type="text"
                  placeholder="Ingrese el nombre del proveedor"
                />
                {errors.nombreProveedor && (
                  <span>{errors.nombreProveedor.message}</span>
                )}
              </label>
            </form>
          </ModalBody>
          <ModalFooter>
          <button className="buttonForm" type="submit" onClick={onSubmit}>
              {proveedor && proveedor.nombreProveedor ? "EDITAR" : "CREAR"}
            </button>
            <button className="buttonForm" type="button" onClick={cerrarModal}>
              CANCELAR
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalProveedor;
