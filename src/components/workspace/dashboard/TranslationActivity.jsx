"use client"

import { useState } from "react"

const TranslationActivity = () => {
  const [timeRange, setTimeRange] = useState("month")

  // Sample data for the chart
  const activityData = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [5, 8, 12, 7, 10, 3, 6],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [25, 32, 40, 28],
    },
    year: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      values: [120, 150, 180, 210, 190, 220, 240, 230, 250, 270, 260, 290],
    },
  }

  const currentData = activityData[timeRange]
  const maxValue = Math.max(...currentData.values)

  return (
    <div className="activity-chart-container">
      <div className="chart-header">
        <h2>Translation Activity</h2>
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

      <div className="chart-content">
        <div className="bar-chart">
          {currentData.values.map((value, index) => (
            <div key={index} className="chart-bar-container">
              <div className="chart-bar" style={{ height: `${(value / maxValue) * 100}%` }}></div>
              <div className="chart-label">{currentData.labels[index]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TranslationActivity
