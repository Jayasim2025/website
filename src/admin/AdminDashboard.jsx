"use client"

import { motion } from "framer-motion"
import { Users, FileText, Globe, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import "../styles/admin/AdminDashboard.css"

const AdminDashboard = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  // Stats data
  const stats = [
    {
      title: "Total Users",
      value: "1,254",
      icon: <Users size={24} />,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
    },
    {
      title: "Translations",
      value: "8,721",
      icon: <FileText size={24} />,
      color: "from-purple-500 to-purple-600",
      change: "+18%",
    },
    {
      title: "Languages",
      value: "125",
      icon: <Globe size={24} />,
      color: "from-green-500 to-green-600",
      change: "+3",
    },
    {
      title: "Revenue",
      value: "$12,845",
      icon: <DollarSign size={24} />,
      color: "from-yellow-500 to-yellow-600",
      change: "+22%",
    },
  ]

  // Recent activities
  const activities = [
    {
      user: "John Doe",
      action: "signed up for Premium plan",
      time: "2 hours ago",
      icon: <DollarSign size={16} />,
      iconBg: "bg-green-100 text-green-600",
    },
    {
      user: "Sarah Smith",
      action: "translated 5 documents",
      time: "4 hours ago",
      icon: <FileText size={16} />,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      user: "Mike Johnson",
      action: "reported a bug in Spanish translation",
      time: "6 hours ago",
      icon: <AlertCircle size={16} />,
      iconBg: "bg-red-100 text-red-600",
    },
    {
      user: "Emily Chen",
      action: "completed profile setup",
      time: "8 hours ago",
      icon: <CheckCircle size={16} />,
      iconBg: "bg-purple-100 text-purple-600",
    },
  ]

  // Translation activity data for the chart
  const translationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [1200, 1900, 3000, 5000, 4000, 6500],
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="last-updated">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants} className="stat-card">
            <div className="stat-header">
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className="stat-change">{stat.change}</span>
              </div>
              <div className="stat-icon">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="dashboard-grid">
        {/* Chart Section */}
        <motion.div variants={itemVariants} className="chart-section">
          <h2>Translation Activity</h2>
          <div className="chart-content">
            <div className="bar-chart">
              {translationData.values.map((value, index) => (
                <div key={index} className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{ height: `${(value / Math.max(...translationData.values)) * 100}%` }}
                  ></div>
                  <div className="chart-label">{translationData.labels[index]}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.iconBg}`}>{activity.icon}</div>
                <div className="activity-details">
                  <p className="activity-text">
                    <span className="activity-user">{activity.user}</span> {activity.action}
                  </p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all-button">View All Activity</button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          {[
            { label: "Add User", icon: <Users size={20} />, color: "blue" },
            { label: "New Language", icon: <Globe size={20} />, color: "green" },
            { label: "Update Content", icon: <FileText size={20} />, color: "purple" },
            { label: "View Reports", icon: <TrendingUp size={20} />, color: "yellow" },
          ].map((action, index) => (
            <button key={index} className={`action-button ${action.color}`}>
              <div className="action-icon">{action.icon}</div>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
