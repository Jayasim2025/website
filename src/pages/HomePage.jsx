"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import CallToAction from "../components/CallToAction"
import Footer from "../components/Footer"
import LoginModal from "../components/LoginModal"
import HowItWorks from "../components/HowItWorks"
import BackgroundScene from "../components/BackgroundScene"
import Navbar from "../components/Navbar"

function HomePage({ theme, toggleTheme }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle scrolling to sections when navigating from other pages
  useEffect(() => {
    if (location.state?.scrollToSection) {
      const sectionId = location.state.scrollToSection
      const section = document.getElementById(sectionId)

      if (section) {
        // Small delay to ensure the page is fully loaded
        setTimeout(() => {
          section.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }

      // Clear the state to prevent scrolling on subsequent renders
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // Listen for custom event to open login modal
  useEffect(() => {
    const handleOpenLoginModal = () => {
      setShowLoginModal(true)
    }

    window.addEventListener("open-login-modal", handleOpenLoginModal)

    return () => {
      window.removeEventListener("open-login-modal", handleOpenLoginModal)
    }
  }, [])

  return (
    <>
      <div className="background-container">
        <Canvas className="background-canvas">
          <Suspense fallback={null}>
            <BackgroundScene />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Suspense>
        </Canvas>
      </div>

      {!sidebarOpen && (
        <Navbar theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
      )}

      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleLoginModal={toggleLoginModal}
      />

      <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Hero toggleLoginModal={toggleLoginModal} />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CallToAction />
        <Footer />
      </main>

      <AnimatePresence>{showLoginModal && <LoginModal onClose={toggleLoginModal} key="login-modal" />}</AnimatePresence>
    </>
  )
}

export default HomePage
