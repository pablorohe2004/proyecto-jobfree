import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, getMe, registrarCliente, registrarProfesional } from "../api/auth";

// Creamos el contexto que compartirá la sesión con toda la app
const AuthContext = createContext();

/**
 * Proveedor de autenticación.
 * Envuelve la app entera y pone la sesión a disposición de cualquier componente.
 */
export function AuthProvider({ children }) {

  // Datos del usuario logueado: { id, nombreCompleto, email, ciudad, rol }
  // Null si no hay sesión activa
  const [usuario, setUsuario] = useState(null);

  // El token JWT que enviamos al backend en cada petición protegida
  const [token, setToken] = useState(null);

  // Mientras comprobamos si hay sesión guardada, mostramos "cargando"
  // para que los componentes protegidos no hagan nada hasta saber si hay sesión
  const [cargando, setCargando] = useState(true);

  /**
   * Al arrancar la app, miramos si hay un token guardado en localStorage.
   * Si lo hay, lo verificamos preguntando al backend quién eres.
   * Si el token ha caducado o es inválido, lo borramos.
   */
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("jf_token");

    if (tokenGuardado) {
      // Verificamos que el token sigue siendo válido llamando a /auth/me
      getMe(tokenGuardado)
        .then((datosUsuario) => {
          // Token válido → restauramos la sesión sin que el usuario tenga que volver a loguearse
          setToken(tokenGuardado);
          setUsuario(datosUsuario);
        })
        .catch(() => {
          // Token inválido o caducado → limpiamos localStorage para empezar de cero
          localStorage.removeItem("jf_token");
        })
        .finally(() => {
          // Ya hemos terminado la comprobación inicial, sea cual sea el resultado
          setCargando(false);
        });
    } else {
      // No hay token guardado → no hay sesión, listo
      setCargando(false);
    }
  }, []); // Solo se ejecuta una vez al montar el componente

  /**
   * Inicia sesión: llama al backend con email y contraseña,
   * recibe el token JWT, luego obtiene los datos del usuario y los guarda.
   * Devuelve el usuario para que el componente pueda redirigir según el rol.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Object} datos del usuario logueado
   */
  async function iniciarSesion(email, password) {
    // Primero hacemos login → obtenemos el token
    const tokenNuevo = await loginAPI(email, password);

    // Con el token, preguntamos al backend quién es este usuario
    const datosUsuario = await getMe(tokenNuevo);

    // Guardamos el token en localStorage para que sobreviva al recargar
    localStorage.setItem("jf_token", tokenNuevo);

    // Actualizamos el estado global
    setToken(tokenNuevo);
    setUsuario(datosUsuario);

    // Devolvemos el usuario para que el componente pueda saber el rol y redirigir
    return datosUsuario;
  }

  /**
   * Registra un nuevo usuario (cliente o profesional),
   * y si el registro va bien, hace login automáticamente.
   * Así el usuario no tiene que volver a meter sus datos.
   *
   * @param {Object} datos formulario de registro
   * @param {boolean} esProfesional true si se registra como profesional
   * @returns {Object} datos del usuario logueado tras el registro
   */
  async function registrar(datos, esProfesional) {
    // Según el tipo, llamamos a un endpoint u otro
    if (esProfesional) {
      await registrarProfesional(datos);
    } else {
      await registrarCliente(datos);
    }

    // Registro correcto → hacemos login automático para no obligar al usuario a repetir el proceso
    return await iniciarSesion(datos.email, datos.password);
  }

  /**
   * Cierra la sesión: elimina el token de localStorage y limpia el estado.
   * Después el componente se encargará de redirigir al inicio o al login.
   */
  function cerrarSesion() {
    localStorage.removeItem("jf_token");
    setToken(null);
    setUsuario(null);
  }

  // Exponemos todo lo necesario al resto de la app a través del contexto
  return (
    <AuthContext.Provider value={{ usuario, token, cargando, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para usar la sesión desde cualquier componente.
 * Ejemplo: const { usuario, cerrarSesion } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
