import { useForm } from "react-hook-form";
import "../Style/Login.css";
import { ILogin } from "../Interface/ILogin";
import * as funcionesLogin from "../Data/useUsuario";
import { useNavigate } from "react-router-dom";
import RutasProtegidas from "../RutasProtegidas";
import { useState } from "react";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const navigate = useNavigate();

  const [Aut, setAut] = useState<boolean>(false);



  const onSubmit = handleSubmit(async (data) => {
    try {
      const resp = await funcionesLogin.Login(data);
      if (resp.esExitoso && resp.statusCode == 200) {
        setAut(true);
        sessionStorage.setItem("token", resp.resultado.result);
        navigate("/facturas");
      } else alert("Correo o contraseña invalidos");
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  });

  return (
    <>
      <div className="ContenedorPrincipal">
        <form onSubmit={onSubmit}>
          <label className="input_login">
            Correo
            <input
              {...register("correo", {
                required: {
                  value: true,
                  message: "El correo es necesario",
                },
              })}
              type="email"
              placeholder="ejemplo@ejemplo.com"
            />
            {errors.correo && <span>{errors.correo.message}</span>}
          </label>

          <label>
            Contraseña
            <input
              {...register("clave", {
                required: {
                  value: true,
                  message: "La contraseña es necesaria",
                },
              })}
              type="password"
            />
            {errors.clave && <span>{errors.clave.message}</span>}
          </label>
          <button className="button-login" type="submit">
            Iniciar Sesion
          </button>
        </form>
      </div>
      <RutasProtegidas isAut={Aut} />
    </>
  );
};

export default Login;
