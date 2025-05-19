"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../../styles/workspace/FolderModal.css"

const FolderModal = ({ onClose, onCreateFolder }) => {
  const [folderName, setFolderName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!folderName.trim()) {
      setError("Please enter a folder name")
      return
    }

    onCreateFolder(folderName)
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
          className="folder-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Create New Folder</h2>
            <button className="close-button" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="folderName">Folder Name</label>
              <input
                type="text"
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-actions">
              <motion.button
                type="submit"
                className="create-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Folder
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FolderModal
