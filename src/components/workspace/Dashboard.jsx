"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Dashboard.css"

const Dashboard = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFile, setDraggedFile] = useState(null)
  const navigate = useNavigate()

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    // Handle file drop
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setDraggedFile(e.dataTransfer.files[0])
      // In a real app, you would upload the file here
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDraggedFile(e.target.files[0])
      // In a real app, you would upload the file here
    }
  }

  const startGeneration = () => {
    // Simulate starting generation
    console.log("Starting generation with file:", draggedFile)
    // In a real app, you would navigate to a processing page or show a progress indicator
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Home</h1>
        <p>Upload audio or video files to instantly generate speech-to-text transcriptions.</p>
      </div>

      <div className="dashboard-content">
        <div className="files-header">
          <div className="files-title">
            <i className="fas fa-folder"></i>
            <span>All Files</span>
          </div>
          <div className="files-actions">
            <motion.button className="new-folder-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <i className="fas fa-folder-plus"></i>
              <span>New Folder</span>
            </motion.button>
            <motion.button
              className="start-generation-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGeneration}
            >
              <i className="fas fa-bolt"></i>
              <span>Start Generation</span>
            </motion.button>
          </div>
        </div>

        <div
          className={`upload-area ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <div className="upload-icon">
              <i className="fas fa-file-upload"></i>
            </div>
            <h2>Start transcribing your media</h2>
            <p>Upload an audio or video file to instantly generate transcriptions</p>

            <div className="upload-actions">
              <label className="upload-button">
                <input type="file" onChange={handleFileChange} accept="audio/*,video/*" />
                <i className="fas fa-folder"></i>
                <span>New Folder</span>
              </label>
              <motion.button
                className="generation-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGeneration}
              >
                <i className="fas fa-bolt"></i>
                <span>Start Generation</span>
              </motion.button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {draggedFile && (
            <motion.div
              className="selected-file"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="file-info">
                <i className="fas fa-file-audio"></i>
                <div className="file-details">
                  <span className="file-name">{draggedFile.name}</span>
                  <span className="file-size">{(draggedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
              <button className="remove-file" onClick={() => setDraggedFile(null)}>
                <i className="fas fa-times"></i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="recent-files">
          <h3>Recent Files</h3>
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <p>No files yet. Upload your first audio or video file to get started.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
