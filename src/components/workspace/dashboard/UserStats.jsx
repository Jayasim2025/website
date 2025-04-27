"use client"

import { motion } from "framer-motion"

const UserStats = ({ stats, itemVariants }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <motion.div key={index} variants={itemVariants} className="stat-card">
          <div className="stat-header">
            <div className="stat-icon">{stat.icon}</div>
          </div>
          <div className="stat-content">
            <p className="stat-title">{stat.title}</p>
            <h3 className="stat-value">{stat.value}</h3>
            <span className="stat-change">+12% from last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default UserStats
