import { Link } from "react-router-dom";
import "../Style/EstiloNav.css";

const Nav = () => {
  return (
    <>
      <nav className="nav-pricipal">
        <div>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/proveedor">Proveedores</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
