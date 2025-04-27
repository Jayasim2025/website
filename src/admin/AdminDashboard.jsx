"use client"

import { motion } from "framer-motion"
import { Users, FileText, Globe, TrendingUp, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"

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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Clock size={16} />
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="bg-background-color rounded-xl overflow-hidden shadow-sm border border-border-color"
          >
            <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <span className="text-xs font-medium text-green-500 bg-green-100 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-primary-light text-primary-color">{stat.icon}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-background-color rounded-xl p-5 shadow-sm border border-border-color"
        >
          <h2 className="text-lg font-semibold mb-4">Translation Activity</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center text-text-secondary">
              <TrendingUp size={48} className="mx-auto mb-2 text-primary-color" />
              <p>Interactive chart will be displayed here</p>
              <p className="text-sm">Showing translation activity over time</p>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-background-color rounded-xl p-5 shadow-sm border border-border-color"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${activity.iconBg}`}>{activity.icon}</div>
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-text-secondary">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-sm text-primary-color hover:underline w-full text-center">
            View All Activity
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-background-color rounded-xl p-5 shadow-sm border border-border-color"
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add User", icon: <Users size={20} />, color: "bg-blue-500" },
            { label: "New Language", icon: <Globe size={20} />, color: "bg-green-500" },
            { label: "Update Content", icon: <FileText size={20} />, color: "bg-purple-500" },
            { label: "View Reports", icon: <TrendingUp size={20} />, color: "bg-yellow-500" },
          ].map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-border-color hover:bg-primary-light transition-colors"
            >
              <div className={`p-2 rounded-full ${action.color} text-white mb-2`}>{action.icon}</div>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
