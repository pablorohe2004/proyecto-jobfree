import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Servicios.css";

import { obtenerCategorias } from "../../api/categoriasApi";

function Servicios() {

  // estado donde guardamos las categorias que vienen del backend
  const [categorias, setCategorias] = useState([]);

  // se ejecuta cuando se carga la página
  useEffect(() => {
    // llama a la API y guarda las categorias en el estado
    obtenerCategorias().then(data => setCategorias(data));
  }, []);

  return (
    <div>

      <h2>Servicios disponibles</h2>

      <div className="servicios-grid">

        {/* recorremos las categorias y mostramos cada una */}
        {categorias.map(categoria => (
          <div key={categoria.id}>

            <h3>{categoria.nombre}</h3>
            <p>{categoria.descripcion}</p>

            {/* botón que lleva a la página de profesionales de esa categoria */}
            <Link to={`/profesionales/${categoria.id}`}>
              <button>Ver profesionales</button>
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Servicios;