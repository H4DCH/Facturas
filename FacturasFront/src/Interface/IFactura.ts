import { IProveedor } from "./IProveedor";

export interface IFactura {
    id: number;
    numeroFactura: number;
    precio : number;
    fechaFactura : string;
    proveedor:IProveedor;
    proveedorId : number
}