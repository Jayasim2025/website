"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/admin/Translations.css"

const Translations = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Sample translation data
  const translations = [
    {
      id: 1,
      title: "Marketing Video - Q2 Campaign",
      sourceLanguage: "English",
      targetLanguage: "Spanish",
      wordCount: 1250,
      status: "Completed",
      createdAt: "2023-06-15",
      completedAt: "2023-06-18",
      user: "John Doe",
    },
    {
      id: 2,
      title: "Product Documentation v2.0",
      sourceLanguage: "English",
      targetLanguage: "French",
      wordCount: 3450,
      status: "In Progress",
      createdAt: "2023-06-17",
      completedAt: null,
      user: "Jane Smith",
    },
    {
      id: 3,
      title: "Customer Support Scripts",
      sourceLanguage: "English",
      targetLanguage: "German",
      wordCount: 980,
      status: "Completed",
      createdAt: "2023-06-10",
      completedAt: "2023-06-12",
      user: "Robert Johnson",
    },
    {
      id: 4,
      title: "Website Localization",
      sourceLanguage: "English",
      targetLanguage: "Japanese",
      wordCount: 2750,
      status: "Completed",
      createdAt: "2023-06-05",
      completedAt: "2023-06-09",
      user: "Emily Davis",
    },
    {
      id: 5,
      title: "Mobile App UI Strings",
      sourceLanguage: "English",
      targetLanguage: "Chinese",
      wordCount: 520,
      status: "Failed",
      createdAt: "2023-06-19",
      completedAt: null,
      user: "Michael Wilson",
    },
    {
      id: 6,
      title: "Annual Report 2023",
      sourceLanguage: "English",
      targetLanguage: "Russian",
      wordCount: 5200,
      status: "Queued",
      createdAt: "2023-06-20",
      completedAt: null,
      user: "Sarah Brown",
    },
  ]

  // Filter translations based on search term and filters
  const filteredTranslations = translations.filter((translation) => {
    const matchesSearch = translation.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage =
      selectedLanguage === "all" ||
      translation.sourceLanguage === selectedLanguage ||
      translation.targetLanguage === selectedLanguage
    const matchesStatus = selectedStatus === "all" || translation.status === selectedStatus

    return matchesSearch && matchesLanguage && matchesStatus
  })

  return (
    <div className="translations-container">
      <div className="translations-header">
        <h1>Translations Management</h1>
        <div className="header-actions">
          <motion.button className="export-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <i className="fas fa-download"></i>
            <span>Export</span>
          </motion.button>
          <motion.button className="new-translation-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <i className="fas fa-plus"></i>
            <span>New Translation</span>
          </motion.button>
        </div>
      </div>

      <div className="translations-filters">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
            <option value="Chinese">Chinese</option>
            <option value="Russian">Russian</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Queued">Queued</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="translations-table">
        <div className="table-header">
          <div className="header-cell">ID</div>
          <div className="header-cell">Title</div>
          <div className="header-cell">Languages</div>
          <div className="header-cell">Words</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Created</div>
          <div className="header-cell">User</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {filteredTranslations.map((translation) => (
            <div className="table-row" key={translation.id}>
              <div className="cell">{translation.id}</div>
              <div className="cell title-cell">{translation.title}</div>
              <div className="cell languages-cell">
                <div className="language-pair">
                  <span className="source-language">{translation.sourceLanguage}</span>
                  <i className="fas fa-arrow-right"></i>
                  <span className="target-language">{translation.targetLanguage}</span>
                </div>
              </div>
              <div className="cell">{translation.wordCount}</div>
              <div className="cell">
                <span className={`status-badge ${translation.status.toLowerCase().replace(" ", "-")}`}>
                  {translation.status}
                </span>
              </div>
              <div className="cell">{translation.createdAt}</div>
              <div className="cell">{translation.user}</div>
              <div className="cell actions">
                <button className="action-button view">
                  <i className="fas fa-eye"></i>
                </button>
                <button className="action-button download">
                  <i className="fas fa-download"></i>
                </button>
                <button className="action-button delete">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
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

export default Translations
