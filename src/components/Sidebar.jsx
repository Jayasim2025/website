"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/Sidebar.css"

const Sidebar = ({ theme, toggleTheme, isOpen, toggleSidebar, toggleLoginModal }) => {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    // Set the active section based on the current pathname
    const pathname = window.location.pathname

    if (pathname === "/") {
      setActiveSection("home")
    } else if (pathname === "/integrations") {
      setActiveSection("integrations")
    } else if (pathname === "/pricing") {
      setActiveSection("pricing")
    }

    // Check if there's a hash in the URL when on homepage
    if (pathname === "/" && window.location.hash) {
      const hash = window.location.hash.substring(1) // Remove the # character
      setActiveSection(hash)
    }
  }, [window.location.pathname, window.location.hash])

  const menuItems = [
    { id: "home", label: "Home", icon: "home", path: "/" },
    { id: "how-it-works", label: "How It Works", icon: "info-circle", path: "/#how-it-works" },
    { id: "features", label: "Features", icon: "bolt", path: "/#features" },
    { id: "testimonials", label: "Testimonials", icon: "comment", path: "/#testimonials" },
    { id: "integrations", label: "Integrations", icon: "plug", path: "/integrations" },
    { id: "pricing", label: "Pricing", icon: "tag", path: "/pricing" },
    { id: "faq", label: "FAQ", icon: "question-circle", path: "/#faq" },
    { id: "contact", label: "Contact", icon: "envelope", path: "/#contact" },
  ]

  function handleNavigation(item) {
    // Check if the URL matches the path
    // Remove any hash from current path for comparison
    const currentPath = window.location.pathname

    // Set active based on current path matching menu item path
    if (item.path === "/" && currentPath === "/") {
      setActiveSection("home")
    } else if (item.path === "/integrations" && currentPath === "/integrations") {
      setActiveSection("integrations")
    } else if (item.path === "/pricing" && currentPath === "/pricing") {
      setActiveSection("pricing")
    } else if (item.path.includes("#") && currentPath === "/") {
      const sectionId = item.path.split("#")[1]
      setActiveSection(sectionId)
    }

    // Handle navigation
    if (item.path.startsWith("/#")) {
      const sectionId = item.path.substring(2)
      const section = document.getElementById(sectionId)
      if (section && window.location.pathname === "/") {
        section.scrollIntoView({ behavior: "smooth" })
      } else {
        // Navigate to homepage first, then scroll after a delay
        window.location.href = item.path
      }
    }

    if (window.innerWidth < 768) {
      toggleSidebar()
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
                  <Link
                    to={item.path}
                    className={activeSection === item.id ? "active" : ""}
                    onClick={() => handleNavigation(item)}
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
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className="theme-toggle-wrapper">
              <div className="theme-toggle-icon">
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
              </div>
              <span className="theme-toggle-text">{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
            </div>
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
