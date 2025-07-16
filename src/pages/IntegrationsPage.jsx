"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Auth from "../components/Auth";
import BackgroundScene from "../components/BackgroundScene";
import Integrations from "../components/Integrations";
import "../styles/IntegrationsPage.css";

function IntegrationsPage({ theme, toggleTheme }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Listen for custom event to open login modal
    const handleOpenLoginModal = () => setShowLoginModal(true);
    window.addEventListener("open-login-modal", handleOpenLoginModal);

    return () => {
      window.removeEventListener("open-login-modal", handleOpenLoginModal);
    };
  }, []);

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <div className="background-container">
        <Canvas className="background-canvas">
          <Suspense fallback={null}>
            <BackgroundScene />
            <Environment preset="city" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Always render the Navbar, but conditionally hide it when sidebar is open */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />

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

      <AnimatePresence>
        {showLoginModal && <Auth onClose={toggleLoginModal} key="auth-modal" />}
      </AnimatePresence>
    </>
  );
}

export default IntegrationsPage;
