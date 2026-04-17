import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../i18n";

function Contacto() {

  const { idioma } = useLanguage();

  return (
    <div>
      <h2>{t(idioma, "contacto.titulo")}</h2>

      <p>{t(idioma, "contacto.email")}: soporte@jobfree.com</p>
      <p>{t(idioma, "contacto.telefono")}: +34 600 123 456</p>
      <p>{t(idioma, "contacto.ubicacion")}: Écija (Sevilla)</p>
    </div>
  );
}

export default Contacto;
