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
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark"
    setTheme(savedTheme)

    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme") || "dark"
      setTheme(currentTheme)
    }

    window.addEventListener("storage", handleThemeChange)
    return () => window.removeEventListener("storage", handleThemeChange)
  }, [])

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

  // Load projects from API or localStorage
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      // In production, this would be an API call
      // const response = await fetch('/api/projects')
      // const data = await response.json()
      // setProjects(data)

      // For now, load from localStorage
      const savedProjects = localStorage.getItem("translationProjects")
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects))
      }
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

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

  // Enhanced file upload with comprehensive metadata for backend API
  const handleFileUpload = async (file) => {
    // Validate file type
    if (!file.type.includes("audio") && !file.type.includes("video")) {
      alert("Please upload an audio or video file")
      return
    }

    setIsLoading(true)

    try {
      // Extract comprehensive file metadata for backend API
      const fileMetadata = await extractFileMetadata(file)

      // Prepare comprehensive data for backend API integration
      const uploadData = {
        // File Information
        file: file,
        fileName: file.name,
        fullFileName: file.name,
        fileSize: file.size,
        fileSizeFormatted: formatFileSize(file.size),
        fileType: file.type,

        // Media Information
        isVideo: file.type.includes("video"),
        isAudio: file.type.includes("audio"),
        duration: fileMetadata.duration,
        durationFormatted: formatDuration(fileMetadata.duration),

        // Project Information
        language: selectedLanguage,
        languageName: languages.find((l) => l.code === selectedLanguage)?.name,

        // Folder and Organization
        folderName: `project_${Date.now()}`,
        projectId: `proj_${Date.now()}`,

        // Timestamps
        uploadedAt: new Date().toISOString(),
        createdAt: Date.now(),

        // Additional metadata for backend processing
        metadata: {
          videoLength: fileMetadata.duration,
          audioVideoFile: file,
          folderName: `uploads/${Date.now()}`,
          fullFileName: file.name,
          sizeOfFile: file.size,
          language: selectedLanguage,
          // Additional technical details
          bitrate: fileMetadata.bitrate || null,
          resolution: fileMetadata.resolution || null,
          frameRate: fileMetadata.frameRate || null,
          audioChannels: fileMetadata.audioChannels || null,
          sampleRate: fileMetadata.sampleRate || null,
        },
      }

      // Backend API Integration Point
      // This is where the backend team will integrate their API
      const backendResponse = await uploadToBackend(uploadData)

      // Create new project with comprehensive data
      const newProject = {
        id: uploadData.projectId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        duration: uploadData.durationFormatted,
        aiGeneration: "PROCESSING",
        date: new Date().toLocaleString(),
        status: "processing",

        // File metadata for editor
        fileData: {
          file: file,
          fileName: uploadData.fileName,
          fileSize: uploadData.fileSize,
          fileSizeFormatted: uploadData.fileSizeFormatted,
          fileType: file.type,
          isVideo: uploadData.isVideo,
          isAudio: uploadData.isAudio,
          duration: fileMetadata.duration,
          durationSeconds: fileMetadata.duration,
        },

        // Language and processing info
        language: selectedLanguage,
        languageName: uploadData.languageName,

        // Backend response data
        backendData: backendResponse,

        // Metadata for backend integration
        uploadMetadata: uploadData.metadata,
      }

      const updatedProjects = [...projects, newProject]
      setProjects(updatedProjects)
      localStorage.setItem("translationProjects", JSON.stringify(updatedProjects))

      // Simulate processing with realistic timing
      setTimeout(() => {
        const processed = updatedProjects.map((p) =>
          p.id === newProject.id
            ? {
                ...p,
                aiGeneration: "SUCCESS",
                status: "completed",
                // Simulate backend response with subtitles
                subtitlesGenerated: true,
                subtitlesCount: 15, // This will come from backend
              }
            : p,
        )
        setProjects(processed)
        localStorage.setItem("translationProjects", JSON.stringify(processed))
      }, 3000)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Extract comprehensive file metadata
  const extractFileMetadata = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement(file.type.includes("video") ? "video" : "audio")
      const url = URL.createObjectURL(file)

      video.addEventListener("loadedmetadata", () => {
        const metadata = {
          duration: video.duration || 0,
          videoWidth: video.videoWidth || null,
          videoHeight: video.videoHeight || null,
          resolution: video.videoWidth ? `${video.videoWidth}x${video.videoHeight}` : null,
        }

        URL.revokeObjectURL(url)
        resolve(metadata)
      })

      video.addEventListener("error", () => {
        URL.revokeObjectURL(url)
        resolve({ duration: 0 })
      })

      video.src = url
    })
  }

  // Backend API integration function
  const uploadToBackend = async (uploadData) => {
    try {
      // This is where backend team will integrate their API
      const formData = new FormData()

      // Add file
      formData.append("file", uploadData.file)

      // Add metadata as JSON
      formData.append(
        "metadata",
        JSON.stringify({
          videoLength: uploadData.metadata.videoLength,
          folderName: uploadData.metadata.folderName,
          fullFileName: uploadData.metadata.fullFileName,
          sizeOfFile: uploadData.metadata.sizeOfFile,
          language: uploadData.metadata.language,
          fileType: uploadData.fileType,
          isVideo: uploadData.isVideo,
          isAudio: uploadData.isAudio,
          projectId: uploadData.projectId,
          uploadedAt: uploadData.uploadedAt,
        }),
      )

      // Backend API call
      // const response = await fetch('/api/upload-media', {
      //   method: 'POST',
      //   body: formData,
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   }
      // })
      //
      // if (!response.ok) {
      //   throw new Error(`Upload failed: ${response.statusText}`)
      // }
      //
      // const result = await response.json()
      // return result

      // Mock response for development
      return {
        success: true,
        projectId: uploadData.projectId,
        processingId: `proc_${Date.now()}`,
        estimatedProcessingTime: Math.ceil(uploadData.metadata.videoLength / 60) * 30, // 30 seconds per minute
        message: "File uploaded successfully and processing started",
      }
    } catch (error) {
      console.error("Backend upload error:", error)
      throw error
    }
  }

  // Utility functions
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0:00"
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const openEditor = (project) => {
    if (project.status === "processing") return

    // Store comprehensive project data for editor
    const editorData = {
      ...project,
      // Ensure all necessary data is available for editor
      fileMetadata: project.fileData,
      uploadMetadata: project.uploadMetadata,
      backendData: project.backendData,
    }

    localStorage.setItem("currentProject", JSON.stringify(editorData))
    navigate("/workspace/editor")
  }

  const deleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      // API call to delete project and associated files
      // await fetch(`/api/projects/${projectId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   }
      // })

      const updatedProjects = projects.filter((p) => p.id !== projectId)
      setProjects(updatedProjects)
      localStorage.setItem("translationProjects", JSON.stringify(updatedProjects))
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const selectedLang = languages.find((lang) => lang.code === selectedLanguage)

  return (
    <div className={`dashboard-container ${theme}`}>
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
          <p>
            Choose the language you want to transcribe your audio into. If you choose the same language as the audio
            language then the transcription will be in the same language as the audio. Else, the transcription will be
            automatically translated into the language you choose.
          </p>

          <div className="language-dropdown">
            <button className="language-selector" onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}>
              <span className="selected-language">
                <span className="flag">{selectedLang?.flag}</span>
                <span className="name">{selectedLang?.name}</span>
              </span>
              <i className={`fas fa-chevron-down ${isLanguageDropdownOpen ? "open" : ""}`}></i>
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
                      className={`language-option ${selectedLanguage === language.code ? "selected" : ""}`}
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
          className={`upload-area ${isDragging ? "dragging" : ""} ${isLoading ? "loading" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isLoading && document.getElementById("file-input").click()}
        >
          {isLoading ? (
            <div className="upload-loading">
              <div className="loading-spinner"></div>
              <h3>Uploading and processing...</h3>
              <p>Please wait while we process your file</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h3>Click to upload video or audio files</h3>
              <p className="supported-formats">MP4, MOV, AVI, WMV, FLV, MKV, WEBM, MP3, M4A, WAV, AAC</p>
              <p className="upload-tip">
                Pro tip: Use audio files for quicker conversion. Max length: 120 minutes. Max size: 1.5 GB
              </p>
            </>
          )}

          <input
            id="file-input"
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="projects-section">
        <div className="projects-header">
          <h2>Projects</h2>
          <p>A list of all the translations in your workspace</p>
        </div>

        <div className="projects-table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th className="col-name">Name</th>
                <th className="col-duration">Duration(s)</th>
                <th className="col-ai">AI Generation</th>
                <th className="col-date">Date</th>
                <th className="col-status">Project Status</th>
                <th className="col-edit">Edit</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="6" className="empty-state">
                    <div className="empty-content">
                      <i className="fas fa-folder-open"></i>
                      <p>No projects yet. Upload your first audio or video file to get started!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="project-row">
                    <td className="col-name">
                      <div className="project-name-cell">
                        <span className="project-name" title={project.name}>
                          {project.name.length > 35 ? `${project.name.substring(0, 35)}...` : project.name}
                        </span>
                        <div className="project-meta">
                          <span className="file-type">{project.fileData?.isVideo ? "Video" : "Audio"}</span>
                          {project.fileData?.fileSizeFormatted && (
                            <span className="file-size">{project.fileData.fileSizeFormatted}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="col-duration">
                      <span className="duration-text">{project.duration}</span>
                    </td>
                    <td className="col-ai">
                      <span className={`status-badge ${project.aiGeneration.toLowerCase()}`}>
                        {project.aiGeneration}
                      </span>
                    </td>
                    <td className="col-date">
                      <span className="date-text">{project.date}</span>
                    </td>
                    <td className="col-status">
                      <div className="status-cell">
                        <div className={`status-indicator ${project.status}`}></div>
                        <span className="status-text">{project.status === "completed" ? "Draft" : "Processing"}</span>
                      </div>
                    </td>
                    <td className="col-edit">
                      <div className="edit-actions">
                        <button
                          className={`edit-button ${project.status === "processing" ? "disabled" : ""}`}
                          onClick={() => openEditor(project)}
                          disabled={project.status === "processing"}
                          title={project.status === "processing" ? "Processing..." : "Edit project"}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteProject(project.id)}
                          title="Delete project"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
