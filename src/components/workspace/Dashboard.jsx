"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Dashboard.css"


const Dashboard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  const languages = [
    { code: "en", name: "English (US)", flag: "🇺🇸" },
    { code: "de", name: "German (Standard)", flag: "🇩🇪" },
    { code: "es", name: "Spanish (Castilian)", flag: "🇪🇸" },
    { code: "hi", name: "Hindi (Standard)", flag: "🇮🇳" },
    { code: "fr", name: "French (Standard)", flag: "🇫🇷" },
    { code: "it", name: "Italian (Standard)", flag: "🇮🇹" },
    { code: "ja", name: "Japanese (Standard)", flag: "🇯🇵" },
    { code: "ko", name: "Korean (Standard)", flag: "🇰🇷" },
    { code: "pt", name: "Portuguese (European)", flag: "🇵🇹" },
    { code: "ru", name: "Russian (Standard)", flag: "🇷🇺" },
    { code: "zh", name: "Chinese (Mandarin)", flag: "🇨🇳" },
  ]

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem("translationProjects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file) => {
    // Validate file type
    if (!file.type.includes("audio") && !file.type.includes("video")) {
      alert("Please upload an audio or video file")
      return
    }

    // Create new project
    const newProject = {
      id: Date.now().toString(),
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      duration: "Processing...", // Will be updated after processing
      aiGeneration: "PROCESSING",
      date: new Date().toLocaleString(),
      status: "processing",
      file: file,
      language: selectedLanguage
    }

    // Add to projects
    const updatedProjects = [...projects, newProject]
    setProjects(updatedProjects)
    localStorage.setItem("translationProjects", JSON.stringify(updatedProjects))

    // Simulate processing
    setTimeout(() => {
      const processed = updatedProjects.map(p => 
        p.id === newProject.id 
          ? { ...p, aiGeneration: "SUCCESS", status: "completed", duration: "02:35" }
          : p
      )
      setProjects(processed)
      localStorage.setItem("translationProjects", JSON.stringify(processed))
    }, 3000)
  }

  const openEditor = (project) => {
    // Store current project in localStorage for editor
    localStorage.setItem("currentProject", JSON.stringify(project))
    navigate("/workspace/editor")
  }

  const selectedLang = languages.find(lang => lang.code === selectedLanguage)

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="org-info">
          <span className="org-label">ORGANIZATION</span>
          <h1>Team Translatea2z</h1>
          <div className="org-badges">
            <span className="badge admin">ADMIN</span>
            <span className="credits">Credits: 106</span>
            <span className="view-teams">View Teams</span>
            <button className="org-settings">
              <i className="fas fa-cog"></i> View Organization Settings
            </button>
          </div>
        </div>
        <div className="org-date">Created 8 months ago</div>
      </div>

      <div className="upload-section">
        <div className="language-selection">
          <h2>Choose Output Language</h2>
          <p>Choose the language you want to transcribe your audio into. If you choose the same language as the audio language then the transcription will be in the same language as the audio. Else, the transcription will be automatically translated into the language you choose.</p>
          
          <div className="language-dropdown">
            <button 
              className="language-selector"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <span className="selected-language">
                <span className="flag">{selectedLang?.flag}</span>
                <span className="name">{selectedLang?.name}</span>
              </span>
              <i className={`fas fa-chevron-down ${isLanguageDropdownOpen ? 'open' : ''}`}></i>
            </button>

            <AnimatePresence>
              {isLanguageDropdownOpen && (
                <motion.div 
                  className="language-options"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className={`language-option ${selectedLanguage === language.code ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedLanguage(language.code)
                        setIsLanguageDropdownOpen(false)
                      }}
                    >
                      <span className="flag">{language.flag}</span>
                      <span className="name">{language.name}</span>
                      {selectedLanguage === language.code && <i className="fas fa-check"></i>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className="upload-icon">
            <i className="fas fa-cloud-upload-alt"></i>
          </div>
          <h3>Click to upload video or audio files</h3>
          <p className="supported-formats">MP4, MOV, AVI, WMV, FLV, MKV, WEBM, MP3, M4A, WAV, AAC</p>
          <p className="upload-tip">Pro tip: Use audio files for quicker conversion. Max length: 120 minutes. Max size: 1.5 GB</p>
          
          <input
            id="file-input"
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="projects-section">
        <div className="projects-header">
          <h2>Projects</h2>
          <p>A list of all the translations in your workspace</p>
        </div>

        <div className="projects-table">
          <div className="table-header">
            <div className="col-name">Name</div>
            <div className="col-duration">Duration(s)</div>
            <div className="col-ai">AI Generation</div>
            <div className="col-date">Date</div>
            <div className="col-status">Project Status</div>
            <div className="col-edit">Edit</div>
          </div>

          <div className="table-body">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p>No projects yet. Upload your first audio or video file to get started!</p>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="table-row">
                  <div className="col-name">
                    <span className="project-name">{project.name}</span>
                  </div>
                  <div className="col-duration">{project.duration}</div>
                  <div className="col-ai">
                    <span className={`status-badge ${project.aiGeneration.toLowerCase()}`}>
                      {project.aiGeneration}
                    </span>
                  </div>
                  <div className="col-date">{project.date}</div>
                  <div className="col-status">
                    <span className={`project-status ${project.status}`}>
                      <i className="fas fa-circle"></i>
                      {project.status === 'completed' ? 'Draft' : 'Processing'}
                    </span>
                  </div>
                  <div className="col-edit">
                    <button 
                      className="edit-button"
                      onClick={() => openEditor(project)}
                      disabled={project.status === 'processing'}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
