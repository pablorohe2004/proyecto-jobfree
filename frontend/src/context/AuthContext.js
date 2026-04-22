import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, logout as logoutAPI, getMe, registrarCliente, registrarProfesional } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // La cookie httpOnly se envía automáticamente — no hace falta leer localStorage
    getMe()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    // Cuando apiFetch recibe un 401 en endpoints protegidos (sesión expirada),
    // emite este evento para cerrar la sesión y redirigir al login.
    function handleSesionExpirada() {
      setUsuario(null);
      window.location.href = "/login";
    }
    window.addEventListener("auth:sesion-expirada", handleSesionExpirada);
    return () => window.removeEventListener("auth:sesion-expirada", handleSesionExpirada);
  }, []);

  async function iniciarSesion(email, password) {
    const respuesta = await loginAPI(email, password);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }

  async function registrar(datos, esProfesional) {
    if (esProfesional) {
      await registrarProfesional(datos);
    } else {
      await registrarCliente(datos);
    }
    return iniciarSesion(datos.email, datos.password);
  }

  async function completarLoginOAuth() {
    const datosUsuario = await getMe();
    setUsuario(datosUsuario);
    return datosUsuario;
  }

  async function cargarUsuarioActual() {
    const datosUsuario = await getMe();
    setUsuario(datosUsuario);
    return datosUsuario;
  }

  async function cerrarSesion() {
    await logoutAPI(); // el backend limpia la cookie
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, iniciarSesion, completarLoginOAuth, cargarUsuarioActual, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
