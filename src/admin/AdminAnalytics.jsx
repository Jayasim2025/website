"use client"

import { useState } from "react"
import "../styles/admin/AdminAnalytics.css"

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("month")

  // Sample data for charts
  const translationData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [1200, 1900, 3000, 5000, 4000, 6500],
  }

  const languageData = [
    { language: "English", percentage: 45 },
    { language: "Spanish", percentage: 25 },
    { language: "French", percentage: 15 },
    { language: "German", percentage: 10 },
    { language: "Others", percentage: 5 },
  ]

  const userStats = [
    { title: "New Users", value: "124", change: "+12%", period: "this month" },
    { title: "Active Users", value: "3,521", change: "+8%", period: "this month" },
    { title: "Premium Users", value: "842", change: "+22%", period: "this month" },
    { title: "Avg. Session", value: "12m 30s", change: "+5%", period: "this month" },
  ]

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <div className="time-range-selector">
          <button className={timeRange === "week" ? "active" : ""} onClick={() => setTimeRange("week")}>
            Week
          </button>
          <button className={timeRange === "month" ? "active" : ""} onClick={() => setTimeRange("month")}>
            Month
          </button>
          <button className={timeRange === "year" ? "active" : ""} onClick={() => setTimeRange("year")}>
            Year
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="stats-grid">
        {userStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <div className="stat-change-container">
                <span className="stat-change">{stat.change}</span>
                <span className="stat-period">{stat.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        {/* Translations Chart */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>Translation Volume</h2>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color primary"></div>
                <span>Translations</span>
              </div>
            </div>
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
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
          </div>
        </div>

        {/* Language Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h2>Language Distribution</h2>
          </div>
          <div className="chart-content">
            <div className="language-distribution">
              {languageData.map((item, index) => (
                <div key={index} className="language-item">
                  <div className="language-info">
                    <span className="language-name">{item.language}</span>
                    <span className="language-percentage">{item.percentage}%</span>
                  </div>
                  <div className="language-bar-container">
                    <div className="language-bar" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Engagement */}
      <div className="engagement-section">
        <h2>User Engagement</h2>
        <div className="engagement-metrics">
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="metric-content">
              <h3>User Retention</h3>
              <p className="metric-value">78%</p>
              <p className="metric-description">Average monthly retention rate</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="metric-content">
              <h3>Avg. Time on Platform</h3>
              <p className="metric-value">24 min</p>
              <p className="metric-description">Per active session</p>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">
              <i className="fas fa-redo"></i>
            </div>
            <div className="metric-content">
              <h3>Return Rate</h3>
              <p className="metric-value">65%</p>
              <p className="metric-description">Users returning within 7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
