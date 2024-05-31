export interface IApiResponse<T>{
    statusCode:number,
    esExitoso:boolean,
    errorMessages:string[] | null,
    resultado : T;
}