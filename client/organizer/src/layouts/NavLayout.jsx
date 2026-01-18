import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";

const NavLayout = () => {
  return (
    <div className="min-h-screen md:pb-0">
      {/* Page Content */}
      <Outlet />

      {/* Bottom / Center Navbar */}
      <NavBar />
    </div>
  );
};

export default NavLayout;
