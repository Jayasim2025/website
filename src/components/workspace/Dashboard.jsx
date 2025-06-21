"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useCreditSystem } from "./CreditSystem"
import "../../styles/workspace/Dashboard.css"

const Dashboard = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showTeamsDialog, setShowTeamsDialog] = useState(false)
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")

  // Initialize teams with only workspace name
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem("organizationTeams")
    if (savedTeams) {
      return JSON.parse(savedTeams)
    }
    return [
      {
        id: 0,
        name: "Team Translatea2z",
        createdOn: "8 months ago",
        isWorkspace: true,
      },
    ]
  })

  const navigate = useNavigate()
  const [theme, setTheme] = useState("dark")

  // Credit system integration
  const { currentPlan, credits, planInfo, upgradePlan, deductCredits, canProcess } = useCreditSystem()
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false)

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

  // Load projects from localStorage and add demo project
  useEffect(() => {
    loadProjects()
  }, [])

  // Backend Integration Point - Get Projects API
  const getProjectsFromAPI = async () => {
    try {
      const apiEndpoint = "/api/projects/get-projects"
      const requestData = {
        userId: "current_user_id", // Replace with actual user ID
        organizationId: "team_translatea2z",
        folder: "workspace_projects", // Folder-based organization
        timestamp: Date.now(),
      }

      console.log("🔗 Backend Integration Point: Get Projects API")
      console.log("📡 API Endpoint:", apiEndpoint)
      console.log("📋 Request Data:", requestData)
      console.log("📥 Expected Response Format:", {
        success: true,
        projects: [
          {
            id: "string",
            name: "string",
            status: "processing | processed", // Only these two statuses
            duration: "string",
            date: "string",
            fileData: "object",
            language: "string",
            languageName: "string",
            creditsUsed: "number",
            uploadLink: "string",
            folder: "string",
          },
        ],
      })

      // For demo purposes, simulate API call
      // Backend team will replace this with actual fetch call
      const simulatedResponse = await simulateGetProjectsAPI(requestData)

      console.log("📤 API Response:", simulatedResponse)
      return simulatedResponse
    } catch (error) {
      console.error("❌ Get Projects API Error:", error)
      return { success: false, projects: [] }
    }
  }

  // Simulate API response for demo - Backend team will remove this
  const simulateGetProjectsAPI = async (requestData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedProjects = localStorage.getItem("translationProjects")
        const existingProjects = savedProjects ? JSON.parse(savedProjects) : []

        // Add ONLY ONE 1-MINUTE DEMO PROJECT with PROCESSED status
        const demoProjects = [
          {
            id: "demo_project_1",
            name: "Sample Audio Demo",
            duration: "1:00",
            status: "processed", // PROCESSED so Edit button shows
            date: new Date(Date.now() - 86400000).toLocaleString(),
            fileData: {
              file: null,
              fileName: "sample_audio_demo.mp3",
              fileSize: 1024000,
              fileSizeFormatted: "1.0 MB",
              fileType: "audio/mp3",
              isVideo: false,
              isAudio: true,
              duration: 60,
              durationSeconds: 60,
            },
            language: "en",
            languageName: "English (US)",
            creditsUsed: 3,
            uploadLink: "https://api.translatea2z.com/upload/demo_link_123",
            isDemo: true,
            folder: requestData.folder,
          },
        ]

        // Only add the demo project if it doesn't exist
        const demoExists = existingProjects.some((p) => p.id === "demo_project_1")
        if (!demoExists) {
          existingProjects.unshift(demoProjects[0])
        }

        resolve({
          success: true,
          projects: existingProjects,
          folder: requestData.folder,
          totalProjects: existingProjects.length,
          processingCount: existingProjects.filter((p) => p.status === "processing").length,
          processedCount: existingProjects.filter((p) => p.status === "processed").length,
        })
      }, 1000)
    })
  }

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      console.log("🚀 Starting Get Projects API Integration")

      const apiResponse = await getProjectsFromAPI()

      if (apiResponse.success) {
        console.log("✅ Projects loaded successfully")
        console.log("📊 Project Statistics:", {
          total: apiResponse.totalProjects,
          processing: apiResponse.processingCount,
          processed: apiResponse.processedCount,
        })

        // Sort projects by date (newest first)
        const sortedProjects = apiResponse.projects.sort((a, b) => new Date(b.date) - new Date(a.date))

        setProjects(sortedProjects)
        localStorage.setItem("translationProjects", JSON.stringify(sortedProjects))

        console.log("💾 Projects saved to state and localStorage")
      } else {
        console.error("❌ Failed to load projects from API")
        setProjects([])
      }
    } catch (error) {
      console.error("❌ Error in loadProjects:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
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

  // Generate upload link for backend team to integrate
  const generateUploadLink = (fileMetadata) => {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const uploadLink = `https://api.translatea2z.com/upload/${timestamp}_${randomId}`

    console.log("Generated upload link for backend integration:", uploadLink)
    console.log("File metadata for backend:", fileMetadata)

    return uploadLink
  }

  // File upload workflow - ready for backend integration
  const handleFileUpload = async (file) => {
    if (!file.type.includes("audio") && !file.type.includes("video")) {
      alert("Please upload an audio or video file")
      return
    }

    setIsLoading(true)

    try {
      const fileMetadata = await extractFileMetadata(file)
      const durationMinutes = fileMetadata.duration / 60
      const fileType = file.type.includes("video") ? "video" : "audio"

      // Check credits
      if (!canProcess(fileType, durationMinutes)) {
        const cost = Math.ceil(planInfo.processingCost[fileType] * durationMinutes)
        alert(`Insufficient credits! You need ${cost} credits but only have ${credits}. Please upgrade your plan.`)
        setIsLoading(false)
        return
      }

      const deductionResult = deductCredits(fileType, durationMinutes)
      if (!deductionResult.success) {
        alert(`Credit deduction failed. Please try again.`)
        setIsLoading(false)
        return
      }

      // Step 1: Generate upload link (Backend team will implement the actual upload)
      const uploadLink = generateUploadLink(fileMetadata)

      // Step 2: Prepare data structure for backend team
      const backendData = {
        uploadLink: uploadLink,
        file: file,
        metadata: {
          videoLength: fileMetadata.duration,
          folderName: `uploads/${Date.now()}`,
          fullFileName: file.name,
          sizeOfFile: file.size,
          language: selectedLanguage,
          fileType: file.type,
          isVideo: file.type.includes("video"),
          isAudio: file.type.includes("audio"),
          creditsDeducted: deductionResult.cost,
          remainingCredits: credits - deductionResult.cost,
          bitrate: fileMetadata.bitrate || null,
          resolution: fileMetadata.resolution || null,
          frameRate: fileMetadata.frameRate || null,
          audioChannels: fileMetadata.audioChannels || null,
          sampleRate: fileMetadata.sampleRate || null,
        },
      }

      console.log("Data ready for backend team:", backendData)

      // Step 3: Create project entry with processing status
      const projectId = `proj_${Date.now()}`
      const newProject = {
        id: projectId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        duration: formatDuration(fileMetadata.duration),
        aiGeneration: "PROCESSING",
        date: new Date().toLocaleString(),
        status: "processing",
        fileData: {
          file: file,
          fileName: file.name,
          fileSize: file.size,
          fileSizeFormatted: formatFileSize(file.size),
          fileType: file.type,
          isVideo: file.type.includes("video"),
          isAudio: file.type.includes("audio"),
          duration: fileMetadata.duration,
          durationSeconds: fileMetadata.duration,
        },
        language: selectedLanguage,
        languageName: languages.find((l) => l.code === selectedLanguage)?.name,
        creditsUsed: deductionResult.cost,
        uploadLink: uploadLink,
        backendData: backendData,
      }

      // Add to projects list (newest first)
      const updatedProjects = [newProject, ...projects]
      setProjects(updatedProjects)
      localStorage.setItem("translationProjects", JSON.stringify(updatedProjects))

      // Step 4: Simulate processing for demo (Backend team will replace this with actual API polling)
      // simulateProcessing(projectId, updatedProjects)
      console.log("📤 Project created and ready for backend processing")
      console.log("🔄 Backend team: Implement polling mechanism to check project status")
      console.log("📋 Polling endpoint should be: GET /api/projects/status/" + projectId)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

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

    const editorData = {
      ...project,
      fileMetadata: project.fileData,
      backendData: project.backendData,
    }

    localStorage.setItem("currentProject", JSON.stringify(editorData))
    navigate("/workspace/editor")
  }

  const deleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const updatedProjects = projects.filter((p) => p.id !== projectId)
      setProjects(updatedProjects)
      localStorage.setItem("translationProjects", JSON.stringify(updatedProjects))
      console.log(`✅ Project ${projectId} deleted successfully`)
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete project. Please try again.")
    }
  }

  const handleUpgradePlan = (planType) => {
    upgradePlan(planType)
    setShowUpgradeOptions(false)
  }

  const getCreditUsagePercentage = () => {
    return ((planInfo.monthlyCredits - credits) / planInfo.monthlyCredits) * 100
  }

  // Team management functions
  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = {
        id: Date.now(),
        name: newTeamName.trim(),
        createdOn: new Date().toLocaleDateString(),
        isWorkspace: false,
      }

      const updatedTeams = [...teams, newTeam]
      setTeams(updatedTeams)
      setNewTeamName("")
      setShowCreateTeamDialog(false)

      localStorage.setItem("organizationTeams", JSON.stringify(updatedTeams))
      alert(`Team "${newTeam.name}" created successfully!`)
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
            <span className="credits">Credits: {credits.toLocaleString()}</span>
            <button className="view-teams" onClick={() => setShowTeamsDialog(true)}>
              View Teams
            </button>
            <button className="org-settings" onClick={() => navigate("/workspace/organization")}>
              <i className="fas fa-cog"></i> View Organization Settings
            </button>
          </div>
        </div>
        <div className="org-date">Created 8 months ago</div>
      </div>

      {/* Credit System Display */}
      <div className="credits-section">
        <div className="credits-display">
          <div className="credits-info">
            <span className="credits-label">Available Credits</span>
            <span className="credits-amount">{credits.toLocaleString()}</span>
            <span className="credits-plan">({planInfo.name} Plan)</span>
          </div>
          <div className="credits-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${getCreditUsagePercentage()}%` }}></div>
            </div>
            <span className="progress-text">{Math.round(getCreditUsagePercentage())}% used this month</span>
          </div>
        </div>

        {currentPlan === "free" && (
          <button className="upgrade-btn" onClick={() => setShowUpgradeOptions(!showUpgradeOptions)}>
            <i className="fas fa-arrow-up"></i>
            Upgrade Plan
          </button>
        )}
      </div>

      {/* Upgrade Options */}
      <AnimatePresence>
        {showUpgradeOptions && (
          <motion.div
            className="upgrade-options"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3>Choose Your Plan</h3>
            <div className="plan-options">
              <div className="plan-option" onClick={() => handleUpgradePlan("pro")}>
                <h4>Pro Plan</h4>
                <p>2,000 credits/month</p>
                <span className="plan-price">$20/month</span>
              </div>
              <div className="plan-option" onClick={() => handleUpgradePlan("super")}>
                <h4>Super Plan</h4>
                <p>5,000 credits/month</p>
                <span className="plan-price">$60/month</span>
              </div>
              <div className="plan-option" onClick={() => handleUpgradePlan("business")}>
                <h4>Business Plan</h4>
                <p>15,000 credits/month</p>
                <span className="plan-price">$200/month</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <p>Generating upload link and preparing for backend processing...</p>
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
              <div className="credit-info">
                <p className="credit-cost">
                  Processing cost: {planInfo.processingCost.video} credits/min (video), {planInfo.processingCost.audio}{" "}
                  credits/min (audio)
                </p>
              </div>
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
          <p>A list of all the translations in your workspace (sorted by newest first)</p>
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
                <th className="col-credits">Credits Used</th>
                <th className="col-edit">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="7" className="empty-state">
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
                          {project.isDemo && <span className="demo-badge">DEMO</span>}
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
                      <span
                        className={`status-badge ${project.status === "processing" ? "processing" : project.status === "processed" ? "success" : "unknown"}`}
                      >
                        {project.status === "processing"
                          ? "PROCESSING"
                          : project.status === "processed"
                            ? "SUCCESS"
                            : "UNKNOWN"}
                      </span>
                    </td>
                    <td className="col-date">
                      <span className="date-text">{project.date}</span>
                    </td>
                    <td className="col-status">
                      <div className="status-cell">
                        <div
                          className={`status-indicator ${project.status === "processed" ? "completed" : project.status}`}
                        ></div>
                        <span className="status-text">
                          {project.status === "processed"
                            ? "Draft"
                            : project.status === "processing"
                              ? "Processing"
                              : "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="col-credits">
                      <span className="credits-used">{project.creditsUsed || 0}</span>
                    </td>
                    <td className="col-edit">
                      <div className="edit-actions">
                        {project.status === "processing" ? (
                          <button className="processing-button" disabled>
                            <i className="fas fa-spinner fa-spin"></i>
                            Processing...
                          </button>
                        ) : project.status === "processed" ? (
                          <>
                            <button className="edit-button" onClick={() => openEditor(project)} title="Edit project">
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => deleteProject(project.id)}
                              title="Delete project"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Teams Dialog */}
      <AnimatePresence>
        {showTeamsDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTeamsDialog(false)}
          >
            <motion.div
              className="teams-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Organization Teams</h3>
                <button className="dialog-close" onClick={() => setShowTeamsDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="teams-content">
                <div className="teams-table">
                  <div className="teams-table-header">
                    <div className="teams-header-cell">Row</div>
                    <div className="teams-header-cell">Team Name</div>
                    <div className="teams-header-cell">View Team</div>
                    <div className="teams-header-cell">Created On</div>
                  </div>

                  <div className="teams-table-body">
                    {teams.map((team, index) => (
                      <div key={team.id} className="teams-table-row">
                        <div className="teams-cell">{index + 1}</div>
                        <div className="teams-cell">
                          {team.name}
                          {team.isWorkspace && <span className="workspace-badge">Workspace</span>}
                        </div>
                        <div className="teams-cell">
                          <button className="view-team-btn">View</button>
                        </div>
                        <div className="teams-cell">{team.createdOn}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="teams-actions">
                  <button className="create-team-btn" onClick={() => setShowCreateTeamDialog(true)}>
                    <i className="fas fa-users"></i>
                    Create Team
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Team Dialog */}
      <AnimatePresence>
        {showCreateTeamDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateTeamDialog(false)}
          >
            <motion.div
              className="create-team-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Create New Team</h3>
                <button className="dialog-close" onClick={() => setShowCreateTeamDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="dialog-content">
                <p>Enter a name for your new team.</p>
                <div className="form-group">
                  <label>Team Name</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="team-name-input"
                  />
                </div>
              </div>

              <div className="dialog-actions">
                <button className="cancel-btn" onClick={() => setShowCreateTeamDialog(false)}>
                  Cancel
                </button>
                <button className="create-btn" onClick={handleCreateTeam}>
                  Create Team
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
