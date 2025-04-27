"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/admin/AdminHeader.css"

const AdminHeader = ({ theme, toggleTheme, toggleSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/session
    navigate("/admin-login")
  }

  return (
    <header className="admin-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>

        <div className="admin-logo">
          <div className="logo-icon">T</div>
          <span className="logo-text">Translatea2z Admin</span>
        </div>
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </button>

        <button className="notification-button">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </button>

        <div className="user-menu-container">
          <button className="user-menu-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <i className="fas fa-user"></i>
            <span>Admin</span>
            <i className="fas fa-chevron-down"></i>
          </button>

          {userMenuOpen && (
            <div className="user-dropdown">
              <div className="user-dropdown-header">
                <p className="user-name">Admin User</p>
                <p className="user-email">admin@translatea2z.com</p>
              </div>
              <div className="user-dropdown-items">
                <button className="user-dropdown-item" onClick={() => navigate("/admin/profile")}>
                  <i className="fas fa-user-circle"></i>
                  Profile
                </button>
                <button className="user-dropdown-item" onClick={() => navigate("/admin/settings")}>
                  <i className="fas fa-cog"></i>
                  Settings
                </button>
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
