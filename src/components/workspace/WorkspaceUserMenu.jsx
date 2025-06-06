"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/WorkspaceUserMenu.css"

const WorkspaceUserMenu = ({ closeUserMenu, theme, toggleTheme }) => {
  const navigate = useNavigate()

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeUserMenu()
    }
  }

  const navigateToDashboard = () => {
    navigate("/workspace/dashboard")
    closeUserMenu()
  }

  return (
    <motion.div className="user-menu-backdrop" onClick={handleBackdropClick}>
      <motion.div
        className="user-menu"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="user-menu-header">
          <div className="user-menu-profile">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
              alt="User profile"
              className="user-menu-avatar"
            />
            <div className="user-menu-info">
              <span className="user-menu-name">Lithin</span>
              <span className="user-menu-email">lithins147@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="user-menu-items">
          <button className="user-menu-item" onClick={navigateToDashboard}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </button>
          <button className="user-menu-item" onClick={() => { navigate("/workspace/user-dashboard"); closeUserMenu(); }}>
            <i className="fas fa-chart-bar"></i>
            <span>User Dashboard</span>
          </button>
          <a href="#" className="user-menu-item">
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </a>
          <button className="user-menu-item" onClick={() => { navigate("/workspace/user-settings"); closeUserMenu(); }}>
            <i className="fas fa-cog"></i>
            <span>Account Settings</span>
          </button>
          <a href="#" className="user-menu-item">
            <i className="fas fa-shield-alt"></i>
            <span>Security Settings</span>
          </a>
          <a href="#" className="user-menu-item">
            <i className="fas fa-code"></i>
            <span>Developer Settings</span>
          </a>
          <a href="#" className="user-menu-item logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Log out</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WorkspaceUserMenu
