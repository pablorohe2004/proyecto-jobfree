import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import logo from "../../../assets/images/logo.png";

function Header() {
  return (
    // cabecera principal de la página
    <header className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-100 border-b">

      {/* enlace al inicio con el logo de la aplicación */}
      <Link to="/">
        <img src={logo} className="h-16" alt="Logo de JobFree" />
      </Link>

      {/* zona central con el buscador de servicios */}
      <div className="w-full md:flex-1 flex justify-center">
        <div className="relative w-full max-w-md">

          {/* icono de lupa colocado dentro del input */}
          <MagnifyingGlassIcon
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          {/* campo de texto para buscar servicios */}
          <input type="text" placeholder="Buscar servicios..." aria-label="Buscar servicios" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* botones para autenticación de usuario */}
      <nav className="flex gap-3">

        {/* enlace para iniciar sesión */}
        <Link to="/login" className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-50 transition font-medium">
          Iniciar sesión
        </Link>

        {/* enlace para crear una cuenta nueva */}
        <Link to="/registro" className="bg-blue-600 text-white px-4 py-2 rounded-full whitespace-nowrap hover:bg-blue-700 hover:shadow-md transition font-medium">
          Registrarse
        </Link>

      </nav>

    </header>
  );
}

export default Header;
