"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Navbar.css"

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
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

  return (
    <>
      {/* Logo positioned at top left */}
      <motion.div
        className={`navbar-logo-container ${isSidebarOpen ? "hidden" : ""}`}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.a href="/" className="logo-link" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <motion.div className="logo-icon" whileHover={{ rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
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
      </motion.div>

      {/* Sleek Floating Navigation - Top Right */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.nav
            className={`floating-nav ${scrolled ? "scrolled" : ""}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="floating-nav-container">
              <Link to="/" className="nav-link">
                <span>Home</span>
              </Link>
              <Link to="/pricing" className="nav-link">
                <span>Pricing</span>
              </Link>
              <a href="#contact" className="nav-link" onClick={handleContactClick}>
                <span>Contact Us</span>
              </a>
              <motion.button
                className="login-button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.dispatchEvent(new CustomEvent("open-login-modal"))}
              >
                <span>Log In</span>
                <motion.i
                  className="fas fa-arrow-right"
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                />
              </motion.button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Bottom Sidebar Toggle */}
      <motion.button
        className={`bottom-sidebar-toggle ${isSidebarOpen ? "hidden" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <motion.i
          className="fas fa-bars"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.button>
    </>
  )
}

export default Navbar
