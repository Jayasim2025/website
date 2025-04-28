"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import { Suspense } from "react"
import { useLocation } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import LoginModal from "../components/LoginModal"
import BackgroundScene from "../components/BackgroundScene"
import "../styles/PricingPage.css"

function PricingPage({ theme, toggleTheme }) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pricingType, setPricingType] = useState("individual")
  const location = useLocation()

  useEffect(() => {
    // Check URL parameters for pricing type
    const params = new URLSearchParams(location.search)
    const type = params.get("type")
    if (type === "enterprise") {
      setPricingType("enterprise")
    } else if (type === "individual") {
      setPricingType("individual")
    }
  }, [location])

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const togglePricingType = () => {
    setPricingType(pricingType === "individual" ? "enterprise" : "individual")
  }

  // Individual pricing plans
  const individualPlans = [
    {
      id: 1,
      name: "Free",
      description: "For individuals and hobby projects",
      price: 0,
      billingCycle: "monthly",
      features: [
        { name: "Up to 200 MB of media processing", included: true },
        { name: "Transcription in 36 languages", included: true },
        { name: "Translation in 36 languages", included: true },
        { name: "Basic subtitle editor", included: true },
        { name: "Export in SRT & VTT formats", included: true },
        { name: "Email support", included: false },
        { name: "Glossary customization", included: false },
      ],
      popular: false,
    },
    {
      id: 2,
      name: "Pro",
      description: "For podcasters, content creators, and small teams",
      price: 20,
      billingCycle: "monthly",
      features: [
        { name: "Up to 20 hours of speech processing", included: true },
        { name: "20 GB storage limit per month", included: true },
        { name: "Transcription in 125 languages", included: true },
        { name: "Translation in 125 languages", included: true },
        { name: "Up to 2 translations per media project", included: true },
        { name: "Advanced subtitle editor with batch processing", included: true },
        { name: "Priority email support", included: true },
        { name: "Glossary customization", included: true },
      ],
      popular: true,
    },
    {
      id: 3,
      name: "Super",
      description: "For growing teams and agencies",
      price: 60,
      billingCycle: "monthly",
      features: [
        { name: "Up to 50 hours of speech processing", included: true },
        { name: "50 GB storage limit per month", included: true },
        { name: "Transcription in 125 languages", included: true },
        { name: "Translation in 125 languages", included: true },
        { name: "Up to 10 translations per media project", included: true },
        { name: "Advanced subtitle editor with batch processing", included: true },
        { name: "Priority email support", included: true },
        { name: "Glossary customization", included: true },
        { name: "API access", included: true },
      ],
      popular: false,
    },
  ]

  // Enterprise pricing plans
  const enterprisePlans = [
    {
      id: 4,
      name: "Business",
      description: "For power users and growing organizations",
      price: 200,
      billingCycle: "monthly",
      features: [
        { name: "Up to 200 hours of speech processing", included: true },
        { name: "200 GB storage limit per month", included: true },
        { name: "Transcription in 125 languages", included: true },
        { name: "Translation in 125 languages", included: true },
        { name: "Unlimited translations per media project", included: true },
        { name: "Advanced subtitle editor with batch processing", included: true },
        { name: "Priority support with dedicated account manager", included: true },
        { name: "Glossary customization", included: true },
        { name: "API access", included: true },
        { name: "Custom integrations", included: true },
      ],
      popular: true,
    },
    {
      id: 5,
      name: "Enterprise",
      description: "For media companies and broadcasters",
      price: "Custom",
      billingCycle: "",
      features: [
        { name: "Unlimited speech processing", included: true },
        { name: "Unlimited storage", included: true },
        { name: "Transcription in 125 languages", included: true },
        { name: "Translation in 125 languages", included: true },
        { name: "Unlimited translations per media project", included: true },
        { name: "Advanced subtitle editor with batch processing", included: true },
        { name: "24/7 priority support with dedicated account manager", included: true },
        { name: "Glossary customization", included: true },
        { name: "API access", included: true },
        { name: "Custom integrations", included: true },
        { name: "On-premise deployment option", included: true },
        { name: "Custom SLAs", included: true },
      ],
      popular: false,
    },
  ]

  const activePlans = pricingType === "individual" ? individualPlans : enterprisePlans

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
        <div className="pricing-page">
          <div className="container">
            <motion.div
              className="pricing-page-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="gradient-text">Pricing Plans</h1>
              <p>Choose the perfect plan for your needs</p>

              <div className="pricing-toggle-container">
                <span className={pricingType === "individual" ? "active" : ""}>Individual</span>
                <div className="pricing-toggle" onClick={togglePricingType}>
                  <div className={`toggle-handle ${pricingType === "enterprise" ? "enterprise" : ""}`}></div>
                </div>
                <span className={pricingType === "enterprise" ? "active" : ""}>Enterprise</span>
              </div>
            </motion.div>

            <div className="pricing-plans">
              {activePlans.map((plan, index) => (
                <motion.div
                  className={`pricing-plan ${plan.popular ? "popular" : ""}`}
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
                >
                  {plan.popular && <div className="popular-badge">Most Popular</div>}
                  <div className="plan-header">
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                  </div>
                  <div className="plan-price">
                    {typeof plan.price === "number" ? (
                      <>
                        <span className="currency">$</span>
                        <span className="amount">{plan.price}</span>
                        {plan.billingCycle && <span className="billing-cycle">/{plan.billingCycle}</span>}
                      </>
                    ) : (
                      <span className="amount">{plan.price}</span>
                    )}
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className={feature.included ? "included" : "excluded"}>
                        <i className={`fas ${feature.included ? "fa-check" : "fa-times"}`}></i>
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                  <button className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"}`}>
                    {plan.price === 0 ? "Get Started" : plan.price === "Custom" ? "Contact Sales" : "Subscribe Now"}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="pricing-faq">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-grid">
                <div className="faq-item">
                  <h3>Can I change plans later?</h3>
                  <p>
                    Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next
                    billing cycle.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Is there a free trial?</h3>
                  <p>Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
                </div>
                <div className="faq-item">
                  <h3>What payment methods do you accept?</h3>
                  <p>We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans.</p>
                </div>
                <div className="faq-item">
                  <h3>Can I cancel anytime?</h3>
                  <p>
                    Yes, you can cancel your subscription at any time. You'll continue to have access until the end of
                    your billing period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>

      <AnimatePresence>{showLoginModal && <LoginModal onClose={toggleLoginModal} key="login-modal" />}</AnimatePresence>
    </>
  )
}

export default PricingPage
