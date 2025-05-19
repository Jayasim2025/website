"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Dashboard.css"
import FolderModal from "./FolderModal"
import LanguageSelectionModal from "./LanguageSelectionModal"
import FileUploadModal from "./FileUploadModal"
import FileViewer from "./FileViewer"

const Dashboard = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFile, setDraggedFile] = useState(null)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [folders, setFolders] = useState([])
  const [currentFolder, setCurrentFolder] = useState(null)
  const [files, setFiles] = useState({})
  const [selectedFile, setSelectedFile] = useState(null)
  const [showFileViewer, setShowFileViewer] = useState(false)
  const navigate = useNavigate()

  // Load folders from localStorage on component mount
  useEffect(() => {
    const savedFolders = localStorage.getItem("folders")
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders))
    }

    const savedFiles = localStorage.getItem("files")
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    }
  }, [])

  // Save folders to localStorage when they change
  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders))
  }, [folders])

  // Save files to localStorage when they change
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files))
  }, [files])

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

  // Update the startGeneration function to handle a single language selection
  const startGeneration = () => {
    if (currentFolder) {
      setShowLanguageModal(true)
    } else {
      // If no folder is selected, show a message or create a default folder
      setShowFolderModal(true)
    }
  }

  // Update the handleLanguageSelected function to handle a single language
  const handleLanguageSelected = (languages) => {
    setShowLanguageModal(false)
    setShowUploadModal(true)
    // Store selected language for later use
    localStorage.setItem("selectedLanguages", JSON.stringify(languages))
  }

  const handleFileUploaded = (file) => {
    setShowUploadModal(false)

    if (currentFolder) {
      // Add file to the current folder
      const newFiles = { ...files }
      if (!newFiles[currentFolder.id]) {
        newFiles[currentFolder.id] = []
      }

      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        status: "completed",
        languages: JSON.parse(localStorage.getItem("selectedLanguages") || "[]"),
      }

      newFiles[currentFolder.id] = [...newFiles[currentFolder.id], newFile]
      setFiles(newFiles)
    }
  }

  const openFile = (file) => {
    setSelectedFile(file)
    setShowFileViewer(true)
  }

  const closeFileViewer = () => {
    setShowFileViewer(false)
    setSelectedFile(null)
  }

  const goBackToRoot = () => {
    setCurrentFolder(null)
  }

  const openFolder = (folder) => {
    setCurrentFolder(folder)
  }

  const createFolder = (folderName) => {
    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      createdAt: new Date().toISOString(),
    }
    setFolders([...folders, newFolder])
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
            {currentFolder ? (
              <div className="breadcrumb">
                <span className="breadcrumb-item clickable" onClick={goBackToRoot}>
                  <i className="fas fa-folder"></i>
                  <span>All Files</span>
                </span>
                <i className="fas fa-chevron-right breadcrumb-separator"></i>
                <span className="breadcrumb-item current">
                  <i className="fas fa-folder-open"></i>
                  <span>{currentFolder.name}</span>
                </span>
              </div>
            ) : (
              <>
                <i className="fas fa-folder"></i>
                <span>All Files</span>
              </>
            )}
          </div>
          <div className="files-actions">
            <motion.button
              className="new-folder-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFolderModal(true)}
            >
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

        {!currentFolder && folders.length === 0 && !isDragging && (
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
                <motion.button
                  className="upload-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFolderModal(true)}
                >
                  <i className="fas fa-folder-plus"></i>
                  <span>New Folder</span>
                </motion.button>
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
        )}

        {!currentFolder && folders.length > 0 && (
          <div className="folders-grid">
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                className="folder-item"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openFolder(folder)}
              >
                <div className="folder-icon">
                  <i className="fas fa-folder"></i>
                </div>
                <div className="folder-details">
                  <span className="folder-name">{folder.name}</span>
                  <div className="folder-meta">
                    <span className="folder-count">{files[folder.id] ? files[folder.id].length : 0} items</span>
                    <span className="folder-date">{new Date(folder.createdAt).toLocaleDateString()} ago</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {currentFolder && (
          <div className="folder-content">
            {!files[currentFolder.id] || files[currentFolder.id].length === 0 ? (
              <div className="empty-folder">
                <div className="empty-folder-icon">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h3>This folder is empty</h3>
                <p>Upload media files to generate transcriptions in this folder</p>
                <div className="empty-folder-actions">
                  <motion.button
                    className="new-folder-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFolderModal(true)}
                  >
                    <i className="fas fa-folder-plus"></i>
                    <span>New Folder</span>
                  </motion.button>
                  <motion.button
                    className="back-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goBackToRoot}
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Directory</span>
                  </motion.button>
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
            ) : (
              <div className="files-grid">
                {files[currentFolder.id].map((file) => (
                  <motion.div
                    key={file.id}
                    className="file-item"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openFile(file)}
                  >
                    <div className="file-icon">
                      <i className={file.type.includes("audio") ? "fas fa-file-audio" : "fas fa-file-video"}></i>
                    </div>
                    <div className="file-details">
                      <span className="file-name">{file.name}</span>
                      <div className="file-meta">
                        <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                        <span className="file-date">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="file-status">
                        <span className={`status-badge ${file.status}`}>{file.status}</span>
                        <div className="file-actions">
                          <button className="action-button edit">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="action-button download">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {showFolderModal && <FolderModal onClose={() => setShowFolderModal(false)} onCreateFolder={createFolder} />}
          {showLanguageModal && (
            <LanguageSelectionModal
              onClose={() => setShowLanguageModal(false)}
              onLanguageSelected={handleLanguageSelected}
            />
          )}
          {showUploadModal && (
            <FileUploadModal onClose={() => setShowUploadModal(false)} onFileUploaded={handleFileUploaded} />
          )}
          {showFileViewer && selectedFile && <FileViewer file={selectedFile} onClose={closeFileViewer} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Dashboard
