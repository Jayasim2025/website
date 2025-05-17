"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import WorkspaceSidebar from "./WorkspaceSidebar"
import WorkspaceHeader from "./WorkspaceHeader"
import WorkspaceUserMenu from "./WorkspaceUserMenu"
import "../../styles/workspace/WorkspaceLayout.css"

const WorkspaceLayout = ({ theme, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const closeUserMenu = () => {
    setUserMenuOpen(false)
  }

  // Get the title from the path
  const getTitle = () => {
    const path = location.pathname.split("/").pop() || "home"
    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <div className="workspace-layout" onClick={(e) => e.stopPropagation()}>
      <WorkspaceSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`workspace-main ${sidebarOpen && !isMobile ? "sidebar-open" : ""}`}>
        <WorkspaceHeader
          toggleSidebar={toggleSidebar}
          toggleUserMenu={toggleUserMenu}
          theme={theme}
          toggleTheme={toggleTheme}
          title={getTitle()}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="workspace-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {userMenuOpen && <WorkspaceUserMenu closeUserMenu={closeUserMenu} theme={theme} toggleTheme={toggleTheme} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WorkspaceLayout
