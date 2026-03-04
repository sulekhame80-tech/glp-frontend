import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "./components/layouts/Topbar";
import Sidebar from "./components/layouts/Sidenav";
import { UserContext } from "./UserContext";

function Layout({ children }) {
  const { userName, role } = useContext(UserContext);
  const location = useLocation();

  // Hide Topbar & Sidebar on login/root/landing
  const hideTopbar =
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/landing";



  return (
    <div id="body" className="ms-body ms-aside-left-open ms-primary-theme">
      {!hideTopbar && (
        <>
          <Topbar user_name={userName} role={role} />
          <Sidebar user_name={userName} role={role} />
        </>
      )}

      {/* Full-screen on landing and login; normal body-content wrapper elsewhere */}
      {location.pathname === "/landing" || location.pathname === "/" || location.pathname === "/login" ? (
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      ) : (
        <div className="body-content">
          {children}
        </div>
      )}
    </div>
  );
}

export default Layout;
