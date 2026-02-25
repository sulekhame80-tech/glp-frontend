import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "./components/layouts/Topbar";
import Sidebar from "./components/layouts/Sidenav";
import { UserContext } from "./UserContext";

function Layout({ children }) {
  const { userName, role } = useContext(UserContext);
  const location = useLocation();

  // Hide Topbar & Sidebar on login/root
  const hideTopbar =
    location.pathname === "/login" || location.pathname === "/";

  // Auto-shrink sidebar when clicking OUTSIDE the sidebar on desktop
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (window.innerWidth < 768) return;

      const body = document.getElementById("body");
      if (!body || body.classList.contains("ms-aside-mini")) return;

      // Don't collapse if the click was on the hamburger toggle button
      const toggler = document.querySelector(".ms-aside-toggler");
      if (toggler && toggler.contains(e.target)) return;

      // Collapse back to mini
      body.classList.add("ms-aside-mini");
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div id="body" className="ms-body ms-aside-left-open ms-primary-theme">
      {!hideTopbar && (
        <>
          <Topbar user_name={userName} role={role} />

          {/* ⚡ stopPropagation prevents sidebar clicks from triggering outside-click collapser */}
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar user_name={userName} role={role} />
          </div>
        </>
      )}

      <div className="body-content">
        {children}
      </div>

      {/* Powered By badge */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "25px",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "5px 10px",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: "500",
            color: "#0f5c87",
            marginRight: "8px",
          }}
        >
          Powered by
        </span>
        <img
          src={process.env.PUBLIC_URL + "/cc.png"}
          alt="Campus Connection"
          style={{ height: "25px", width: "auto" }}
        />
      </div>
    </div>
  );
}

export default Layout;