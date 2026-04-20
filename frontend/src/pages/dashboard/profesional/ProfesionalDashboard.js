import { useState } from "react";
import Sidebar from "components/layout/dashboard/Sidebar";
import Topbar from "components/layout/dashboard/Topbar";
import { Outlet } from "react-router-dom";

function ProfesionalDashboard() {
  // controla sidebar en móvil
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">

      {/* sidebar lateral (menú del profesional) */}
      <Sidebar
        tipo="profesional"
        open={open}
        setOpen={setOpen} />

      {/* oscurece el fondo en versión móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)} />
      )}

      {/* zona principal */}
      <div className="ml-0 md:ml-64">

        {/* barra superior */}
        <Topbar setOpen={setOpen} />

        {/* contenido del dashboard */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default ProfesionalDashboard;
