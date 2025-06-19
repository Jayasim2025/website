"use client"

import { motion } from "framer-motion"
import "../../styles/workspace/Billing.css"
import { useCreditSystem } from "./CreditSystem"

const Billing = () => {
  const { currentPlan, credits, planInfo, allPlans, upgradePlan } = useCreditSystem()

  const handleUpgrade = (planType) => {
    upgradePlan(planType)
  }

  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1>Workspace Billing</h1>
        <p>Manage your subscriptions and credits</p>
      </div>

      <div className="current-plan">
        <h2>Current Plan: {planInfo.name}</h2>
        <div className="plan-details">
          <div className="plan-detail">
            <i className="fas fa-coins"></i>
            <div className="detail-info">
              <span className="detail-label">Available Credits</span>
              <span className="detail-value">{credits.toLocaleString()}</span>
            </div>
          </div>
          <div className="plan-detail">
            <i className="fas fa-calendar"></i>
            <div className="detail-info">
              <span className="detail-label">Monthly Allowance</span>
              <span className="detail-value">{planInfo.monthlyCredits.toLocaleString()}</span>
            </div>
          </div>
          <div className="plan-detail">
            <i className="fas fa-video"></i>
            <div className="detail-info">
              <span className="detail-label">Video Processing</span>
              <span className="detail-value">{planInfo.processingCost.video} credits/min</span>
            </div>
          </div>
          <div className="plan-detail">
            <i className="fas fa-music"></i>
            <div className="detail-info">
              <span className="detail-label">Audio Processing</span>
              <span className="detail-value">{planInfo.processingCost.audio} credits/min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="plans-section">
        <h2>Available Plans</h2>
        <div className="plans-grid">
          {Object.entries(allPlans).map(([planKey, plan]) => (
            <motion.div
              key={planKey}
              className={`plan-card ${currentPlan === planKey ? "current" : ""}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="plan-header">
                <h3>{plan.name}</h3>
                {currentPlan === planKey && <span className="current-badge">Current Plan</span>}
              </div>

              <div className="plan-credits">
                <span className="credits-amount">{plan.monthlyCredits.toLocaleString()}</span>
                <span className="credits-label">credits/month</span>
              </div>

              <div className="plan-features">
                <div className="feature">
                  <i className="fas fa-video"></i>
                  <span>Video: {plan.processingCost.video} credits/min</span>
                </div>
                <div className="feature">
                  <i className="fas fa-music"></i>
                  <span>Audio: {plan.processingCost.audio} credits/min</span>
                </div>
                <div className="feature">
                  <i className="fas fa-language"></i>
                  <span>All languages supported</span>
                </div>
                <div className="feature">
                  <i className="fas fa-download"></i>
                  <span>Export in multiple formats</span>
                </div>
              </div>

              <div className="plan-pricing">
                {planKey === "free" ? (
                  <span className="price">Free</span>
                ) : (
                  <span className="price">
                    ${planKey === "pro" ? "20" : planKey === "super" ? "60" : "200"}
                    <span className="period">/month</span>
                  </span>
                )}
              </div>

              {currentPlan !== planKey && (
                <button className="upgrade-button" onClick={() => handleUpgrade(planKey)}>
                  {planKey === "free" ? "Downgrade" : "Upgrade"}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Billing
