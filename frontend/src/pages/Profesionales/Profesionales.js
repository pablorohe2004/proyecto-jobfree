import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerServiciosPorCategoria } from "../../api/serviciosApi";

function Profesionales() {

  // obtenemos el id de la categoria desde la URL
  const { id } = useParams();

  // estado donde guardamos los servicios que vienen del backend
  const [servicios, setServicios] = useState([]);

  // se ejecuta cuando se carga la página o cambia el id
  useEffect(() => {

    obtenerServiciosPorCategoria(id)
      .then(data => setServicios(data));

  }, [id]);

  return (
    <div>

      <h2>Profesionales disponibles</h2>

      {/* mensaje si no hay servicios */}
      {servicios.length === 0 && (
        <p>No hay profesionales disponibles.</p>
      )}

      {/* recorremos los servicios y mostramos cada profesional */}
      {servicios.map(servicio => (
        <div key={servicio.id}>

          {/* nombre */}
          <h3>{servicio.profesional.usuario.nombre}</h3>

          {/* ciudad */}
          <p>{servicio.profesional.usuario.ciudad}</p>

          {/* valoración */}
          <p>{servicio.profesional.valoracionMedia} ({servicio.profesional.numeroValoraciones} opiniones)</p>

          {/* precio */}
          <p>Desde {servicio.precioHora}€/hora</p>

          {/* descripcion */}
          <p>{servicio.descripcion}</p>

          {/* botones */}
          <button>Ver perfil</button>
          <button>Contratar</button>
        </div>
      ))}

    </div>
  );
}

export default Profesionales;
