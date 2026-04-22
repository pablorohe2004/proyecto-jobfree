import { useState, useCallback } from "react";

/**
 * Hook para obtener y gestionar la geolocalización del navegador.
 *
 * Uso:
 *   const { posicion, cargando, error, obtenerPosicion, limpiar } = useGeolocalizacion();
 *
 * - obtenerPosicion() → Promise<{ latitud, longitud, precision }>
 * - posicion → objeto con las coordenadas actuales (null si no se ha obtenido)
 * - cargando → true mientras espera la respuesta del navegador
 * - error → string con el mensaje de error (null si no hay)
 */
export function useGeolocalizacion() {
  const [posicion, setPosicion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerPosicion = useCallback(() => {
    if (!navigator.geolocation) {
      const msg = "Tu navegador no soporta geolocalización.";
      setError(msg);
      return Promise.reject(new Error(msg));
    }

    setCargando(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            latitud:   pos.coords.latitude,
            longitud:  pos.coords.longitude,
            precision: Math.round(pos.coords.accuracy),
          };
          setPosicion(coords);
          setCargando(false);
          resolve(coords);
        },
        (err) => {
          let mensaje;
          switch (err.code) {
            case err.PERMISSION_DENIED:
              mensaje = "Permiso de ubicación denegado. Actívalo en la configuración del navegador.";
              break;
            case err.POSITION_UNAVAILABLE:
              mensaje = "No se pudo determinar tu ubicación actual.";
              break;
            case err.TIMEOUT:
              mensaje = "El tiempo de espera para obtener la ubicación se agotó.";
              break;
            default:
              mensaje = "Error desconocido al obtener la ubicación.";
          }
          setError(mensaje);
          setCargando(false);
          reject(new Error(mensaje));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  const limpiar = useCallback(() => {
    setPosicion(null);
    setError(null);
  }, []);

  return { posicion, cargando, error, obtenerPosicion, limpiar };
}
