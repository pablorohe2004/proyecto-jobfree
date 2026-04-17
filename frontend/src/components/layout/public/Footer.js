import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

// importamos idioma
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";

function Footer() {

  // obtenemos idioma actual
  const { idioma } = useLanguage();

  return (
    // footer principal
    <footer className="bg-[#4b5070] text-white body-font">
      {/* contenedor */}
      <div className="container px-5 py-16 mx-auto">
        {/* columnas */}
        <div className="flex flex-wrap md:text-left text-center -mx-4">
          {/* columna logo y newsletter */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4 lg:pr-10 mb-10 md:mb-0">
            {/* logo */}
            <img src={logo} alt="JobFree" className="h-16 mb-4 mx-auto md:mx-0" />

            {/* texto newsletter */}
            <p className="mb-3 text-sm text-gray-200">
              {t(idioma, "footer.newsletter")}
            </p>

            {/* formulario */}
            <form className="flex items-center gap-3 justify-center md:justify-start">
              <input
                type="email"
                required
                placeholder={t(idioma, "footer.emailPlaceholder")}
                aria-label={t(idioma, "footer.emailPlaceholder")}
                className="bg-[#5d6185] text-white text-sm rounded px-3 py-2 outline-none w-full md:max-w-[220px]"
              />

              <button
                type="submit"
                className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition whitespace-nowrap">
                {t(idioma, "footer.suscribirse")}
              </button>
            </form>
          </div>

          {/* columna conocenos */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="font-semibold text-sm mb-3 tracking-widest">
              {t(idioma, "nav.conocenos")}
            </h2>

            <nav className="list-none mb-8 space-y-1">
              <li>
                <Link to="/conocenos" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.empresa.quienesSomos")}
                </Link>
              </li>

              <li>
                <Link to="/conocenos" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.empresa.queOfrecemos")}
                </Link>
              </li>

              <li>
                <Link to="/contacto" className="text-gray-200 hover:text-white">
                  {t(idioma, "nav.contacto")}
                </Link>
              </li>
            </nav>
          </div>

          {/* columna servicios */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="font-semibold text-sm mb-3 tracking-widest">
              {t(idioma, "nav.servicios")}
            </h2>

            <nav className="list-none mb-8 space-y-1">
              <li>
                <Link to="/servicios" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.plataforma.serviciosDisponibles")}
                </Link>
              </li>

              <li>
                <Link to="/servicios" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.plataforma.profesionales")}
                </Link>
              </li>

              <li>
                <Link to="/servicios" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.plataforma.reservas")}
                </Link>
              </li>
            </nav>
          </div>

          {/* columna legal */}
          <div className="lg:w-1/4 md:w-1/2 w-full px-4">
            <h2 className="font-semibold text-sm mb-3 tracking-widest">
              {t(idioma, "footer.legal.titulo")}
            </h2>

            <nav className="list-none mb-8 space-y-1">
              <li>
                <Link to="/terminos" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.legal.terminos")}
                </Link>
              </li>

              <li>
                <Link to="/privacidad" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.legal.privacidad")}
                </Link>
              </li>

              <li>
                <Link to="/cookies" className="text-gray-200 hover:text-white">
                  {t(idioma, "footer.legal.cookies")}
                </Link>
              </li>
            </nav>
          </div>
        </div>
      </div>

      {/* línea separadora */}
      <div className="border-t-[3px] border-gray-400/40">
        <div className="container px-5 py-4 mx-auto flex items-center justify-center">
          <p className="text-sm text-gray-200">
            Copyright © {new Date().getFullYear()} JobFree
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
