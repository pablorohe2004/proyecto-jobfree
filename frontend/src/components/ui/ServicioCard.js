import { Link } from "react-router-dom";

function ServicioCard({ categoria }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow shadow-black/10 hover:-translate-y-1 transition duration-300 overflow-hidden max-w-80">

      {/* imagen */}
      <img src={"/images/servicios/" + categoria.imagen} alt={categoria.nombre} className="w-full h-44 object-cover" />

      <div className="p-5">

        {/* título */}
        <h3 className="text-lg font-semibold text-gray-900">
          {categoria.nombre}
        </h3>

        {/* descripción */}
        <p className="text-gray-600 mt-1 mb-4">
          {categoria.descripcion}
        </p>

        {/* botón */}
        <Link 
          to={"/profesionales/" + categoria.id} 
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
          Ver profesionales
        </Link>

      </div>

    </div>
  );
}

export default ServicioCard; 
