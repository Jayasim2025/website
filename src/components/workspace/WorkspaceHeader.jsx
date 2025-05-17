"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/WorkspaceHeader.css"

const WorkspaceHeader = ({ toggleSidebar, toggleUserMenu, theme, toggleTheme, title }) => {
  const navigate = useNavigate()

  // Format title to be more readable
  const formatTitle = (title) => {
    if (!title) return "Dashboard"
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  return (
    <header className="workspace-header">
      <div className="workspace-header-left">
        <div className="workspace-title">
          <i className="fas fa-file-alt"></i>
          <h1>{formatTitle(title)}</h1>
        </div>
      </div>

      <div className="workspace-header-right">
        <motion.button
          className="theme-toggle-button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === "light" ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
        </motion.button>

        <motion.button className="notification-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <i className="fas fa-bell"></i>
        </motion.button>

        <motion.div
          className="user-profile"
          onClick={toggleUserMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
            alt="User profile"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="user-name">Lithin</span>
            <span className="user-email">lithins147@gmail.com</span>
          </div>
          <i className="fas fa-chevron-down"></i>
        </motion.div>
      </div>
    </header>
  )
}

export default WorkspaceHeader
