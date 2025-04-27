"use client"

import { motion } from "framer-motion"

const QuickActions = ({ actions, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="quick-actions-section">
      <h2>Quick Actions</h2>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <button key={index} className={`action-button ${action.color.split("-")[1]}`}>
            <div className="action-icon">{action.icon}</div>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export default QuickActions
