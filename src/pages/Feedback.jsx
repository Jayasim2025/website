"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/admin/Feedback.css"

const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Sample feedback data
  const feedbackItems = [
    {
      id: 1,
      user: "John Doe",
      email: "john.doe@example.com",
      type: "Bug Report",
      subject: "Translation fails for long videos",
      message:
        "When I try to translate videos longer than 30 minutes, the system crashes and I lose all my progress. This has happened three times now.",
      status: "Open",
      priority: "High",
      createdAt: "2023-06-15",
      assignedTo: "Sarah Brown",
    },
    {
      id: 2,
      user: "Jane Smith",
      email: "jane.smith@example.com",
      type: "Feature Request",
      subject: "Add support for automatic chapter detection",
      message:
        "It would be great if the system could automatically detect chapters in videos based on content changes or silence.",
      status: "Under Review",
      priority: "Medium",
      createdAt: "2023-06-10",
      assignedTo: "Michael Wilson",
    },
    {
      id: 3,
      user: "Robert Johnson",
      email: "robert.johnson@example.com",
      type: "General Feedback",
      subject: "Great experience with the new UI",
      message:
        "I just wanted to say that the new user interface is much more intuitive and easier to use. Great job on the redesign!",
      status: "Closed",
      priority: "Low",
      createdAt: "2023-06-05",
      assignedTo: null,
    },
    {
      id: 4,
      user: "Emily Davis",
      email: "emily.davis@example.com",
      type: "Bug Report",
      subject: "Incorrect timestamps in exported SRT files",
      message:
        "The timestamps in the exported SRT files are off by about 2 seconds, which causes the subtitles to be out of sync with the audio.",
      status: "In Progress",
      priority: "High",
      createdAt: "2023-06-12",
      assignedTo: "John Doe",
    },
    {
      id: 5,
      user: "Michael Wilson",
      email: "michael.wilson@example.com",
      type: "Feature Request",
      subject: "Support for custom fonts in subtitles",
      message:
        "It would be helpful to have the option to use custom fonts for subtitles, especially for languages with special characters.",
      status: "Planned",
      priority: "Medium",
      createdAt: "2023-06-08",
      assignedTo: null,
    },
    {
      id: 6,
      user: "Sarah Brown",
      email: "sarah.brown@example.com",
      type: "General Feedback",
      subject: "Pricing is too high for individual creators",
      message:
        "I love the service, but the pricing is a bit steep for individual content creators. Perhaps consider a more affordable tier with limited features?",
      status: "Under Review",
      priority: "Medium",
      createdAt: "2023-06-14",
      assignedTo: "Robert Johnson",
    },
  ]

  // Filter feedback based on search term and filters
  const filteredFeedback = feedbackItems.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h1>User Feedback</h1>
      </div>

      <div className="feedback-filters">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Bug Report">Bug Reports</option>
            <option value="Feature Request">Feature Requests</option>
            <option value="General Feedback">General Feedback</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Planned">Planned</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="feedback-list">
        {filteredFeedback.map((item) => (
          <motion.div
            className="feedback-card"
            key={item.id}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="feedback-header">
              <div className="feedback-meta">
                <span className={`feedback-type ${item.type.toLowerCase().replace(" ", "-")}`}>{item.type}</span>
                <span className={`feedback-status ${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span>
                <span className={`feedback-priority priority-${item.priority.toLowerCase()}`}>{item.priority}</span>
              </div>
              <div className="feedback-date">{item.createdAt}</div>
            </div>

            <h3 className="feedback-subject">{item.subject}</h3>
            <p className="feedback-message">{item.message}</p>

            <div className="feedback-user">
              <div className="user-info">
                <span className="user-name">{item.user}</span>
                <span className="user-email">{item.email}</span>
              </div>
              {item.assignedTo && (
                <div className="assigned-to">
                  <span className="assigned-label">Assigned to:</span>
                  <span className="assigned-name">{item.assignedTo}</span>
                </div>
              )}
            </div>

            <div className="feedback-actions">
              <button className="action-button reply">
                <i className="fas fa-reply"></i>
                <span>Reply</span>
              </button>
              <button className="action-button assign">
                <i className="fas fa-user-plus"></i>
                <span>Assign</span>
              </button>
              {item.status !== "Closed" ? (
                <button className="action-button close">
                  <i className="fas fa-check-circle"></i>
                  <span>Close</span>
                </button>
              ) : (
                <button className="action-button reopen">
                  <i className="fas fa-redo"></i>
                  <span>Reopen</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pagination">
        <button className="pagination-button">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="pagination-button active">1</button>
        <button className="pagination-button">2</button>
        <button className="pagination-button">3</button>
        <span className="pagination-ellipsis">...</span>
        <button className="pagination-button">10</button>
        <button className="pagination-button">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}

export default Feedback
