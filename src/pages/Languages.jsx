"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/admin/Languages.css"

const Languages = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Sample languages data
  const languages = [
    {
      id: 1,
      name: "English",
      code: "en",
      region: "Global",
      status: "Active",
      supportLevel: "Full",
      translationCount: 12500,
      lastUpdated: "2023-06-15",
    },
    {
      id: 2,
      name: "Spanish",
      code: "es",
      region: "Europe",
      status: "Active",
      supportLevel: "Full",
      translationCount: 8750,
      lastUpdated: "2023-06-10",
    },
    {
      id: 3,
      name: "French",
      code: "fr",
      region: "Europe",
      status: "Active",
      supportLevel: "Full",
      translationCount: 7200,
      lastUpdated: "2023-06-12",
    },
    {
      id: 4,
      name: "German",
      code: "de",
      region: "Europe",
      status: "Active",
      supportLevel: "Full",
      translationCount: 6800,
      lastUpdated: "2023-06-08",
    },
    {
      id: 5,
      name: "Japanese",
      code: "ja",
      region: "Asia",
      status: "Active",
      supportLevel: "Full",
      translationCount: 5400,
      lastUpdated: "2023-06-05",
    },
    {
      id: 6,
      name: "Chinese (Simplified)",
      code: "zh-CN",
      region: "Asia",
      status: "Active",
      supportLevel: "Full",
      translationCount: 4900,
      lastUpdated: "2023-06-07",
    },
    {
      id: 7,
      name: "Russian",
      code: "ru",
      region: "Europe",
      status: "Active",
      supportLevel: "Full",
      translationCount: 4200,
      lastUpdated: "2023-06-03",
    },
    {
      id: 8,
      name: "Arabic",
      code: "ar",
      region: "Middle East",
      status: "Active",
      supportLevel: "Partial",
      translationCount: 3100,
      lastUpdated: "2023-05-28",
    },
    {
      id: 9,
      name: "Hindi",
      code: "hi",
      region: "Asia",
      status: "Beta",
      supportLevel: "Partial",
      translationCount: 1800,
      lastUpdated: "2023-06-01",
    },
    {
      id: 10,
      name: "Portuguese",
      code: "pt",
      region: "Europe",
      status: "Active",
      supportLevel: "Full",
      translationCount: 3800,
      lastUpdated: "2023-06-02",
    },
    {
      id: 11,
      name: "Korean",
      code: "ko",
      region: "Asia",
      status: "Active",
      supportLevel: "Full",
      translationCount: 2900,
      lastUpdated: "2023-05-30",
    },
    {
      id: 12,
      name: "Italian",
      code: "it",
      region: "Europe",
      status: "Active",
      supportLevel: "Full",
      translationCount: 3500,
      lastUpdated: "2023-06-04",
    },
  ]

  // Filter languages based on search term and filters
  const filteredLanguages = languages.filter((language) => {
    const matchesSearch =
      language.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      language.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = selectedRegion === "all" || language.region === selectedRegion
    const matchesStatus = selectedStatus === "all" || language.status === selectedStatus

    return matchesSearch && matchesRegion && matchesStatus
  })

  return (
    <div className="languages-container">
      <div className="languages-header">
        <h1>Languages Management</h1>
        <motion.button className="add-language-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-plus"></i>
          <span>Add Language</span>
        </motion.button>
      </div>

      <div className="languages-filters">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search languages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            <option value="all">All Regions</option>
            <option value="Global">Global</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="Middle East">Middle East</option>
            <option value="Africa">Africa</option>
            <option value="North America">North America</option>
            <option value="South America">South America</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Beta">Beta</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="languages-grid">
        {filteredLanguages.map((language) => (
          <motion.div
            className="language-card"
            key={language.id}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)" }}
          >
            <div className="language-header">
              <h3 className="language-name">{language.name}</h3>
              <span className={`language-status ${language.status.toLowerCase()}`}>{language.status}</span>
            </div>
            <div className="language-code">{language.code}</div>
            <div className="language-details">
              <div className="detail-item">
                <span className="detail-label">Region:</span>
                <span className="detail-value">{language.region}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Support:</span>
                <span className={`detail-value support-level ${language.supportLevel.toLowerCase()}`}>
                  {language.supportLevel}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Translations:</span>
                <span className="detail-value">{language.translationCount.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{language.lastUpdated}</span>
              </div>
            </div>
            <div className="language-actions">
              <button className="action-button edit">
                <i className="fas fa-edit"></i>
                <span>Edit</span>
              </button>
              <button className="action-button view">
                <i className="fas fa-eye"></i>
                <span>View</span>
              </button>
              {language.status === "Active" ? (
                <button className="action-button deactivate">
                  <i className="fas fa-toggle-off"></i>
                  <span>Deactivate</span>
                </button>
              ) : (
                <button className="action-button activate">
                  <i className="fas fa-toggle-on"></i>
                  <span>Activate</span>
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

export default Languages
