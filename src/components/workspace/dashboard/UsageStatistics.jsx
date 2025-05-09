"use client"

import { motion } from "framer-motion"

const UsageStatistics = ({ itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="usage-stats">
      <h2>Usage Statistics</h2>
      <div className="usage-items">
        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">Storage</span>
            <span className="usage-value">2.4 GB / 10 GB</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "24%" }}></div>
          </div>
        </div>

        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">Processing Time</span>
            <span className="usage-value">1.2 hrs / 5 hrs</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "24%" }}></div>
          </div>
        </div>

        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">Translations</span>
            <span className="usage-value">24 / 100</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "24%" }}></div>
          </div>
        </div>
      </div>

      <div className="plan-details">
        <h3>Plan Details</h3>
        <p>Premium Plan - Monthly</p>
        <p>Renews on May 15, 2025</p>
        <button className="upgrade-button">Upgrade Plan</button>
      </div>
    </motion.div>
  )
}

export default UsageStatistics
