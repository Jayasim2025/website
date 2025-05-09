"use client"

import { motion } from "framer-motion"
import "../../styles/workspace/Billing.css"

const Billing = () => {
  // Sample plan data
  const plans = [
    {
      id: "premium",
      name: "Supertranslate Premium",
      price: "$20.00/month",
      features: [
        "Up to 20 hours of speech processing",
        "20 GB storage limit per month",
        "Transcription in 125 languages",
        "Translation in 125 languages",
        "Up to 2 translations per media project",
        "Advanced subtitle editor with batch processing",
      ],
    },
    {
      id: "super",
      name: "Supertranslate Super",
      price: "$60.00/month",
      features: [
        "Up to 50 hours of speech processing",
        "50 GB storage limit per month",
        "Transcription in 125 languages",
        "Translation in 125 languages",
        "Up to 10 translations per media project",
        "Advanced subtitle editor with batch processing",
      ],
    },
    {
      id: "business",
      name: "Supertranslate Business",
      price: "$200.00/month",
      features: [
        "Up to 200 hours of speech processing",
        "200 GB storage limit per month",
        "Transcription in 125 languages",
        "Translation in 125 languages",
        "Unlimited translations per media project",
        "Advanced subtitle editor with batch processing",
        "Priority support",
        "Custom integrations",
      ],
    },
  ]

  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1>Workspace Billing</h1>
        <p>Manage your subscriptions and payments</p>
      </div>

      <div className="plan-selection">
        <div className="plan-header">
          <i className="fas fa-box"></i>
          <h2>Choose Your Plan</h2>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div className="plan-card" key={plan.id}>
              <h3>{plan.name}</h3>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-features">
                <h4>Features</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <motion.button className="upgrade-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Upgrade
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      <div className="current-plan">
        <h2>Current Plan: Free</h2>
        <div className="plan-details">
          <div className="plan-detail">
            <i className="fas fa-clock"></i>
            <div className="detail-info">
              <span className="detail-label">Processing Time</span>
              <span className="detail-value">0/200 MB used</span>
            </div>
          </div>
          <div className="plan-detail">
            <i className="fas fa-hdd"></i>
            <div className="detail-info">
              <span className="detail-label">Storage</span>
              <span className="detail-value">0/500 MB used</span>
            </div>
          </div>
          <div className="plan-detail">
            <i className="fas fa-users"></i>
            <div className="detail-info">
              <span className="detail-label">Team Members</span>
              <span className="detail-value">1/1 used</span>
            </div>
          </div>
        </div>
      </div>

      <div className="billing-history">
        <h2>Billing History</h2>
        <div className="empty-history">
          <div className="empty-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <p>No billing history available</p>
        </div>
      </div>
    </div>
  )
}

export default Billing
