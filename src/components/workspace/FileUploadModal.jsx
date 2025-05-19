"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../../styles/workspace/FileUploadModal.css"

const FileUploadModal = ({ onClose, onFileUploaded }) => {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (file) => {
    // Check if file is audio or video
    if (!file.type.includes("audio") && !file.type.includes("video")) {
      setError("Please upload an audio or video file")
      return
    }

    // Check file size (10MB limit for example)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit")
      return
    }

    setError("")
    setFile(file)
  }

  const handleUpload = () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          onFileUploaded(file)
        }, 500)
      }
    }, 300)
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
          className="upload-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>Transcribe Your Media with AI</h2>
            <button className="close-button" onClick={onClose} disabled={isUploading}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="modal-content">
            <div className="upload-instructions">
              <h3>Upload Media Files</h3>
              <p>
                Uploaded files are asynchronously uploaded and processed. Please don't close the dialog or refresh the
                page.
              </p>
            </div>

            <div className="plan-limitations">
              <h4>Free Plan Limitations</h4>
              <p>
                Free plan only allows 1 file upload at a time, with a maximum size of 10MB, and only supports audio
                files.
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {!file && !isUploading ? (
              <div
                className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <div className="upload-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <p className="upload-text">Click to upload audio files</p>
                <p className="upload-formats">.MP3, .M4A, .WAV, .AAC</p>
                <p className="upload-limits">
                  Free plan: 1 audio file only. Max size: 10mb. Max duration: 10 minutes. Upgrade for more.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/*,video/*"
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="file-preview">
                {file && (
                  <div className="selected-file">
                    <div className="file-icon">
                      <i className={file.type.includes("audio") ? "fas fa-file-audio" : "fas fa-file-video"}></i>
                    </div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    {!isUploading && (
                      <button className="remove-file" onClick={() => setFile(null)}>
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                )}

                {isUploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <span className="progress-text">{uploadProgress}% Uploaded</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-actions">
            {!isUploading ? (
              <motion.button
                className="upload-button"
                onClick={handleUpload}
                disabled={!file}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-upload"></i>
                <span>Upload & Process</span>
              </motion.button>
            ) : (
              <button className="upload-button uploading" disabled>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Uploading...</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FileUploadModal
