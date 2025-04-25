"use client"

import { useState, useEffect, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
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
import FAQ from "./components/FAQ"
import HowItWorks from "./components/HowItWorks"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import BackgroundScene from "./components/BackgroundScene"
import "./App.css"

import WorkspaceLayout from "./components/workspace/WorkspaceLayout"
import Dashboard from "./components/workspace/Dashboard"
import Projects from "./components/workspace/Projects"
import Settings from "./components/workspace/Settings"
import Members from "./components/workspace/Members"
import Billing from "./components/workspace/Billing"
import WorkspaceIntegrations from "./components/workspace/Integrations"
import Integrations from "./components/Integrations"

// Placeholder pages for footer links
const AboutPage = () => (
  <div className="placeholder-page">
    <h1>About Us</h1>
    <p>Coming soon...</p>
  </div>
)
const CareersPage = () => (
  <div className="placeholder-page">
    <h1>Careers</h1>
    <p>Coming soon...</p>
  </div>
)
const BlogPage = () => (
  <div className="placeholder-page">
    <h1>Blog</h1>
    <p>Coming soon...</p>
  </div>
)
const ContactPage = () => (
  <div className="placeholder-page">
    <h1>Contact</h1>
    <p>Coming soon...</p>
  </div>
)
const DocumentationPage = () => (
  <div className="placeholder-page">
    <h1>Documentation</h1>
    <p>Coming soon...</p>
  </div>
)
const ApiReferencePage = () => (
  <div className="placeholder-page">
    <h1>API Reference</h1>
    <p>Coming soon...</p>
  </div>
)
const CommunityPage = () => (
  <div className="placeholder-page">
    <h1>Community</h1>
    <p>Coming soon...</p>
  </div>
)
const SupportPage = () => (
  <div className="placeholder-page">
    <h1>Support</h1>
    <p>Coming soon...</p>
  </div>
)
const PrivacyPolicyPage = () => (
  <div className="placeholder-page">
    <h1>Privacy Policy</h1>
    <p>Coming soon...</p>
  </div>
)
const TermsOfServicePage = () => (
  <div className="placeholder-page">
    <h1>Terms of Service</h1>
    <p>Coming soon...</p>
  </div>
)
const CookiePolicyPage = () => (
  <div className="placeholder-page">
    <h1>Cookie Policy</h1>
    <p>Coming soon...</p>
  </div>
)
const GdprPage = () => (
  <div className="placeholder-page">
    <h1>GDPR</h1>
    <p>Coming soon...</p>
  </div>
)

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
    <Router>
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
            <Routes>
              <Route path="/" element={<HomePage theme={theme} toggleTheme={toggleTheme} />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/api-reference" element={<ApiReferencePage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/gdpr" element={<GdprPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/workspace" element={<WorkspaceLayout theme={theme} toggleTheme={toggleTheme} />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="settings" element={<Settings />} />
                <Route path="members" element={<Members />} />
                <Route path="billing" element={<Billing />} />
                <Route path="integrations" element={<WorkspaceIntegrations />} />
              </Route>
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  )
}

export default App
