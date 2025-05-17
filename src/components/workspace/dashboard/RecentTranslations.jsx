"use client"

import { motion } from "framer-motion"
import { FileText, Download } from "lucide-react"

const RecentTranslations = ({ translations, itemVariants }) => {
  return (
    <motion.div variants={itemVariants} className="translations-section">
      <div className="section-header">
        <h2>Recent Translations</h2>
        <button className="view-all-button">View All</button>
      </div>

      <div className="translations-list">
        {translations.map((translation, index) => (
          <div key={index} className="translation-item">
            <div className="translation-info">
              <div className="translation-icon">
                <FileText size={16} />
              </div>
              <div className="translation-details">
                <h3>{translation.name}</h3>
                <p>{translation.languages}</p>
              </div>
            </div>
            <div className="translation-meta">
              <span className="translation-date">{translation.date}</span>
              <span className={`translation-status status-${translation.status.toLowerCase()}`}>
                {translation.status}
              </span>
              <button className="download-button">
                <Download size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default RecentTranslations
