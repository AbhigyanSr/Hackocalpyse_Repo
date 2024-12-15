import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Layout({ user, children }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="terminal-layout">
      <nav className="terminal-nav">
        <div className="nav-header">
          <div className="terminal-title">VAULT-NET TERMINAL</div>
          {user && (
            <div className="user-info">
              LOGGED IN AS: {user.username ? user.username : user.email}
            </div>
          )}
        </div>

        {user && (
          <div className="nav-links">
            <div>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                [DASHBOARD]
              </NavLink>
              <NavLink
                to="/trade"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                [TRADE]
              </NavLink>
              <NavLink
                to="/survival"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                [SURVIVAL]
              </NavLink>
            </div>
            <button 
              className="nav-link logout" 
              onClick={handleLogout}
            >
              [LOGOUT]
            </button>
          </div>
        )}
      </nav>

      <main className="terminal-main">{children}</main>
    </div>
  );
}

export default Layout; 