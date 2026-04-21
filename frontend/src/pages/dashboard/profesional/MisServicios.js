import { useState, useEffect } from "react";
import { obtenerMiPerfil, crearMiPerfil, actualizarMiPerfil } from "../../../api/profesional";
import { crearServicio, obtenerServiciosActivos } from "../../../api/servicios";

function MisServicios() {

  // subcategorías únicas que ya tienen servicios en la BD (deduplicadas)
  const [subcategorias, setSubcategorias] = useState([]);

  // estado del formulario
  const [form, setForm] = useState({
    subcategoriaId: "",
    descripcion: "",
    precioHora: "",
    duracionMin: "60",
    experiencia: 0,
    codigoPostal: "",
  });

  // estado de la interfaz
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  // Cargamos los servicios activos y extraemos las subcategorías únicas que existen en la BD.
  // Así el selector solo muestra opciones reales, no las 175 subcategorías del catálogo completo.
  useEffect(() => {
    obtenerServiciosActivos()
      .then(servicios => {
        // Eliminamos subcategorías duplicadas usando un Map con el id como clave
        const mapaUnico = new Map();
        servicios.forEach(s => {
          if (!mapaUnico.has(s.subcategoriaId)) {
            mapaUnico.set(s.subcategoriaId, {
              id: s.subcategoriaId,
              nombre: s.subcategoriaNombre,
            });
          }
        });
        // Convertimos a array y ordenamos alfabéticamente
        const lista = [...mapaUnico.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
        setSubcategorias(lista);
      })
      .catch(() => setError("No se pudieron cargar los tipos de servicio"));
  }, []);

  // Actualiza cualquier campo del formulario por nombre
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /**
   * Al enviar el formulario:
   * 1. Comprueba si el profesional ya tiene perfil en la BD
   * 2. Si no lo tiene, lo crea con los datos del formulario
   * 3. Si ya lo tiene, actualiza la experiencia y el código postal
   * 4. Por último, crea el servicio vinculado a la subcategoría elegida
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setExito(false);
    setCargando(true);

    try {
      // -- PASO 1: perfil profesional --
      // Comprobamos si ya existe. Si existe → actualizamos. Si no → creamos.
      // Importante: no hacer las dos cosas a la vez.
      let perfil = null;
      let perfilExistia = false;

      try {
        perfil = await obtenerMiPerfil();
        perfilExistia = true;
      } catch {
        // 404 → todavía no tiene perfil profesional
      }

      const datosPerfil = {
        descripcion: form.descripcion,
        experiencia: Number(form.experiencia),
        codigoPostal: form.codigoPostal,
        plan: "BASICO",
      };

      if (perfilExistia) {
        await actualizarMiPerfil(perfil.id, datosPerfil);
      } else {
        perfil = await crearMiPerfil(datosPerfil);
      }

      // -- PASO 2: publicar el servicio --
      // El título lo tomamos del nombre de la subcategoría seleccionada
      const subcategoria = subcategorias.find(s => s.id === Number(form.subcategoriaId));

      await crearServicio({
        titulo: subcategoria.nombre,
        descripcion: form.descripcion,
        duracionMin: Number(form.duracionMin),
        precioHora: Number(form.precioHora),
        subcategoriaId: Number(form.subcategoriaId),
      });

      // Todo bien — mostramos confirmación y reseteamos el formulario
      setExito(true);
      setForm({
        subcategoriaId: "",
        descripcion: "",
        precioHora: "",
        duracionMin: "60",
        experiencia: 0,
        codigoPostal: "",
      });

    } catch (err) {
      setError(err.message || "Error al publicar el servicio. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Mis servicios</h1>
      <p className="text-sm text-gray-500 mb-8">
        Publica un servicio para que los clientes puedan encontrarte.
      </p>

      {/* Mensaje de éxito */}
      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm">
          ✅ Servicio publicado correctamente. ¡Ya apareces en las búsquedas!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Tipo de servicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de servicio <span className="text-red-500">*</span>
          </label>
          <select
            name="subcategoriaId"
            value={form.subcategoriaId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            <option value="">-- Selecciona un tipo de servicio --</option>
            {subcategorias.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del servicio <span className="text-red-500">*</span>
          </label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Describe brevemente el servicio que ofreces..."
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>

        {/* Precio y duración — en la misma fila */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio por hora (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="precioHora"
              value={form.precioHora}
              onChange={handleChange}
              required
              min="1"
              step="0.5"
              placeholder="Ej: 25"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración estimada
            </label>
            <select
              name="duracionMin"
              value={form.duracionMin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1h 30min</option>
              <option value="120">2 horas</option>
              <option value="180">3 horas</option>
            </select>
          </div>

        </div>

        {/* Slider de experiencia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Años de experiencia: <span className="font-bold text-emerald-600">{form.experiencia} años</span>
          </label>
          <input
            type="range"
            name="experiencia"
            value={form.experiencia}
            onChange={handleChange}
            min="0"
            max="40"
            step="1"
            className="w-full accent-emerald-500" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>

        {/* Código postal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código postal de tu zona <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="codigoPostal"
            value={form.codigoPostal}
            onChange={handleChange}
            required
            maxLength={10}
            placeholder="Ej: 28001"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Botón submit */}
        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed">
          {cargando ? "Publicando..." : "Publicar servicio"}
        </button>

      </form>
    </div>
  );
}

export default MisServicios;
