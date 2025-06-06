"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Editor.css"

const Editor = () => {
  const [project, setProject] = useState(null)
  const [subtitles, setSubtitles] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [currentTime, setCurrentTime] = useState(2)
  const [duration, setDuration] = useState(176) // 2:56 in seconds to match your images
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [volume, setVolume] = useState(70)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  // History management for undo/redo
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false)

  // Waveform and zoom
  const [zoomLevel, setZoomLevel] = useState(100) // 10-500%
  const [selectedSubtitleId, setSelectedSubtitleId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)

  // Dialog states
  const [showAddSpeakerDialog, setShowAddSpeakerDialog] = useState(false)
  const [showEditSpeakerDialog, setShowEditSpeakerDialog] = useState(false)
  const [showChangeSpeakerDialog, setShowChangeSpeakerDialog] = useState(false)
  const [showMarkCompleteDialog, setShowMarkCompleteDialog] = useState(false)
  const [editingSpeaker, setEditingSpeaker] = useState(null)
  const [changingSubtitleId, setChangingSubtitleId] = useState(null)
  const [newSpeakerName, setNewSpeakerName] = useState("")
  const [selectedSpeaker, setSelectedSpeaker] = useState("")

  // Settings state
  const [settings, setSettings] = useState({
    includeSpeakerNames: true,
    maxCharacters: 82,
    maxLines: 3,
    minDuration: 0.5,
    maxDuration: 5,
  })

  const audioRef = useRef(null)
  const navigate = useNavigate()
  const waveformRef = useRef(null)

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

  useEffect(() => {
    // Load current project from localStorage or API
    const currentProject = localStorage.getItem("currentProject")
    if (currentProject) {
      const projectData = JSON.parse(currentProject)
      setProject(projectData)
      loadProjectData(projectData)
    } else {
      navigate("/workspace")
    }
  }, [navigate])

  const loadProjectData = async (projectData) => {
    try {
      // Sample speakers data
      const sampleSpeakers = [
        { id: 0, name: "Speaker 0" },
        { id: 1, name: "Narrator" },
      ]

      // Sample subtitles matching the timeline images
      const sampleSubtitles = [
        {
          id: 1,
          startTime: "00:00:00",
          endTime: "00:00:05",
          startSeconds: 0,
          endSeconds: 5,
          speakerId: 0,
          text: "Did you know that Tupac's mother, Afeni Shakur, was an active member of the Black Panther",
          characters: 89,
          duration: "5.0",
        },
        {
          id: 2,
          startTime: "00:00:05",
          endTime: "00:00:12",
          startSeconds: 5,
          endSeconds: 12,
          speakerId: 0,
          text: "Party and named him after Tupac Amaru the second, an eighteenth century politician",
          characters: 85,
          duration: "7.0",
        },
        {
          id: 3,
          startTime: "00:00:12",
          endTime: "00:00:18",
          startSeconds: 12,
          endSeconds: 18,
          speakerId: 1,
          text: "from Peru? Additionally, Tupac studied poetry and literature extensively during his",
          characters: 82,
          duration: "6.0",
        },
        {
          id: 4,
          startTime: "00:00:18",
          endTime: "00:00:22",
          startSeconds: 18,
          endSeconds: 22,
          speakerId: 1,
          text: "time in the Baltimore School for the Arts and",
          characters: 48,
          duration: "4.0",
        },
      ]

      setSpeakers(sampleSpeakers)
      setSubtitles(sampleSubtitles)

      // Initialize history with current state
      const initialState = {
        subtitles: sampleSubtitles,
        speakers: sampleSpeakers,
        settings: settings,
        timestamp: Date.now(),
        action: "Initial Load",
      }
      setHistory([initialState])
      setHistoryIndex(0)
    } catch (error) {
      console.error("Error loading project data:", error)
    }
  }

  // History management functions
  const saveToHistory = useCallback(
    (action, newSubtitles = subtitles, newSpeakers = speakers, newSettings = settings) => {
      if (isUndoRedoAction) return

      const newState = {
        subtitles: JSON.parse(JSON.stringify(newSubtitles)),
        speakers: JSON.parse(JSON.stringify(newSpeakers)),
        settings: JSON.parse(JSON.stringify(newSettings)),
        timestamp: Date.now(),
        action,
      }

      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(newState)
        return newHistory.slice(-50) // Keep last 50 states
      })
      setHistoryIndex((prev) => Math.min(prev + 1, 49))
      setHasUnsavedChanges(true)
    },
    [subtitles, speakers, settings, historyIndex, isUndoRedoAction],
  )

  const handleUndo = () => {
    if (historyIndex > 0) {
      setIsUndoRedoAction(true)
      const prevState = history[historyIndex - 1]
      setSubtitles(prevState.subtitles)
      setSpeakers(prevState.speakers)
      setSettings(prevState.settings)
      setHistoryIndex(historyIndex - 1)
      setHasUnsavedChanges(true)
      setTimeout(() => setIsUndoRedoAction(false), 100)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setIsUndoRedoAction(true)
      const nextState = history[historyIndex + 1]
      setSubtitles(nextState.subtitles)
      setSpeakers(nextState.speakers)
      setSettings(nextState.settings)
      setHistoryIndex(historyIndex + 1)
      setHasUnsavedChanges(true)
      setTimeout(() => setIsUndoRedoAction(false), 100)
    }
  }

  const getSpeakerName = (speakerId) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    return speaker ? speaker.name : `Speaker ${speakerId}`
  }

  const handleExport = async (format) => {
    try {
      // Apply settings to export
      const exportData = {
        subtitles: subtitles.map((sub) => ({
          ...sub,
          text: settings.includeSpeakerNames ? `${getSpeakerName(sub.speakerId)}: ${sub.text}` : sub.text,
          // Apply character limit
          text:
            sub.text.length > settings.maxCharacters ? sub.text.substring(0, settings.maxCharacters) + "..." : sub.text,
        })),
        settings,
        format,
      }

      // API call for export
      // const response = await fetch('/api/export', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(exportData)
      // })

      console.log(`Exporting as ${format} with settings:`, exportData)
      setShowExportMenu(false)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const handleSubtitleEdit = async (id, newText) => {
    // Apply character limit from settings
    const limitedText = newText.length > settings.maxCharacters ? newText.substring(0, settings.maxCharacters) : newText

    const updatedSubtitles = subtitles.map((sub) =>
      sub.id === id
        ? {
            ...sub,
            text: limitedText,
            characters: limitedText.length,
          }
        : sub,
    )

    setSubtitles(updatedSubtitles)
    saveToHistory(`Edit subtitle ${id}`, updatedSubtitles)

    // Auto-save to backend
    try {
      // await fetch(`/api/subtitles/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: limitedText, settings })
      // })
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const splitSubtitle = async (id, type) => {
    try {
      const subtitle = subtitles.find((s) => s.id === id)
      if (!subtitle || !subtitle.text.trim()) return

      const newSubtitles = [...subtitles]
      const index = newSubtitles.findIndex((s) => s.id === id)

      if (type === "word") {
        // Split at the middle word
        const words = subtitle.text.split(" ")
        const midPoint = Math.ceil(words.length / 2)
        const firstHalf = words.slice(0, midPoint).join(" ")
        const secondHalf = words.slice(midPoint).join(" ")

        const midTime = subtitle.startSeconds + (subtitle.endSeconds - subtitle.startSeconds) / 2

        newSubtitles[index] = {
          ...subtitle,
          text: firstHalf,
          endSeconds: midTime,
          endTime: formatSecondsToTime(midTime),
          characters: firstHalf.length,
        }

        newSubtitles.splice(index + 1, 0, {
          ...subtitle,
          id: Math.max(...subtitles.map((s) => s.id)) + 1,
          text: secondHalf,
          startSeconds: midTime,
          startTime: formatSecondsToTime(midTime),
          characters: secondHalf.length,
        })
      } else if (type === "half") {
        // Split text in half
        const midPoint = Math.ceil(subtitle.text.length / 2)
        const firstHalf = subtitle.text.substring(0, midPoint)
        const secondHalf = subtitle.text.substring(midPoint)

        const midTime = subtitle.startSeconds + (subtitle.endSeconds - subtitle.startSeconds) / 2

        newSubtitles[index] = {
          ...subtitle,
          text: firstHalf,
          endSeconds: midTime,
          endTime: formatSecondsToTime(midTime),
          characters: firstHalf.length,
        }

        newSubtitles.splice(index + 1, 0, {
          ...subtitle,
          id: Math.max(...subtitles.map((s) => s.id)) + 1,
          text: secondHalf,
          startSeconds: midTime,
          startTime: formatSecondsToTime(midTime),
          characters: secondHalf.length,
        })
      }

      setSubtitles(newSubtitles)
      saveToHistory(`Split subtitle ${id} by ${type}`, newSubtitles)

      // API call to split subtitle
      // await fetch(`/api/subtitles/${id}/split`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type, newSubtitles })
      // })
    } catch (error) {
      console.error("Split error:", error)
    }
  }

  const mergeWithAbove = async (id) => {
    try {
      const currentIndex = subtitles.findIndex((s) => s.id === id)
      if (currentIndex <= 0) return

      const currentSubtitle = subtitles[currentIndex]
      const aboveSubtitle = subtitles[currentIndex - 1]

      const mergedText = `${aboveSubtitle.text} ${currentSubtitle.text}`

      const newSubtitles = [...subtitles]
      newSubtitles[currentIndex - 1] = {
        ...aboveSubtitle,
        text: mergedText,
        endSeconds: currentSubtitle.endSeconds,
        endTime: currentSubtitle.endTime,
        characters: mergedText.length,
      }

      newSubtitles.splice(currentIndex, 1)

      setSubtitles(newSubtitles)
      saveToHistory(`Merge subtitle ${id} with above`, newSubtitles)

      // API call to merge subtitles
      // await fetch(`/api/subtitles/${id}/merge`, {
      //   method: 'POST',
      //   body: JSON.stringify({ newSubtitles })
      // })
    } catch (error) {
      console.error("Merge error:", error)
    }
  }

  const formatSecondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSaveChanges = async () => {
    try {
      // Save all changes to backend
      // await fetch(`/api/projects/${project.id}/save`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     subtitles,
      //     speakers,
      //     settings,
      //     timestamp: Date.now()
      //   })
      // })

      setHasUnsavedChanges(false)
      console.log("All changes saved successfully")
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const handleMarkComplete = async () => {
    setShowMarkCompleteDialog(true)
  }

  const confirmMarkComplete = async () => {
    try {
      // Save final state and mark as complete
      // await fetch(`/api/projects/${project.id}/complete`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     subtitles,
      //     speakers,
      //     settings,
      //     completedAt: new Date().toISOString()
      //   })
      // })

      setShowMarkCompleteDialog(false)
      navigate("/workspace") // Navigate to dashboard
    } catch (error) {
      console.error("Complete error:", error)
    }
  }

  const handleAddSpeaker = async () => {
    if (!newSpeakerName.trim()) return

    try {
      const newSpeaker = {
        id: speakers.length,
        name: newSpeakerName.trim(),
      }

      const newSpeakers = [...speakers, newSpeaker]
      setSpeakers(newSpeakers)
      saveToHistory("Add speaker", subtitles, newSpeakers)
      setNewSpeakerName("")
      setShowAddSpeakerDialog(false)

      // API call to add speaker
      // await fetch('/api/speakers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newSpeaker)
      // })
    } catch (error) {
      console.error("Add speaker error:", error)
    }
  }

  const handleEditSpeaker = async () => {
    if (!newSpeakerName.trim() || !editingSpeaker) return

    try {
      const updatedSpeakers = speakers.map((speaker) =>
        speaker.id === editingSpeaker.id ? { ...speaker, name: newSpeakerName.trim() } : speaker,
      )

      setSpeakers(updatedSpeakers)
      saveToHistory("Edit speaker", subtitles, updatedSpeakers)
      setNewSpeakerName("")
      setEditingSpeaker(null)
      setShowEditSpeakerDialog(false)

      // API call to update speaker
      // await fetch(`/api/speakers/${editingSpeaker.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: newSpeakerName.trim() })
      // })
    } catch (error) {
      console.error("Edit speaker error:", error)
    }
  }

  const handleChangeSpeaker = async () => {
    if (!selectedSpeaker || !changingSubtitleId) return

    try {
      const speakerId = Number.parseInt(selectedSpeaker)
      const updatedSubtitles = subtitles.map((subtitle) =>
        subtitle.id === changingSubtitleId ? { ...subtitle, speakerId } : subtitle,
      )

      setSubtitles(updatedSubtitles)
      saveToHistory("Change speaker", updatedSubtitles)
      setSelectedSpeaker("")
      setChangingSubtitleId(null)
      setShowChangeSpeakerDialog(false)

      // API call to update subtitle speaker
      // await fetch(`/api/subtitles/${changingSubtitleId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ speakerId })
      // })
    } catch (error) {
      console.error("Change speaker error:", error)
    }
  }

  const handleSettingsChange = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    saveToHistory("Update settings", subtitles, speakers, newSettings)
  }

  const openEditSpeakerDialog = (speaker) => {
    setEditingSpeaker(speaker)
    setNewSpeakerName(speaker.name)
    setShowEditSpeakerDialog(true)
  }

  const openChangeSpeakerDialog = (subtitleId, currentSpeakerId) => {
    setChangingSubtitleId(subtitleId)
    setSelectedSpeaker(currentSpeakerId.toString())
    setShowChangeSpeakerDialog(true)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // Audio control logic here
  }

  const handleSeek = (seconds) => {
    setCurrentTime(seconds)
    // Audio seek logic here
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatTimeShort = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Waveform functions
  const handleZoomChange = (newZoom) => {
    setZoomLevel(Math.max(10, Math.min(500, newZoom)))
  }

  const handleSubtitleDragStart = (e, subtitleId) => {
    setSelectedSubtitleId(subtitleId)
    setIsDragging(true)
    setDragStartX(e.clientX)
  }

  const handleSubtitleDrag = (e) => {
    if (!isDragging || !selectedSubtitleId) return

    const deltaX = e.clientX - dragStartX
    const timePerPixel = duration / (waveformRef.current?.offsetWidth || 1000)
    const timeDelta = (deltaX * timePerPixel) / (zoomLevel / 100)

    // Update subtitle timing
    const updatedSubtitles = subtitles.map((sub) => {
      if (sub.id === selectedSubtitleId) {
        const newStartSeconds = Math.max(0, sub.startSeconds + timeDelta)
        const newEndSeconds = Math.min(duration, sub.endSeconds + timeDelta)
        return {
          ...sub,
          startSeconds: newStartSeconds,
          endSeconds: newEndSeconds,
          startTime: formatSecondsToTime(newStartSeconds),
          endTime: formatSecondsToTime(newEndSeconds),
        }
      }
      return sub
    })

    setSubtitles(updatedSubtitles)
    setHasUnsavedChanges(true)
  }

  const handleSubtitleDragEnd = () => {
    if (isDragging && selectedSubtitleId) {
      saveToHistory(`Move subtitle ${selectedSubtitleId}`)
    }
    setIsDragging(false)
    setSelectedSubtitleId(null)
    setDragStartX(0)
  }

  if (!project) {
    return (
      <div className="editor-loading">
        <div className="loading-spinner"></div>
        <p>Loading project...</p>
      </div>
    )
  }

  return (
    <div className="editor-container">
      {/* Header */}
      <header className="editor-header">
        <div className="video-title">
          {project.name.length > 30 ? `${project.name.substring(0, 30)}...` : project.name}
        </div>
        <div className="header-controls">
          <button className="help-button" title="Help">
            <i className="fas fa-question-circle"></i>
          </button>
          <div className="saved-status">
            {hasUnsavedChanges ? (
              <button className="save-changes-btn" onClick={handleSaveChanges}>
                <i className="fas fa-save"></i> Save Changes
              </button>
            ) : (
              <>
                Saved{" "}
                <span className="saved-icon">
                  <i className="fas fa-check"></i>
                </span>
              </>
            )}
          </div>
          <button className="mark-complete-button" onClick={handleMarkComplete}>
            <i className="fas fa-check"></i> Mark as Complete
          </button>
          <div className="history-controls">
            <button
              className="undo-button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title={historyIndex > 0 ? `Undo: ${history[historyIndex]?.action}` : "Nothing to undo"}
            >
              <i className="fas fa-undo"></i> Undo
            </button>
            <button
              className="redo-button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title={
                historyIndex < history.length - 1 ? `Redo: ${history[historyIndex + 1]?.action}` : "Nothing to redo"
              }
            >
              <i className="fas fa-redo"></i> Redo
            </button>
          </div>
          <div className="export-dropdown">
            <button className="export-button" onClick={() => setShowExportMenu(!showExportMenu)}>
              <i className="fas fa-download"></i> Export Subtitles
            </button>

            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  className="export-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button onClick={() => handleExport("json")}>Export JSON</button>
                  <button onClick={() => handleExport("vtt")}>Export VTT</button>
                  <button onClick={() => handleExport("srt")}>Export SRT</button>
                  <button onClick={() => handleExport("transcript")}>Export Transcript</button>
                  <button onClick={() => handleExport("doc")}>Export Doc</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="editor-nav">
        <button
          className={`nav-tab ${activeTab === "content" ? "active" : ""}`}
          onClick={() => setActiveTab("content")}
        >
          <i className="fas fa-align-left"></i>
          Content Editor
        </button>
        <button
          className={`nav-tab ${activeTab === "speakers" ? "active" : ""}`}
          onClick={() => setActiveTab("speakers")}
        >
          <i className="fas fa-users"></i>
          Speakers
        </button>
        <button
          className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <i className="fas fa-cog"></i>
          Settings
        </button>
      </div>

      {/* Main Content Area */}
      <div className="editor-main">
        {/* Content Editor Tab */}
        {activeTab === "content" && (
          <div className="content-tab">
            {/* Left Side - Subtitles */}
            <div className="subtitles-section">
              <div className="subtitles-list">
                {subtitles.map((subtitle, index) => (
                  <div key={subtitle.id} className="subtitle-entry">
                    <div className="subtitle-header">
                      <div className="subtitle-number">
                        ({subtitle.id}/{subtitles.length}) <i className="fas fa-play"></i>
                      </div>
                      <div className="subtitle-actions">
                        <button className="action-btn" onClick={() => splitSubtitle(subtitle.id, "word")}>
                          <i className="fas fa-cut"></i> Split at word
                        </button>
                        <button className="action-btn" onClick={() => splitSubtitle(subtitle.id, "half")}>
                          <i className="fas fa-cut"></i> Split into half
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => mergeWithAbove(subtitle.id)}
                          disabled={index === 0}
                        >
                          <i className="fas fa-arrow-up"></i> Merge with above
                        </button>
                      </div>
                    </div>

                    <div className="subtitle-content">
                      <div className="speaker-section">
                        <div className="speaker-icon">
                          <i className="fas fa-user"></i>
                        </div>
                        <button
                          className="speaker-label clickable"
                          onClick={() => openChangeSpeakerDialog(subtitle.id, subtitle.speakerId)}
                        >
                          {getSpeakerName(subtitle.speakerId)}
                        </button>
                      </div>

                      <div className="text-section">
                        <textarea
                          className="subtitle-textarea"
                          value={subtitle.text}
                          onChange={(e) => handleSubtitleEdit(subtitle.id, e.target.value)}
                          placeholder="Enter subtitle text..."
                          maxLength={settings.maxCharacters}
                        />
                        <div className="character-count">
                          {subtitle.text.length}/{settings.maxCharacters}
                        </div>
                      </div>

                      <div className="timing-section">
                        <div className="time-start">
                          <div className="time-value">{subtitle.startTime}</div>
                          <div className="time-chars">{subtitle.duration}</div>
                        </div>
                        <div className="time-end">
                          <div className="time-value">{subtitle.endTime}</div>
                          <div className="time-chars">{subtitle.characters > 0 ? "140" : ""}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Enhanced Audio Player */}
            <div className="audio-section">
              <div className="audio-player-widget">
                <div className="audio-player-content">
                  <button className="audio-play-btn" onClick={handlePlayPause}>
                    <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
                  </button>

                  <div className="audio-info">
                    <div className="audio-time">
                      {formatTimeShort(currentTime)} / {formatTimeShort(duration)}
                    </div>
                    <div className="audio-progress">
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="audio-controls">
                    <button className="audio-control-btn">
                      <i className="fas fa-volume-up"></i>
                    </button>
                    <button className="audio-control-btn">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Speakers Tab */}
        {activeTab === "speakers" && (
          <div className="speakers-tab">
            <div className="speakers-header">
              <h2>Speakers</h2>
              <p className="speakers-description">
                Manage speakers for your subtitle project. Changes will affect all subtitles.
              </p>
            </div>
            <div className="speakers-list">
              {speakers.map((speaker, index) => (
                <div key={speaker.id} className="speaker-item">
                  <div className="speaker-info">
                    <span className="speaker-number">{index + 1}.</span>
                    <span className="speaker-name">{speaker.name}</span>
                    <span className="speaker-usage">
                      {subtitles.filter((s) => s.speakerId === speaker.id).length} subtitles
                    </span>
                  </div>
                  <button className="edit-speaker-btn" onClick={() => openEditSpeakerDialog(speaker)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              ))}
            </div>
            <button className="add-speaker-btn" onClick={() => setShowAddSpeakerDialog(true)}>
              <i className="fas fa-plus"></i>
              Add Speaker
            </button>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="settings-tab">
            <div className="settings-header">
              <h2>Settings</h2>
              <p className="settings-description">Configure how your subtitles are generated and exported.</p>
            </div>

            <div className="settings-section">
              <div className="setting-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={settings.includeSpeakerNames}
                    onChange={(e) => handleSettingsChange("includeSpeakerNames", e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <div className="toggle-content">
                    <span className="toggle-title">Include Speaker names in Subtitles</span>
                    <span className="toggle-description">Add speaker names before subtitle text in exports</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Guidelines</h3>
              <p className="section-description">These settings control subtitle formatting and validation.</p>

              <div className="settings-grid">
                <div className="setting-group">
                  <label>Max characters per section</label>
                  <select
                    value={settings.maxCharacters}
                    onChange={(e) => handleSettingsChange("maxCharacters", Number.parseInt(e.target.value))}
                  >
                    <option value={42}>42 characters</option>
                    <option value={64}>64 characters</option>
                    <option value={74}>74 characters</option>
                    <option value={82}>82 characters</option>
                    <option value={100}>100 characters</option>
                  </select>
                  <span className="setting-help">Limits text length per subtitle</span>
                </div>

                <div className="setting-group">
                  <label>Max lines per subtitle section</label>
                  <select
                    value={settings.maxLines}
                    onChange={(e) => handleSettingsChange("maxLines", Number.parseInt(e.target.value))}
                  >
                    <option value={1}>1 line</option>
                    <option value={2}>2 lines</option>
                    <option value={3}>3 lines</option>
                  </select>
                  <span className="setting-help">Maximum lines for subtitle display</span>
                </div>

                <div className="setting-group">
                  <label>Min duration per subtitle section (seconds)</label>
                  <select
                    value={settings.minDuration}
                    onChange={(e) => handleSettingsChange("minDuration", Number.parseFloat(e.target.value))}
                  >
                    <option value={0.5}>0.5 second</option>
                    <option value={1}>1 second</option>
                    <option value={1.5}>1.5 seconds</option>
                    <option value={2}>2 seconds</option>
                  </select>
                  <span className="setting-help">Minimum time each subtitle must be shown</span>
                </div>

                <div className="setting-group">
                  <label>Max duration per subtitle section (seconds)</label>
                  <select
                    value={settings.maxDuration}
                    onChange={(e) => handleSettingsChange("maxDuration", Number.parseFloat(e.target.value))}
                  >
                    <option value={3}>3 seconds</option>
                    <option value={4}>4 seconds</option>
                    <option value={5}>5 seconds</option>
                    <option value={6}>6 seconds</option>
                    <option value={8}>8 seconds</option>
                  </select>
                  <span className="setting-help">Maximum time each subtitle can be shown</span>
                </div>
              </div>
            </div>

            <div className="settings-preview">
              <h4>Preview</h4>
              <div className="preview-subtitle">
                {settings.includeSpeakerNames && <span className="preview-speaker">Speaker 0: </span>}
                <span className="preview-text">
                  {subtitles[0]?.text.substring(0, settings.maxCharacters) || "Sample subtitle text"}
                  {subtitles[0]?.text.length > settings.maxCharacters && "..."}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Section */}
      <div className="timeline-section">
        {/* Playback Controls */}
        <div className="playback-controls">
          <button className="control-btn">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="control-btn">
            <i className="fas fa-backward"></i>
          </button>
          <button className="control-btn play-main" onClick={handlePlayPause}>
            <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
          </button>
          <button className="control-btn">
            <i className="fas fa-forward"></i>
          </button>
          <button className="control-btn">
            <i className="fas fa-step-forward"></i>
          </button>
          <div className="beta-badge">Beta</div>
        </div>

        {/* Time Display */}
        <div className="time-display-section">
          <div className="time-current">
            <div className="time-labels">
              <span>HH</span>
              <span>MM</span>
              <span>SS</span>
            </div>
            <div className="time-value">{formatTime(currentTime)}</div>
            <div className="time-frame">344</div>
          </div>
          <div className="time-separator">/</div>
          <div className="time-total">
            <div className="time-value">{formatTime(duration)}</div>
            <div className="time-frame">770</div>
          </div>
        </div>

        {/* Enhanced Zoom Controls */}
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => handleZoomChange(zoomLevel - 10)} disabled={zoomLevel <= 10}>
            <i className="fas fa-search-minus"></i>
          </button>
          <div className="zoom-display">
            <input
              type="range"
              className="zoom-slider"
              min="10"
              max="500"
              value={zoomLevel}
              onChange={(e) => handleZoomChange(Number.parseInt(e.target.value))}
            />
            <span className="zoom-value">{zoomLevel}%</span>
          </div>
          <button className="zoom-btn" onClick={() => handleZoomChange(zoomLevel + 10)} disabled={zoomLevel >= 500}>
            <i className="fas fa-search-plus"></i>
          </button>
        </div>
      </div>

      {/* Enhanced Waveform Timeline */}
      <div className="waveform-container" ref={waveformRef}>
        <div className="timeline-markers" style={{ transform: `scaleX(${zoomLevel / 100})` }}>
          {Array.from({ length: Math.ceil(duration * (zoomLevel / 100)) }, (_, i) => (
            <div key={i} className="timeline-marker">
              <div className="marker-tick"></div>
              <div className="marker-label">{formatTimeShort(i / (zoomLevel / 100))}</div>
            </div>
          ))}
        </div>
        <div className="waveform-content" onMouseMove={handleSubtitleDrag} onMouseUp={handleSubtitleDragEnd}>
          {subtitles.map((subtitle) => {
            const leftPercent = (subtitle.startSeconds / duration) * 100 * (zoomLevel / 100)
            const widthPercent = ((subtitle.endSeconds - subtitle.startSeconds) / duration) * 100 * (zoomLevel / 100)

            return (
              <div
                key={subtitle.id}
                className={`waveform-block ${selectedSubtitleId === subtitle.id ? "selected" : ""}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${widthPercent}%`,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                onMouseDown={(e) => handleSubtitleDragStart(e, subtitle.id)}
                onClick={() => handleSeek(subtitle.startSeconds)}
              >
                <div className="block-text">{subtitle.text}</div>
                <div className="block-handles">
                  <div className="handle-left"></div>
                  <div className="handle-right"></div>
                </div>
              </div>
            )
          })}
          <div
            className="timeline-cursor"
            style={{ left: `${(currentTime / duration) * 100 * (zoomLevel / 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
        {/* Add Speaker Dialog */}
        {showAddSpeakerDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddSpeakerDialog(false)}
          >
            <motion.div
              className="dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Add Speaker</h3>
                <button className="dialog-close" onClick={() => setShowAddSpeakerDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="dialog-content">
                <p>Add a new speaker for the subtitle.</p>
                <div className="form-group">
                  <label>New Speaker Name</label>
                  <input
                    type="text"
                    value={newSpeakerName}
                    onChange={(e) => setNewSpeakerName(e.target.value)}
                    placeholder="Enter speaker name"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSpeaker()}
                  />
                </div>
              </div>
              <div className="dialog-actions">
                <button className="btn-primary" onClick={handleAddSpeaker}>
                  Add Speaker
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Speaker Dialog */}
        {showEditSpeakerDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEditSpeakerDialog(false)}
          >
            <motion.div
              className="dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Edit Speaker</h3>
                <button className="dialog-close" onClick={() => setShowEditSpeakerDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="dialog-content">
                <p>Update a speaker's name for the subtitle.</p>
                <div className="form-group">
                  <label>New Speaker Name</label>
                  <input
                    type="text"
                    value={newSpeakerName}
                    onChange={(e) => setNewSpeakerName(e.target.value)}
                    placeholder="Enter speaker name"
                    onKeyPress={(e) => e.key === "Enter" && handleEditSpeaker()}
                  />
                </div>
              </div>
              <div className="dialog-actions">
                <button className="btn-primary" onClick={handleEditSpeaker}>
                  Update Speaker
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Change Speaker Dialog */}
        {showChangeSpeakerDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowChangeSpeakerDialog(false)}
          >
            <motion.div
              className="dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Change Speaker</h3>
                <button className="dialog-close" onClick={() => setShowChangeSpeakerDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="dialog-content">
                <p>Change the speaker for the subtitle.</p>
                <div className="form-group">
                  <label>Select Speaker</label>
                  <select value={selectedSpeaker} onChange={(e) => setSelectedSpeaker(e.target.value)}>
                    {speakers.map((speaker) => (
                      <option key={speaker.id} value={speaker.id}>
                        {speaker.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="dialog-actions">
                <button className="btn-primary" onClick={handleChangeSpeaker}>
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Mark Complete Dialog */}
        {showMarkCompleteDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMarkCompleteDialog(false)}
          >
            <motion.div
              className="dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Mark Project as Complete</h3>
                <button className="dialog-close" onClick={() => setShowMarkCompleteDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="dialog-content">
                <p>Are you sure you want to mark this project as complete?</p>
                <p className="dialog-warning">This will save all changes and finalize the project.</p>
              </div>
              <div className="dialog-actions">
                <button className="btn-secondary" onClick={() => setShowMarkCompleteDialog(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={confirmMarkComplete}>
                  Yes, mark as complete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Editor
