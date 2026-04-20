import { Outlet } from "react-router-dom";
import Navbar from "components/layout/public/Navbar";
import Footer from "components/layout/public/Footer";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
