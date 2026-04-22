import { createContext, useContext, useState } from "react";

export const TEMAS = [
  { id: "gris",    bg: "#f3f4f6", texto: "#374151", borde: "#e5e7eb" },
  { id: "blanco",  bg: "#ffffff", texto: "#374151", borde: "#e5e7eb" },
  { id: "verde",   bg: "#064e3b", texto: "#ffffff", borde: "#065f46" },
  { id: "azul",    bg: "#1e3a5f", texto: "#ffffff", borde: "#1e40af" },
  { id: "morado",  bg: "#4c1d95", texto: "#ffffff", borde: "#6d28d9" },
  { id: "negro",   bg: "#111827", texto: "#ffffff", borde: "#1f2937" },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [temaId, setTemaId] = useState(
    () => localStorage.getItem("jf_tema") || "gris"
  );

  const tema = TEMAS.find(t => t.id === temaId) || TEMAS[0];

  function cambiarTema(id) {
    setTemaId(id);
    localStorage.setItem("jf_tema", id);
  }

  return (
    <ThemeContext.Provider value={{ tema, temas: TEMAS, cambiarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
