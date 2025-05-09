"use client"

import { useState, useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Loader from "./components/Loader"
import router from "./router"
import "./App.css"

function App() {
  const [theme, setTheme] = useState("dark")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Enhanced theme toggle with animation preparation
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  // Initialize theme from localStorage and set mounted state
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") || "dark"
      setTheme(savedTheme)
      document.documentElement.setAttribute("data-theme", savedTheme)
      setMounted(true)

      // Simulate loading for initial animation
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [])

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          className="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RouterProvider router={router} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
