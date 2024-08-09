import { Link, useNavigate } from "react-router-dom";
import "../Style/EstiloNav.css";

const Nav = () => {
const navigate = useNavigate();
  const cerrarSession =()=>{
    sessionStorage.removeItem('token');
    navigate('/login')
  }
  return (
    <>
      <nav className="nav-pricipal">
          <ul>
            <li>
              <Link to="/facturas">Facturas</Link>
            </li>
            <li>
              <Link to="/proveedores">Proveedores</Link>
            </li>
          </ul>
          <button className="boton-logout" onClick={cerrarSession}>Cerrar Sesión</button>
      </nav>
    </>
  );
};

export default Nav;
