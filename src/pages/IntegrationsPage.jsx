"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import LoginModal from "../components/LoginModal"
import BackgroundScene from "../components/BackgroundScene"
import Integrations from "../components/Integrations"
import "../styles/IntegrationsPage.css"

function IntegrationsPage({ theme, toggleTheme }) {
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
        <div className="integrations-page">
          <div className="container">
            <motion.div
              className="integrations-page-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="gradient-text">Integrations</h1>
              <p>Connect Translatea2z with your favorite tools and platforms</p>
            </motion.div>

            <Integrations />
          </div>
        </div>
        <Footer />
      </main>

      <AnimatePresence>{showLoginModal && <LoginModal onClose={toggleLoginModal} key="login-modal" />}</AnimatePresence>
    </>
  )
}

export default IntegrationsPage
