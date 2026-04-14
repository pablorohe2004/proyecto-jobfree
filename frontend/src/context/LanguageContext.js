import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

  const [idioma, setIdioma] = useState(
    localStorage.getItem("lang") || "es"
  );

  const cambiarIdioma = (lang) => {
    setIdioma(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ idioma, cambiarIdioma }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
