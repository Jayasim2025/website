"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

const Navbar = ({ theme, toggleTheme, toggleSidebar, isSidebarOpen }) => {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  const handleContactClick = (e) => {
    e.preventDefault()

    // If we're on the home page, scroll to the contact section
    if (window.location.pathname === "/") {
      const contactSection = document.getElementById("contact")
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      // If we're on another page, navigate to home and then scroll
      navigate("/", { state: { scrollToSection: "contact" } })
    }
  }

  // If sidebar is open, only render the toggle button
  if (isSidebarOpen) {
    return (
      <div className="sidebar-toggle-container">
        <button className="sidebar-toggle visible" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <i className="fas fa-bars"></i>
        </button>
      </div>
    )
  }

  return (
    <motion.header
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <i className="fas fa-bars"></i>
          </button>

          <motion.a href="/" className="logo-link" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <motion.div
              className="logo-icon"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              T
            </motion.div>
            <motion.span
              className="logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Translatea2z
            </motion.span>
          </motion.a>
        </div>

        <div className="navbar-right">
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/pricing" className="nav-link">
              Pricing
            </Link>
            <a href="#contact" className="nav-link" onClick={handleContactClick}>
              Contact Us
            </a>
          </div>

          <div className="nav-actions">
            <motion.button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "light" ? (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/702/702471.png"
                      alt="Dark mode"
                      width="24"
                      height="24"
                    />
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3073/3073665.png"
                      alt="Light mode"
                      width="24"
                      height="24"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            <motion.button
              className="login-button"
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.dispatchEvent(new CustomEvent("open-login-modal"))}
            >
              Log In
              <i className="fas fa-chevron-right"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
