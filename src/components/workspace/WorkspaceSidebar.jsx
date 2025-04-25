"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NavLink, useLocation, Link } from "react-router-dom"
import "../../styles/workspace/WorkspaceSidebar.css"

const WorkspaceSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const [activeSection, setActiveSection] = useState("home")
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false)

  const menuItems = [
    { id: "home", label: "Home", icon: "home", path: "/workspace" },
    { id: "projects", label: "Projects", icon: "folder", path: "/workspace/projects" },
    { id: "settings", label: "Settings", icon: "cog", path: "/workspace/settings" },
    { id: "members", label: "Members", icon: "users", path: "/workspace/members" },
    { id: "billing", label: "Billing", icon: "credit-card", path: "/workspace/billing" },
    { id: "integrations", label: "Integrations", icon: "plug", path: "/workspace/integrations" },
  ]

  const toggleWorkspaceDropdown = () => {
    setWorkspaceDropdownOpen(!workspaceDropdownOpen)
  }

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  }

  const overlayVariants = {
    open: {
      opacity: 0.5,
      display: "block",
    },
    closed: {
      opacity: 0,
      transitionEnd: {
        display: "none",
      },
    },
  }

  return (
    <>
      <motion.div
        className="workspace-sidebar-overlay"
        variants={overlayVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        onClick={toggleSidebar}
      />

      <motion.div
        className="workspace-sidebar"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="workspace-sidebar-header">
          <Link to="/" className="workspace-logo">
            <div className="workspace-logo-icon">T</div>
            <span className="workspace-logo-text">Translatea2z</span>
          </Link>
          <button className="close-workspace-sidebar" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="workspace-selector" onClick={toggleWorkspaceDropdown}>
          <div className="current-workspace">
            <span className="workspace-icon">P</span>
            <div className="workspace-info">
              <span className="workspace-name">Personal</span>
              <span className="workspace-type">Team Workspace</span>
            </div>
          </div>
          <motion.div animate={{ rotate: workspaceDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <i className="fas fa-chevron-down"></i>
          </motion.div>
        </div>

        <AnimatePresence>
          {workspaceDropdownOpen && (
            <motion.div
              className="workspace-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="dropdown-header">Workspaces</div>
              <div className="workspace-item active">
                <span className="workspace-item-icon">P</span>
                <span className="workspace-item-name">Personal</span>
                <i className="fas fa-check"></i>
              </div>
              <div className="workspace-item new">
                <span className="workspace-item-icon">+</span>
                <span className="workspace-item-name">Create Workspace</span>
                <span className="keyboard-shortcut">w</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="workspace-sidebar-label">Workspace</div>

        <nav className="workspace-sidebar-nav">
          <ul>
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                  end={item.id === "home"}
                >
                  <i className={`fas fa-${item.icon}`}></i>
                  <span>{item.label}</span>
                  {item.id === "integrations" && <span className="badge">1</span>}
                  {item.isActive && (
                    <motion.div
                      className="active-indicator"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="workspace-sidebar-footer">
          <div className="current-plan">
            <div className="plan-icon">
              <i className="fas fa-crown"></i>
            </div>
            <div className="plan-info">
              <span className="plan-label">Current Plan:</span>
              <span className="plan-name">Free</span>
            </div>
            <i className="fas fa-external-link-alt"></i>
          </div>
        </div>
      </motion.div>

      <button className="workspace-sidebar-toggle visible" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
    </>
  )
}

export default WorkspaceSidebar
