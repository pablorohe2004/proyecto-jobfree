import { useEffect, useState } from "react";
import { obtenerCategorias } from "../../api/categoriasApi";
import ServicioCard from "../../components/ui/ServicioCard";

function Servicios() {
  // estado donde se guardan las categorías de servicios
  const [categorias, setCategorias] = useState([]);

  // cargar las categorías al entrar en la página
  useEffect(() => {
    obtenerCategorias().then(data => setCategorias(data));
  }, []);

  return (
    <div className="px-8 py-10">

      {/* título de la página */}
      <h3 className="text-3xl font-bold mb-8 text-center">
        Encuentra lo que necesitas entre nuestros servicios
      </h3>

      {/* contenedor de cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* recorre las categorías y crea una card por cada una */}
        {categorias.map(categoria => (
          <ServicioCard
            key={categoria.id}
            categoria={categoria}
          />
        ))}

      </div>

    </div>
  );
}

export default Servicios;
