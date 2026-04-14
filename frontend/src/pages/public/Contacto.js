import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../i18n";

function Contacto() {

  const { idioma } = useLanguage();

  return (
    <div>
      <h2>{t(idioma, "contactoTitulo")}</h2>

      <p>{t(idioma, "email")}: soporte@jobfree.com</p>
      <p>{t(idioma, "telefono")}: +34 600 123 456</p>
      <p>{t(idioma, "ubicacion")}: Écija (Sevilla)</p>
    </div>
  );
}

export default Contacto;
