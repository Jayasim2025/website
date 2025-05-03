"use client"

import { NavLink, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "../styles/admin/AdminSidebar.css"

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleNavClick = (path) => {
    if (isMobile) {
      // Close sidebar on mobile when a navigation item is clicked
      setIsOpen(false)

      // Small delay to allow the sidebar animation to start before navigating
      setTimeout(() => {
        navigate(path)
      }, 50)
    }
  }

  const navItems = [
    { to: "/admin/dashboard", icon: "fas fa-home", label: "Dashboard" },
    { to: "/admin/users", icon: "fas fa-users", label: "Users" },
    { to: "/admin/translations", icon: "fas fa-language", label: "Translations" },
    { to: "/admin/content", icon: "fas fa-file-alt", label: "Content" },
    { to: "/admin/languages", icon: "fas fa-globe", label: "Languages" },
    { to: "/admin/pricing", icon: "fas fa-tag", label: "Pricing Plans" },
    { to: "/admin/analytics", icon: "fas fa-chart-bar", label: "Analytics" },
    { to: "/admin/feedback", icon: "fas fa-comment", label: "Feedback" },
    { to: "/admin/settings", icon: "fas fa-cog", label: "Settings" },
    { to: "/admin/help", icon: "fas fa-question-circle", label: "Help & Support" },
  ]

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            onClick={() => handleNavClick(item.to)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div className="admin-info">
            <p className="admin-name">Admin User</p>
            <p className="admin-role">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
