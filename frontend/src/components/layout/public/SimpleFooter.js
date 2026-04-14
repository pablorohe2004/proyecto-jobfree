import { Link } from "react-router-dom";

// importamos idioma
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../i18n";

function SimpleFooter() {
    // obtenemos idioma actual
    const { idioma } = useLanguage();

    return (
        <footer className="bg-gray-300 border-t border-gray-300 mt-auto">
            <div className="text-center py-4 text-sm text-gray-700">
                {/* enlaces */}
                <div className="space-x-2">
                    <Link to="/terminos" className="hover:underline">
                        {t(idioma, "terminos")}
                    </Link>
                    <span>|</span>
                    <Link to="/privacidad" className="hover:underline">
                        {t(idioma, "privacidad")}
                    </Link>
                </div>

                {/* copyright */}
                <div>
                    © {new Date().getFullYear()} JobFree
                </div>

            </div>
        </footer >
    );
}

export default SimpleFooter;
