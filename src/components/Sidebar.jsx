"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import "../styles/Sidebar.css"

const Sidebar = ({ theme, toggleTheme, isOpen, toggleSidebar, toggleLoginModal }) => {
  const [activeSection, setActiveSection] = useState("home")

  const menuItems = [
    { id: "home", label: "Home", icon: "home" },
    { id: "how-it-works", label: "How It Works", icon: "info-circle" },
    { id: "features", label: "Features", icon: "bolt" },
    { id: "testimonials", label: "Testimonials", icon: "comment" },
    { id: "integrations", label: "Integrations", icon: "plug" },
    { id: "pricing", label: "Pricing", icon: "tag" },
    { id: "faq", label: "FAQ", icon: "question-circle" },
    { id: "contact", label: "Contact", icon: "envelope" },
  ]

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
      if (window.innerWidth < 768) {
        toggleSidebar()
      }
    }
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
        className="sidebar-overlay"
        variants={overlayVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        onClick={toggleSidebar}
      />

      <motion.div className="sidebar" variants={sidebarVariants} initial="closed" animate={isOpen ? "open" : "closed"}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">T</div>
            <span className="logo-text">Translatea2z</span>
          </div>
          <button className="close-sidebar" onClick={toggleSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={activeSection === item.id ? "active" : ""}
                    onClick={() => scrollToSection(item.id)}
                  >
                    <i className={`fas fa-${item.icon}`}></i>
                    <span>{item.label}</span>
                    {activeSection === item.id && (
                      <motion.div
                        className="active-indicator"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -30 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 30 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "light" ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
              </motion.div>
            </AnimatePresence>
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>

          <button className="login-button" onClick={toggleLoginModal}>
            <i className="fas fa-user"></i>
            <span>Log In</span>
          </button>
        </div>
      </motion.div>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>
    </>
  )
}

export default Sidebar
