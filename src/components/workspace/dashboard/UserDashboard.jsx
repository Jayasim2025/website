"use client"

import { motion } from "framer-motion"
import { FileText, Clock, Calendar, BarChart2, Upload, Zap, HelpCircle } from "lucide-react"
import UserStats from "./UserStats"
import RecentTranslations from "./RecentTranslations"
import UsageStatistics from "./UsageStatistics"
import QuickActions from "./QuickActions"
import "../../../styles/workspace/dashboard/UserDashboard.css"

const UserDashboard = () => {
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

  // User stats
  const userStats = [
    {
      title: "Total Translations",
      value: "24",
      icon: <FileText size={20} />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Processing Time",
      value: "1.2 hrs",
      icon: <Clock size={20} />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Subscription",
      value: "Premium",
      icon: <Zap size={20} />,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Next Billing",
      value: "May 15",
      icon: <Calendar size={20} />,
      color: "from-green-500 to-green-600",
    },
  ]

  // Recent translations
  const recentTranslations = [
    {
      name: "Business_Meeting.mp4",
      date: "2 hours ago",
      languages: "English → Spanish",
      status: "Completed",
    },
    {
      name: "Product_Demo.mp3",
      date: "Yesterday",
      languages: "English → French, German",
      status: "Completed",
    },
    {
      name: "Conference_Talk.mp4",
      date: "3 days ago",
      languages: "English → Japanese",
      status: "Completed",
    },
  ]

  // Quick actions
  const quickActions = [
    { label: "Upload File", icon: <Upload size={20} />, color: "bg-blue-500" },
    { label: "New Translation", icon: <FileText size={20} />, color: "bg-purple-500" },
    { label: "View Analytics", icon: <BarChart2 size={20} />, color: "bg-green-500" },
    { label: "Get Help", icon: <HelpCircle size={20} />, color: "bg-yellow-500" },
  ]

  return (
    <motion.div className="user-dashboard-container" variants={containerVariants} initial="hidden" animate="visible">
      <div className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="last-updated">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <UserStats stats={userStats} itemVariants={itemVariants} />

      {/* Recent Translations and Usage */}
      <div className="dashboard-grid">
        <RecentTranslations translations={recentTranslations} itemVariants={itemVariants} />
        <UsageStatistics itemVariants={itemVariants} />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} itemVariants={itemVariants} />
    </motion.div>
  )
}

export default UserDashboard
