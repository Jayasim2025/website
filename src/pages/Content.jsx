"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/admin/Content.css"

const Content = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Sample content data
  const contentItems = [
    {
      id: 1,
      title: "How to Use Translatea2z - Tutorial",
      type: "Video",
      status: "Published",
      author: "John Doe",
      createdAt: "2023-05-15",
      updatedAt: "2023-06-10",
      views: 1250,
    },
    {
      id: 2,
      title: "Getting Started with Automatic Translations",
      type: "Article",
      status: "Published",
      author: "Jane Smith",
      createdAt: "2023-06-01",
      updatedAt: "2023-06-05",
      views: 850,
    },
    {
      id: 3,
      title: "Advanced Translation Techniques",
      type: "Guide",
      status: "Draft",
      author: "Robert Johnson",
      createdAt: "2023-06-18",
      updatedAt: "2023-06-18",
      views: 0,
    },
    {
      id: 4,
      title: "Translatea2z for Enterprise",
      type: "Whitepaper",
      status: "Published",
      author: "Emily Davis",
      createdAt: "2023-04-20",
      updatedAt: "2023-05-15",
      views: 620,
    },
    {
      id: 5,
      title: "Integrating with Third-Party Tools",
      type: "Tutorial",
      status: "Review",
      author: "Michael Wilson",
      createdAt: "2023-06-15",
      updatedAt: "2023-06-17",
      views: 0,
    },
    {
      id: 6,
      title: "Translatea2z API Documentation",
      type: "Documentation",
      status: "Published",
      author: "Sarah Brown",
      createdAt: "2023-03-10",
      updatedAt: "2023-06-12",
      views: 1850,
    },
  ]

  // Filter content based on search term and filters
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="content-container">
      <div className="content-header">
        <h1>Content Management</h1>
        <motion.button className="add-content-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-plus"></i>
          <span>Add Content</span>
        </motion.button>
      </div>

      <div className="content-filters">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Article">Article</option>
            <option value="Video">Video</option>
            <option value="Guide">Guide</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Whitepaper">Whitepaper</option>
            <option value="Documentation">Documentation</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Review">Review</option>
          </select>
        </div>
      </div>

      <div className="content-grid">
        {filteredContent.map((item) => (
          <motion.div
            className="content-card"
            key={item.id}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="content-card-header">
              <span className={`content-type ${item.type.toLowerCase()}`}>{item.type}</span>
              <span className={`content-status ${item.status.toLowerCase()}`}>{item.status}</span>
            </div>
            <h3 className="content-title">{item.title}</h3>
            <div className="content-meta">
              <div className="meta-item">
                <i className="fas fa-user"></i>
                <span>{item.author}</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>{item.updatedAt}</span>
              </div>
              {item.status === "Published" && (
                <div className="meta-item">
                  <i className="fas fa-eye"></i>
                  <span>{item.views}</span>
                </div>
              )}
            </div>
            <div className="content-actions">
              <button className="action-button edit">
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
              <button className="action-button view">
                <i className="fas fa-eye"></i>
                <span>View</span>
              </button>
              <button className="action-button delete">
                <i className="fas fa-trash"></i>
              </button>
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

export default Content
