import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Header() {
  return (
    <header className="cabecera">

      <Link to="/">
        <img src={logo} className="logo" alt="JobFree logo" />
      </Link>

      <div className="buscador">
        <input type="text" placeholder="Buscar servicios..." />
      </div>

      <nav className="menu-superior">
        <Link to="/login">Iniciar sesión</Link>
        <Link to="/registro">
          Registrarse
        </Link>
      </nav>

    </header>
  );
}

export default Header;