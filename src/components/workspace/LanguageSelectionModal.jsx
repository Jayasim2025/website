"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../../styles/workspace/LanguageSelectionModal.css"

const LanguageSelectionModal = ({ onClose, onLanguageSelected }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [error, setError] = useState("")

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!selectedLanguage) {
      setError("Please select a language")
      return
    }

    onLanguageSelected([selectedLanguage])
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="language-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Select Subtitle Language</h2>
            <button className="close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="languageSelect">Select the language for subtitles:</label>

              {error && <div className="error-message">{error}</div>}

              <div className="language-dropdown">
                <select
                  id="languageSelect"
                  className="language-select"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="">Select a language</option>
                  {languages.map((language) => (
                    <option key={language.code} value={language.code} className="language-option">
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <motion.button
                type="submit"
                className="continue-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continue
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LanguageSelectionModal
