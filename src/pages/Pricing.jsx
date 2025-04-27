"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/admin/PricingPlans.css"

const Pricing = () => {
  const [activePlan, setActivePlan] = useState(null)

  // Sample pricing plans data
  const pricingPlans = [
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
      activeUsers: 1250,
      conversionRate: "N/A",
      status: "Active",
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
      activeUsers: 850,
      conversionRate: "15%",
      status: "Active",
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
      activeUsers: 420,
      conversionRate: "8%",
      status: "Active",
    },
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
      activeUsers: 180,
      conversionRate: "5%",
      status: "Active",
    },
    {
      id: 5,
      name: "Enterprise",
      description: "For media companies and broadcasters",
      price: 2000,
      billingCycle: "monthly",
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
      activeUsers: 45,
      conversionRate: "2%",
      status: "Active",
    },
  ]

  const handleEditPlan = (planId) => {
    setActivePlan(planId)
  }

  return (
    <div className="pricing-plans-container">
      <div className="pricing-plans-header">
        <h1>Pricing Plans Management</h1>
        <motion.button className="add-plan-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-plus"></i>
          <span>Add Plan</span>
        </motion.button>
      </div>

      <div className="pricing-plans-grid">
        {pricingPlans.map((plan) => (
          <motion.div
            className={`plan-card ${activePlan === plan.id ? "active" : ""}`}
            key={plan.id}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="plan-header">
              <div className="plan-title-section">
                <h3 className="plan-name">{plan.name}</h3>
                <span className={`plan-status ${plan.status.toLowerCase()}`}>{plan.status}</span>
              </div>
              <div className="plan-price">
                ${plan.price}
                <span className="plan-billing">/{plan.billingCycle}</span>
              </div>
            </div>

            <p className="plan-description">{plan.description}</p>

            <div className="plan-stats">
              <div className="stat-item">
                <span className="stat-label">Active Users</span>
                <span className="stat-value">{plan.activeUsers.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Conversion Rate</span>
                <span className="stat-value">{plan.conversionRate}</span>
              </div>
            </div>

            <div className="plan-features">
              <h4>Features</h4>
              <ul>
                {plan.features.slice(0, 5).map((feature, index) => (
                  <li key={index} className={feature.included ? "included" : "excluded"}>
                    <i className={`fas ${feature.included ? "fa-check" : "fa-times"}`}></i>
                    <span>{feature.name}</span>
                  </li>
                ))}
                {plan.features.length > 5 && (
                  <li className="more-features">
                    <span>+{plan.features.length - 5} more features</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="plan-actions">
              <button className="action-button edit" onClick={() => handleEditPlan(plan.id)}>
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
              <button className="action-button duplicate">
                <i className="fas fa-copy"></i>
                <span>Duplicate</span>
              </button>
              {plan.status === "Active" ? (
                <button className="action-button deactivate">
                  <i className="fas fa-toggle-off"></i>
                  <span>Deactivate</span>
                </button>
              ) : (
                <button className="action-button activate">
                  <i className="fas fa-toggle-on"></i>
                  <span>Activate</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {activePlan && (
        <div className="edit-plan-overlay">
          <div className="edit-plan-modal">
            <div className="modal-header">
              <h2>Edit Plan: {pricingPlans.find((plan) => plan.id === activePlan)?.name}</h2>
              <button className="close-modal" onClick={() => setActivePlan(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>Plan editing form would go here</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setActivePlan(null)}>
                Cancel
              </button>
              <button className="save-button">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pricing
