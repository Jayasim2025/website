"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../styles/Navbar.css"

const Navbar = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false)

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

  return (
    <motion.header
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-container">
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

          <motion.a
            href="/login"
            className="login-button"
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
            <img src="https://cdn-icons-png.flaticon.com/512/2989/2989988.png" alt="Login" width="20" height="20" />
          </motion.a>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
