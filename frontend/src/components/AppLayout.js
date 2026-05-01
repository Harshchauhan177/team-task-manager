import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AppLayout.css";

const AppLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <button
          type="button"
          className="app-brand"
          onClick={() => navigate("/dashboard")}
          aria-label="Go to dashboard"
        >
          <span className="app-logo" aria-hidden>
            ✓
          </span>
          <span className="app-title">Team Task Manager</span>
        </button>

        <nav className="app-nav" aria-label="Main">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link${isActive ? " nav-link--active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `nav-link${isActive ? " nav-link--active" : ""}`
            }
          >
            Projects
          </NavLink>
        </nav>

        <div className="app-user-area">
          <div className="user-chip" title={user.email || ""}>
            <span className="user-avatar" aria-hidden>
              {(user.name || user.email || "?").charAt(0).toUpperCase()}
            </span>
            <span className="user-meta">
              <span className="user-name">{user.name || "User"}</span>
              {user.email && (
                <span className="user-email">{user.email}</span>
              )}
            </span>
          </div>
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </header>

      <main className="app-main" id="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
