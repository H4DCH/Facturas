import { useForm } from "react-hook-form";
import "../Style/Login.css";
import { ILogin } from "../Interface/ILogin";
import * as funcionesLogin from "../Data/useUsuario";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    funcionesLogin.Login(data).then((resp) => {
      if (resp.esExitoso && resp.resultado!=null) {
        sessionStorage.setItem("token", resp.resultado);
        navigate("/facturas");

      }else alert("Correo o contraseña invalidos")
    });
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
              type="emial"
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
    </>
  );
};

export default Login;
