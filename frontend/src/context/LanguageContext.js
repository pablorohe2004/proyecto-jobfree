import { createContext, useContext, useState, useEffect } from "react";

// creamos el contexto del idioma
const LanguageContext = createContext();

export function LanguageProvider({ children }) {

  // guardamos el idioma (lo cogemos del localStorage o usamos "es")
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem("lang") || "es";
  });

  // función para cambiar el idioma
  const cambiarIdioma = (lang) => {
    setIdioma(lang);
  };

  // cada vez que cambia el idioma, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("lang", idioma);
  }, [idioma]);

  // pasamos idioma y función a toda la app
  return (
    <LanguageContext.Provider value={{ idioma, cambiarIdioma }}>
      {children}
    </LanguageContext.Provider>
  );
}

// hook para usar el idioma fácilmente
export function useLanguage() {
  return useContext(LanguageContext);
}
