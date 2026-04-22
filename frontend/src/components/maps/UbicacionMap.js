import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { Circle, CircleMarker, MapContainer, Popup, TileLayer, ZoomControl, useMap } from "react-leaflet";

function RecentrarMapa({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [map, center, zoom]);

  return null;
}

function sonCoordsParecidas(a, b) {
  if (!a || !b) return false;
  return Math.abs(a.latitud - b.latitud) < 0.0001 && Math.abs(a.longitud - b.longitud) < 0.0001;
}

export default function UbicacionMap({ coordsGuardadas, posicionGps }) {
  const center = coordsGuardadas || posicionGps;

  if (!center) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-slate-50 via-white to-emerald-50 px-5 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_30%)]" />
        <div className="relative">
          <p className="text-sm font-semibold text-gray-700">Mapa pendiente de activar</p>
          <p className="mt-1 text-sm text-gray-500">
            Detecta o guarda tu ubicación y aquí verás tu zona de trabajo sobre el mapa.
          </p>
        </div>
      </div>
    );
  }

  const zoom = coordsGuardadas ? 14 : 13;
  const mostrarGps = posicionGps && !sonCoordsParecidas(posicionGps, coordsGuardadas);

  return (
    <div className="relative z-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <MapContainer
        center={[center.latitud, center.longitud]}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={true}
        className="h-80 w-full"
      >
        <RecentrarMapa center={[center.latitud, center.longitud]} zoom={zoom} />
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {coordsGuardadas && (
          <>
            <Circle
              center={[coordsGuardadas.latitud, coordsGuardadas.longitud]}
              radius={120}
              pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.12, weight: 1.5 }}
            />
            <CircleMarker
              center={[coordsGuardadas.latitud, coordsGuardadas.longitud]}
              radius={9}
              pathOptions={{ color: "#065f46", fillColor: "#10b981", fillOpacity: 1, weight: 3 }}
            >
              <Popup>
                Ubicación guardada
                <br />
                {coordsGuardadas.latitud.toFixed(5)}, {coordsGuardadas.longitud.toFixed(5)}
              </Popup>
            </CircleMarker>
          </>
        )}

        {mostrarGps && (
          <>
            <Circle
              center={[posicionGps.latitud, posicionGps.longitud]}
              radius={Math.max((posicionGps.precision || 30), 20)}
              pathOptions={{ color: "#0f172a", fillColor: "#64748b", fillOpacity: 0.14, weight: 1.5 }}
            />
            <CircleMarker
              center={[posicionGps.latitud, posicionGps.longitud]}
              radius={7}
              pathOptions={{ color: "#0f172a", fillColor: "#f8fafc", fillOpacity: 1, weight: 2 }}
            >
              <Popup>
                Detección reciente del dispositivo
                <br />
                Precisión aproximada: +/-{posicionGps.precision || "?"} m
              </Popup>
            </CircleMarker>
          </>
        )}
      </MapContainer>
    </div>
  );
}
