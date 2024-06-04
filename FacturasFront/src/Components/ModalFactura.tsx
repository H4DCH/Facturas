import { Button,Modal,ModalBody,ModalCloseButton,ModalContent,ModalFooter,ModalHeader,ModalOverlay,} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as apiFunciones from "../Data/useData"

type propsModal = {
  isOpen: boolean;
  onClose: () => void;
  idFactura : number;
};

const ModalFactura: React.FC<propsModal> = ({ isOpen, onClose, idFactura }) => {
  const { register, handleSubmit,setValue } = useForm();

  useEffect(()=>{
    apiFunciones.ObtenerPorId(idFactura)
    .then((resp) =>{
      setValue("id",idFactura)
      setValue("numeroFactura",resp.resultado.numeroFactura)
      setValue("precio",resp.resultado.precio)
      setValue("proveedorId",resp.resultado.proveedorId)
    }).catch((e)=>{
      console.error(e)
    })
  },[])
  const onSubmit = (data: any) => {
    console.log(data)
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Formulario de Ejemplo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
            <input
                type="hidden"
                {...register("id")}
              />
              <input
                type="number"
                placeholder="Ingrese la factura"
                {...register("numeroFactura")}
              />
              <input
                type="number"
                placeholder="Precio de  Factura"
                {...register("precio")}
              />
              <input
                type="number"
                placeholder="Proveedor"
                {...register("proveedorId")}
              />
              <button type="submit">Modificar</button>
            </form>
          </ModalBody>
          <ModalFooter>
           
            <Button onClick={onClose} ml={3}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalFactura;
