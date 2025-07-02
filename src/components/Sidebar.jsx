"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "../styles/Sidebar.css"

const Sidebar = ({ isOpen, toggleSidebar, toggleLoginModal }) => {
  const [activeSection, setActiveSection] = useState("home")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Set the active section based on the current pathname
    const pathname = window.location.pathname
    const hash = window.location.hash.substring(1) || ""

    if (pathname === "/") {
      setActiveSection(hash || "home")
    } else if (pathname === "/integrations") {
      setActiveSection("integrations")
    } else if (pathname === "/pricing") {
      setActiveSection("pricing")
    } else if (pathname === "/faq") {
      setActiveSection("faq")
    }
  }, [location])

  const menuItems = [
    { id: "home", label: "Home", icon: "home", path: "/" },
    { id: "how-it-works", label: "How It Works", icon: "info-circle", path: "/#how-it-works" },
    { id: "features", label: "Features", icon: "bolt", path: "/#features" },
    { id: "testimonials", label: "Testimonials", icon: "comment", path: "/#testimonials" },
    { id: "integrations", label: "Integrations", icon: "plug", path: "/integrations" },
    { id: "pricing", label: "Pricing", icon: "tag", path: "/pricing" },
    { id: "faq", label: "FAQ", icon: "question-circle", path: "/faq" },
    { id: "contact", label: "Contact", icon: "envelope", path: "/#contact" },
    { id: "admin", label: "Admin", icon: "shield-alt", path: "/admin-login" },
  ]

  function handleNavigation(item) {
    if (window.innerWidth < 768) {
      toggleSidebar()
    }

    // Handle "Home" navigation specifically
    if (item.id === "home") {
      setActiveSection("home")

      if (location.pathname === "/") {
        // Already on home page, scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        // Navigate to home page
        navigate("/")
      }
      return
    }

    // Handle "Admin" navigation specifically
    if (item.id === "admin") {
      setActiveSection("admin")
      navigate("/admin-login")
      return
    }

    // Check if it's a hash link on the home page
    if (item.path.includes("#")) {
      const sectionId = item.path.split("#")[1]
      setActiveSection(sectionId)

      if (location.pathname === "/") {
        // Already on home page, just scroll to the section
        const section = document.getElementById(sectionId)
        if (section) {
          section.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // Navigate to home page with the hash
        navigate("/", { state: { scrollToSection: sectionId } })
      }
    } else {
      // Regular page navigation
      setActiveSection(item.id)
      navigate(item.path)
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="sidebar-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

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
                  <a
                    href={item.path}
                    className={activeSection === item.id ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(item)
                    }}
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
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.div>

      {/* Only show this button when sidebar is closed and on mobile */}
      {!isOpen && (
        <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
          <i className="fas fa-bars"></i>
        </button>
      )}
    </>
  )
}

export default Sidebar
