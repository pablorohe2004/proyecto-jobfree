const API_URL = "http://localhost:8080";
export default API_URL;

/**
 * Wrapper sobre fetch que siempre incluye credentials: 'include'
 * para que el navegador envíe la cookie httpOnly de autenticación.
 */
export async function apiFetch(path, options = {}) {
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };
  if (options.body && typeof options.body === "string") {
    headers["Content-Type"] = "application/json";
  }
  return fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers,
  });
}
