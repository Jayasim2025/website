"use client"

import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"
import "../styles/admin/AdminLayout.css"

const AdminLayout = ({ theme, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className={`admin-layout ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
      <div className="background-canvas">{/* This will be replaced by the 3D background */}</div>

      <AdminHeader theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />

      <div className="admin-container">
        <AdminSidebar isOpen={sidebarOpen} />

        <main className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="admin-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
