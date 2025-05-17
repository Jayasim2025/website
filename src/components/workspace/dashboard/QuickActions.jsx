"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const QuickActions = ({ actions, itemVariants }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <motion.div variants={itemVariants} className="quick-actions-section">
      <h2>Quick Actions</h2>
      <div className={`quick-actions-grid ${isMobile ? "mobile-grid" : ""}`}>
        {actions.map((action, index) => {
          // Override colors to match the theme
          let buttonColor = "purple"
          if (action.color) {
            // Keep the original color name for the class but use our theme color
            buttonColor = action.color.split("-")[1]
          }

          return (
            <button key={index} className={`action-button ${buttonColor}`}>
              <div className="action-icon">{action.icon}</div>
              <span className="action-label">{action.label}</span>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

export default QuickActions
