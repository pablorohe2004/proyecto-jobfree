import { Link } from "react-router-dom";

function Menu() {
  return (
    <nav className="menu-principal">

      <Link to="/">Inicio</Link>

      <div className="menu-servicios">
        <button className="boton-servicios">Servicios ▼</button>

        <div className="lista-servicios">
          <Link to="/servicios">Mantenimiento</Link>
          <Link to="/servicios">Reparaciones</Link>
          <Link to="/servicios">Cuidado personal</Link>
          <Link to="/servicios">Mascotas</Link>
          <Link to="/servicios">Clases</Link>
          <Link to="/servicios">Urgencias</Link>
          <Link to="/servicios">Otros</Link>
        </div>
      </div>

      <Link to="/conocenos">Conócenos</Link>
      <Link to="/para-profesionales">Para profesionales</Link>
      <Link to="/contacto">Contacto</Link>

    </nav>
  );
}

export default Menu;