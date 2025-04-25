"use client"

import { useState, useEffect, Suspense } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./components/Sidebar"
import Hero from "./components/Hero"
import Features from "./components/Features"
import Testimonials from "./components/Testimonials"
import Pricing from "./components/Pricing"
import CallToAction from "./components/CallToAction"
import Footer from "./components/Footer"
import Loader from "./components/Loader"
import LoginModal from "./components/LoginModal"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import BackgroundScene from "./components/BackgroundScene"
import "./App.css"

function App() {
  const [theme, setTheme] = useState("dark")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
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
          <div className="background-container">
            <Canvas className="background-canvas">
              <Suspense fallback={null}>
                <BackgroundScene />
                <Environment preset="city" />
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
              </Suspense>
            </Canvas>
          </div>

          <Sidebar
            theme={theme}
            toggleTheme={toggleTheme}
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            toggleLoginModal={toggleLoginModal}
          />

          <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
            <Hero toggleLoginModal={toggleLoginModal} />
            <Features />
            <Testimonials />
            <Pricing />
            <CallToAction />
            <Footer />
          </main>

          <AnimatePresence>
            {showLoginModal && <LoginModal onClose={toggleLoginModal} key="login-modal" />}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App
