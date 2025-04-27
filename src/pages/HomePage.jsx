"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import Sidebar from "../components/Sidebar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import Testimonials from "../components/Testimonials"
import Pricing from "../components/Pricing"
import CallToAction from "../components/CallToAction"
import Footer from "../components/Footer"
import LoginModal from "../components/LoginModal"
import FAQ from "../components/FAQ"
import HowItWorks from "../components/HowItWorks"
import BackgroundScene from "../components/BackgroundScene"
import Integrations from "../components/Integrations"

function HomePage({ theme, toggleTheme }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

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
        <Integrations />
        <Pricing />
        <FAQ />
        <CallToAction />
        <Footer />
      </main>

      <AnimatePresence>{showLoginModal && <LoginModal onClose={toggleLoginModal} key="login-modal" />}</AnimatePresence>
    </>
  )
}

export default HomePage
