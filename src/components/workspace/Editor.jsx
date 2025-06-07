"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Editor.css"

const Editor = () => {
  const [project, setProject] = useState(null)
  const [subtitles, setSubtitles] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(176) // Will be set from project data
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [volume, setVolume] = useState(70)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  // Media player states
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isVideo, setIsVideo] = useState(false)
  const [isAudio, setIsAudio] = useState(false)

  // History management for undo/redo
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false)

  // Waveform and zoom
  const [zoomLevel, setZoomLevel] = useState(100) // 10-500%
  const [selectedSubtitleId, setSelectedSubtitleId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null) // 'left' or 'right'

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
    fontSize: 16,
    fontFamily: "Arial",
    textColor: "#ffffff",
    backgroundColor: "#000000",
    textAlign: "center",
  })

  const [tempSettings, setTempSettings] = useState(settings)

  const audioRef = useRef(null)
  const videoRef = useRef(null)
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
      // Set media information from project data
      if (projectData.fileData) {
        setIsVideo(projectData.fileData.isVideo)
        setIsAudio(projectData.fileData.isAudio)
        setDuration(projectData.fileData.durationSeconds || 176)

        // Create media URL for playback
        if (projectData.fileData.file) {
          const url = URL.createObjectURL(projectData.fileData.file)
          setMediaUrl(url)
        }
      }

      // Sample speakers data
      const sampleSpeakers = [
        { id: 0, name: "Speaker 0", color: "#3b82f6" },
        { id: 1, name: "Narrator", color: "#10b981" },
        { id: 2, name: "Interviewer", color: "#f59e0b" },
      ]

      // Generate 15 sample subtitles for demonstration
      // In production, this will come from backend API response
      const sampleSubtitles = generateSampleSubtitles(projectData.fileData?.durationSeconds || 176)

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

      // Backend API integration point for loading subtitles
      // await loadSubtitlesFromBackend(projectData.id)
    } catch (error) {
      console.error("Error loading project data:", error)
    }
  }

  // Generate 15 sample subtitles distributed across the duration
  const generateSampleSubtitles = (totalDuration) => {
    const subtitleCount = 15
    const avgDuration = totalDuration / subtitleCount

    const sampleTexts = [
      "Did you know that Tupac's mother, Afeni Shakur, was an active member of the Black Panther",
      "Party and named him after Tupac Amaru the second, an eighteenth century politician",
      "from Peru? Additionally, Tupac studied poetry and literature extensively during his",
      "time in the Baltimore School for the Arts and",
      "developed a deep appreciation for Shakespeare and other classical writers.",
      "This literary background heavily influenced his later rap lyrics and",
      "contributed to the depth and complexity of his musical compositions.",
      "Tupac's ability to blend street wisdom with intellectual discourse",
      "made him one of the most respected and influential artists of his generation.",
      "His songs often addressed social issues, inequality, and the struggles",
      "of urban life, resonating with millions of listeners worldwide.",
      "Beyond music, Tupac was also an accomplished actor, appearing in several films",
      "that showcased his dramatic range and natural charisma on screen.",
      "His legacy continues to inspire new generations of artists and activists",
      "who seek to use their platforms for social change and awareness.",
    ]

    return Array.from({ length: subtitleCount }, (_, index) => {
      const startSeconds = Math.floor(index * avgDuration)
      const endSeconds = Math.floor((index + 1) * avgDuration)
      const text = sampleTexts[index] || `Subtitle ${index + 1} content goes here.`

      return {
        id: index + 1,
        startTime: formatSecondsToTime(startSeconds),
        endTime: formatSecondsToTime(endSeconds),
        startSeconds: startSeconds,
        endSeconds: endSeconds,
        speakerId: index % 3, // Rotate between speakers
        text: text,
        characters: text.length,
        duration: (endSeconds - startSeconds).toFixed(1),
      }
    })
  }

  // Backend API integration for loading subtitles
  const loadSubtitlesFromBackend = async (projectId) => {
    try {
      // This will be integrated by backend team
      // const response = await fetch(`/api/projects/${projectId}/subtitles`, {
      //   headers: {
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   }
      // })
      //
      // if (response.ok) {
      //   const data = await response.json()
      //   setSubtitles(data.subtitles)
      //   setSpeakers(data.speakers)
      // }
    } catch (error) {
      console.error("Error loading subtitles from backend:", error)
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

  // Media player controls
  const handlePlayPause = () => {
    const mediaElement = isVideo ? videoRef.current : audioRef.current
    if (mediaElement) {
      if (isPlaying) {
        mediaElement.pause()
      } else {
        mediaElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (seconds) => {
    setCurrentTime(seconds)
    const mediaElement = isVideo ? videoRef.current : audioRef.current
    if (mediaElement) {
      mediaElement.currentTime = seconds
    }
  }

  const handleTimeUpdate = () => {
    const mediaElement = isVideo ? videoRef.current : audioRef.current
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime)
    }
  }

  const handleMediaEnded = () => {
    setIsPlaying(false)
  }

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume)
    const mediaElement = isVideo ? videoRef.current : audioRef.current
    if (mediaElement) {
      mediaElement.volume = newVolume / 100
    }
  }

  // Navigation between subtitle blocks
  const goToPreviousSubtitle = () => {
    const currentSubtitleIndex = subtitles.findIndex(
      (sub) => currentTime >= sub.startSeconds && currentTime <= sub.endSeconds,
    )

    if (currentSubtitleIndex > 0) {
      handleSeek(subtitles[currentSubtitleIndex - 1].startSeconds)
    } else if (currentSubtitleIndex === -1 && subtitles.length > 0) {
      // If not in any subtitle, go to the last one before current time
      const previousSubtitle = subtitles.reverse().find((sub) => sub.endSeconds < currentTime)
      if (previousSubtitle) {
        handleSeek(previousSubtitle.startSeconds)
      }
    }
  }

  const goToNextSubtitle = () => {
    const currentSubtitleIndex = subtitles.findIndex(
      (sub) => currentTime >= sub.startSeconds && currentTime <= sub.endSeconds,
    )

    if (currentSubtitleIndex !== -1 && currentSubtitleIndex < subtitles.length - 1) {
      handleSeek(subtitles[currentSubtitleIndex + 1].startSeconds)
    } else if (currentSubtitleIndex === -1 && subtitles.length > 0) {
      // If not in any subtitle, go to the next one after current time
      const nextSubtitle = subtitles.find((sub) => sub.startSeconds > currentTime)
      if (nextSubtitle) {
        handleSeek(nextSubtitle.startSeconds)
      }
    }
  }

  // Waveform player controls
  const handleStepBackward = () => {
    handleSeek(Math.max(0, currentTime - 10))
  }

  const handleStepForward = () => {
    handleSeek(Math.min(duration, currentTime + 10))
  }

  const handleSkipBackward = () => {
    handleSeek(Math.max(0, currentTime - 30))
  }

  const handleSkipForward = () => {
    handleSeek(Math.min(duration, currentTime + 30))
  }

  const handleGoToStart = () => {
    handleSeek(0)
  }

  const handleGoToEnd = () => {
    handleSeek(duration)
  }

  // Enhanced drag and drop with resizing capability
  const handleSubtitleMouseDown = (e, subtitleId, handle = null) => {
    e.preventDefault()
    setSelectedSubtitleId(subtitleId)
    setDragStartX(e.clientX)
    setDragStartTime(currentTime)

    if (handle) {
      setIsResizing(true)
      setResizeHandle(handle)
    } else {
      setIsDragging(true)
    }

    // Add global mouse event listeners
    document.addEventListener("mousemove", handleSubtitleMouseMove)
    document.addEventListener("mouseup", handleSubtitleMouseUp)
  }

  const handleSubtitleMouseMove = useCallback(
    (e) => {
      if ((!isDragging && !isResizing) || !selectedSubtitleId || !waveformRef.current) return

      const deltaX = e.clientX - dragStartX
      const waveformWidth = waveformRef.current.offsetWidth
      const sensitivity = 0.3
      const timePerPixel = (duration / waveformWidth) * sensitivity
      const timeDelta = deltaX * timePerPixel

      if (isResizing) {
        // Handle resizing
        const updatedSubtitles = subtitles.map((sub) => {
          if (sub.id === selectedSubtitleId) {
            if (resizeHandle === "left") {
              const newStartSeconds = Math.max(0, sub.startSeconds + timeDelta)
              const newEndSeconds = Math.max(newStartSeconds + 0.5, sub.endSeconds)
              return {
                ...sub,
                startSeconds: newStartSeconds,
                endSeconds: newEndSeconds,
                startTime: formatSecondsToTime(newStartSeconds),
                endTime: formatSecondsToTime(newEndSeconds),
                duration: (newEndSeconds - newStartSeconds).toFixed(1),
              }
            } else if (resizeHandle === "right") {
              const newEndSeconds = Math.min(duration, Math.max(sub.startSeconds + 0.5, sub.endSeconds + timeDelta))
              return {
                ...sub,
                endSeconds: newEndSeconds,
                endTime: formatSecondsToTime(newEndSeconds),
                duration: (newEndSeconds - sub.startSeconds).toFixed(1),
              }
            }
          }
          return sub
        })
        setSubtitles(updatedSubtitles)
      } else if (isDragging) {
        // Handle dragging
        const updatedSubtitles = subtitles.map((sub) => {
          if (sub.id === selectedSubtitleId) {
            const newStartSeconds = Math.max(0, sub.startSeconds + timeDelta)
            const newEndSeconds = Math.max(newStartSeconds + 1, sub.endSeconds + timeDelta)
            const constrainedEndSeconds = Math.min(duration, newEndSeconds)

            return {
              ...sub,
              startSeconds: newStartSeconds,
              endSeconds: constrainedEndSeconds,
              startTime: formatSecondsToTime(newStartSeconds),
              endTime: formatSecondsToTime(constrainedEndSeconds),
              duration: (constrainedEndSeconds - newStartSeconds).toFixed(1),
            }
          }
          return sub
        })
        setSubtitles(updatedSubtitles)
      }

      setHasUnsavedChanges(true)
    },
    [isDragging, isResizing, selectedSubtitleId, dragStartX, duration, subtitles, resizeHandle],
  )

  const handleSubtitleMouseUp = useCallback(() => {
    if ((isDragging || isResizing) && selectedSubtitleId) {
      const action = isResizing ? `Resize subtitle ${selectedSubtitleId}` : `Move subtitle ${selectedSubtitleId}`
      saveToHistory(action)

      // Backend API call to update subtitle timing
      // updateSubtitleTiming(selectedSubtitleId, updatedTiming)
    }

    setIsDragging(false)
    setIsResizing(false)
    setSelectedSubtitleId(null)
    setResizeHandle(null)
    setDragStartX(0)
    setDragStartTime(0)

    // Remove global mouse event listeners
    document.removeEventListener("mousemove", handleSubtitleMouseMove)
    document.removeEventListener("mouseup", handleSubtitleMouseUp)
  }, [isDragging, isResizing, selectedSubtitleId, saveToHistory])

  // Backend API integration for subtitle timing updates
  const updateSubtitleTiming = async (subtitleId, timing) => {
    try {
      // Backend integration point
      // await fetch(`/api/subtitles/${subtitleId}/timing`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
      //   body: JSON.stringify(timing)
      // })
    } catch (error) {
      console.error("Error updating subtitle timing:", error)
    }
  }

  const getSpeakerName = (speakerId) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    return speaker ? speaker.name : `Speaker ${speakerId}`
  }

  const getSpeakerColor = (speakerId) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    return speaker ? speaker.color : "#3b82f6"
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
        projectId: project.id,
      }

      // Backend API call for export
      // const response = await fetch('/api/export', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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

    // Backend API call to save subtitle changes
    try {
      // await fetch(`/api/subtitles/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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
          duration: (midTime - subtitle.startSeconds).toFixed(1),
        }

        newSubtitles.splice(index + 1, 0, {
          ...subtitle,
          id: Math.max(...subtitles.map((s) => s.id)) + 1,
          text: secondHalf,
          startSeconds: midTime,
          startTime: formatSecondsToTime(midTime),
          characters: secondHalf.length,
          duration: (subtitle.endSeconds - midTime).toFixed(1),
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
          duration: (midTime - subtitle.startSeconds).toFixed(1),
        }

        newSubtitles.splice(index + 1, 0, {
          ...subtitle,
          id: Math.max(...subtitles.map((s) => s.id)) + 1,
          text: secondHalf,
          startSeconds: midTime,
          startTime: formatSecondsToTime(midTime),
          characters: secondHalf.length,
          duration: (subtitle.endSeconds - midTime).toFixed(1),
        })
      }

      setSubtitles(newSubtitles)
      saveToHistory(`Split subtitle ${id} by ${type}`, newSubtitles)

      // Backend API call to split subtitle
      // await fetch(`/api/subtitles/${id}/split`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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
        duration: (currentSubtitle.endSeconds - aboveSubtitle.startSeconds).toFixed(1),
      }

      newSubtitles.splice(currentIndex, 1)

      setSubtitles(newSubtitles)
      saveToHistory(`Merge subtitle ${id} with above`, newSubtitles)

      // Backend API call to merge subtitles
      // await fetch(`/api/subtitles/${id}/merge`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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
      // Backend API call to save all changes
      // await fetch(`/api/projects/${project.id}/save`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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
      // Backend API call to mark project as complete
      // await fetch(`/api/projects/${project.id}/complete`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
      const newSpeaker = {
        id: speakers.length,
        name: newSpeakerName.trim(),
        color: colors[speakers.length % colors.length],
      }

      const newSpeakers = [...speakers, newSpeaker]
      setSpeakers(newSpeakers)
      saveToHistory("Add speaker", subtitles, newSpeakers)
      setNewSpeakerName("")
      setShowAddSpeakerDialog(false)

      // Backend API call to add speaker
      // await fetch('/api/speakers', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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

      // Backend API call to update speaker
      // await fetch(`/api/speakers/${editingSpeaker.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
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

      // Backend API call to update subtitle speaker
      // await fetch(`/api/subtitles/${changingSubtitleId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
      //   body: JSON.stringify({ speakerId })
      // })
    } catch (error) {
      console.error("Change speaker error:", error)
    }
  }

  const handleTempSettingsChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplySettings = async () => {
    try {
      setSettings(tempSettings)
      saveToHistory("Apply settings", subtitles, speakers, tempSettings)

      // Apply settings to all subtitles
      const updatedSubtitles = subtitles.map((subtitle) => ({
        ...subtitle,
        text:
          subtitle.text.length > tempSettings.maxCharacters
            ? subtitle.text.substring(0, tempSettings.maxCharacters)
            : subtitle.text,
        characters: Math.min(subtitle.text.length, tempSettings.maxCharacters),
      }))

      setSubtitles(updatedSubtitles)

      // Backend API call to save settings
      // await fetch(`/api/projects/${project.id}/settings`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${getAuthToken()}`,
      //   },
      //   body: JSON.stringify(tempSettings)
      // })

      console.log("Settings applied successfully")
    } catch (error) {
      console.error("Apply settings error:", error)
    }
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

  // Cleanup media URL on unmount
  useEffect(() => {
    return () => {
      if (mediaUrl) {
        URL.revokeObjectURL(mediaUrl)
      }
    }
  }, [mediaUrl])

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
                        <div className="speaker-icon" style={{ backgroundColor: getSpeakerColor(subtitle.speakerId) }}>
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
                          <div className="time-chars">{subtitle.duration}s</div>
                        </div>
                        <div className="time-end">
                          <div className="time-value">{subtitle.endTime}</div>
                          <div className="time-chars">{subtitle.characters} chars</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Dynamic Media Player */}
            <div className="media-section">
              {isVideo && mediaUrl ? (
                <div className="video-player-widget">
                  <video
                    ref={videoRef}
                    src={mediaUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleMediaEnded}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration)
                        videoRef.current.volume = volume / 100
                      }
                    }}
                    className="video-element"
                  />
                  <div className="video-controls">
                    <button className="video-control-btn" onClick={goToPreviousSubtitle} title="Previous subtitle">
                      <i className="fas fa-step-backward"></i>
                    </button>
                    <button className="video-play-btn" onClick={handlePlayPause}>
                      <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
                    </button>
                    <button className="video-control-btn" onClick={goToNextSubtitle} title="Next subtitle">
                      <i className="fas fa-step-forward"></i>
                    </button>
                    <div className="video-info">
                      <div className="video-time">
                        {formatTimeShort(currentTime)} / {formatTimeShort(duration)}
                      </div>
                      <div className="video-progress">
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="video-volume">
                      <button className="volume-btn">
                        <i className="fas fa-volume-up"></i>
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolumeChange(Number.parseInt(e.target.value))}
                        className="volume-slider"
                      />
                    </div>
                  </div>
                </div>
              ) : isAudio && mediaUrl ? (
                <div className="audio-player-widget">
                  <audio
                    ref={audioRef}
                    src={mediaUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleMediaEnded}
                    onLoadedMetadata={() => {
                      if (audioRef.current) {
                        setDuration(audioRef.current.duration)
                        audioRef.current.volume = volume / 100
                      }
                    }}
                  />
                  <div className="audio-player-content">
                    <button className="audio-control-btn" onClick={goToPreviousSubtitle} title="Previous subtitle">
                      <i className="fas fa-step-backward"></i>
                    </button>
                    <button className="audio-play-btn" onClick={handlePlayPause}>
                      <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
                    </button>
                    <button className="audio-control-btn" onClick={goToNextSubtitle} title="Next subtitle">
                      <i className="fas fa-step-forward"></i>
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
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolumeChange(Number.parseInt(e.target.value))}
                        className="volume-slider"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="media-placeholder">
                  <div className="placeholder-content">
                    <i className="fas fa-file-audio"></i>
                    <p>Media player will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Speakers Tab */}
        {activeTab === "speakers" && (
          <div className="speakers-tab">
            <div className="speakers-header">
              <div className="header-content">
                <h2>Speaker Management</h2>
                <p className="speakers-description">
                  Manage speakers for your subtitle project. Changes will affect all subtitles.
                </p>
              </div>
              <button className="add-speaker-btn" onClick={() => setShowAddSpeakerDialog(true)}>
                <i className="fas fa-plus"></i>
                Add New Speaker
              </button>
            </div>

            <div className="speakers-grid">
              {speakers.map((speaker, index) => (
                <div key={speaker.id} className="speaker-card">
                  <div className="speaker-card-header">
                    <div className="speaker-avatar" style={{ backgroundColor: speaker.color }}>
                      <span className="speaker-initial">{speaker.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="speaker-info">
                      <h3 className="speaker-name">{speaker.name}</h3>
                      <p className="speaker-stats">
                        {subtitles.filter((s) => s.speakerId === speaker.id).length} subtitles assigned
                      </p>
                    </div>
                    <button className="edit-speaker-btn" onClick={() => openEditSpeakerDialog(speaker)}>
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>

                  <div className="speaker-card-body">
                    <div className="speaker-color-indicator">
                      <span className="color-label">Color:</span>
                      <div className="color-swatch" style={{ backgroundColor: speaker.color }}></div>
                    </div>

                    <div className="speaker-usage-bar">
                      <div className="usage-label">Usage in project</div>
                      <div className="usage-progress">
                        <div
                          className="usage-fill"
                          style={{
                            width: `${(subtitles.filter((s) => s.speakerId === speaker.id).length / subtitles.length) * 100}%`,
                            backgroundColor: speaker.color,
                          }}
                        ></div>
                      </div>
                      <div className="usage-percentage">
                        {Math.round(
                          (subtitles.filter((s) => s.speakerId === speaker.id).length / subtitles.length) * 100,
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Settings Tab */}
        {activeTab === "settings" && (
          <div className="settings-tab">
            <div className="settings-header">
              <div className="header-content">
                <h2>Subtitle Settings</h2>
                <p className="settings-description">
                  Configure how your subtitles are generated, formatted, and exported.
                </p>
              </div>
              <button className="apply-settings-btn" onClick={handleApplySettings}>
                <i className="fas fa-check"></i>
                Apply Settings
              </button>
            </div>

            <div className="settings-content">
              <div className="settings-row">
                <div className="settings-column">
                  <div className="settings-card">
                    <div className="card-header">
                      <h3>
                        <i className="fas fa-toggle-on"></i> Display Options
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="setting-item">
                        <label className="toggle-label">
                          <input
                            type="checkbox"
                            checked={tempSettings.includeSpeakerNames}
                            onChange={(e) => handleTempSettingsChange("includeSpeakerNames", e.target.checked)}
                          />
                          <span className="toggle-slider"></span>
                          <div className="toggle-content">
                            <span className="toggle-title">Include Speaker Names</span>
                            <span className="toggle-description">
                              Add speaker names before subtitle text in exports
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="card-header">
                      <h3>
                        <i className="fas fa-ruler"></i> Text Formatting
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="setting-item">
                        <label className="setting-label">Maximum Characters per Subtitle</label>
                        <select
                          value={tempSettings.maxCharacters}
                          onChange={(e) => handleTempSettingsChange("maxCharacters", Number.parseInt(e.target.value))}
                          className="setting-select"
                        >
                          <option value={42}>42 characters</option>
                          <option value={64}>64 characters</option>
                          <option value={74}>74 characters</option>
                          <option value={82}>82 characters</option>
                          <option value={100}>100 characters</option>
                        </select>
                        <span className="setting-help">Limits text length per subtitle section</span>
                      </div>

                      <div className="setting-item">
                        <label className="setting-label">Maximum Lines per Subtitle</label>
                        <select
                          value={tempSettings.maxLines}
                          onChange={(e) => handleTempSettingsChange("maxLines", Number.parseInt(e.target.value))}
                          className="setting-select"
                        >
                          <option value={1}>1 line</option>
                          <option value={2}>2 lines</option>
                          <option value={3}>3 lines</option>
                        </select>
                        <span className="setting-help">Maximum lines for subtitle display</span>
                      </div>

                      <div className="setting-item">
                        <label className="setting-label">Font Size</label>
                        <select
                          value={tempSettings.fontSize}
                          onChange={(e) => handleTempSettingsChange("fontSize", Number.parseInt(e.target.value))}
                          className="setting-select"
                        >
                          <option value={12}>12px</option>
                          <option value={14}>14px</option>
                          <option value={16}>16px</option>
                          <option value={18}>18px</option>
                          <option value={20}>20px</option>
                        </select>
                        <span className="setting-help">Font size for subtitle text</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="settings-column">
                  <div className="settings-card">
                    <div className="card-header">
                      <h3>
                        <i className="fas fa-clock"></i> Timing Controls
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="setting-item">
                        <label className="setting-label">Minimum Duration (seconds)</label>
                        <select
                          value={tempSettings.minDuration}
                          onChange={(e) => handleTempSettingsChange("minDuration", Number.parseFloat(e.target.value))}
                          className="setting-select"
                        >
                          <option value={0.5}>0.5 second</option>
                          <option value={1}>1 second</option>
                          <option value={2}>2 seconds</option>
                        </select>
                        <span className="setting-help">Minimum time each subtitle must be shown</span>
                      </div>

                      <div className="setting-item">
                        <label className="setting-label">Maximum Duration (seconds)</label>
                        <select
                          value={tempSettings.maxDuration}
                          onChange={(e) => handleTempSettingsChange("maxDuration", Number.parseFloat(e.target.value))}
                          className="setting-select"
                        >
                          <option value={3}>3 seconds</option>
                          <option value={5}>5 seconds</option>
                          <option value={6}>6 seconds</option>
                          <option value={8}>8 seconds</option>
                        </select>
                        <span className="setting-help">Maximum time each subtitle can be shown</span>
                      </div>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="card-header">
                      <h3>
                        <i className="fas fa-eye"></i> Live Preview
                      </h3>
                    </div>
                    <div className="card-body">
                      <div className="preview-container">
                        <div
                          className="preview-subtitle"
                          style={{
                            fontSize: `${tempSettings.fontSize}px`,
                            fontFamily: tempSettings.fontFamily,
                            color: tempSettings.textColor,
                            backgroundColor: tempSettings.backgroundColor,
                            textAlign: tempSettings.textAlign,
                          }}
                        >
                          {tempSettings.includeSpeakerNames && (
                            <span className="preview-speaker" style={{ color: getSpeakerColor(0) }}>
                              {getSpeakerName(0)}:{" "}
                            </span>
                          )}
                          <span className="preview-text">
                            {subtitles[0]?.text.substring(0, tempSettings.maxCharacters) || "Sample subtitle text"}
                            {subtitles[0]?.text.length > tempSettings.maxCharacters && "..."}
                          </span>
                        </div>

                        <div className="preview-stats">
                          <div className="stat-item">
                            <span className="stat-label">Characters:</span>
                            <span className="stat-value">
                              {
                                (subtitles[0]?.text.substring(0, tempSettings.maxCharacters) || "Sample subtitle text")
                                  .length
                              }
                              /{tempSettings.maxCharacters}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Lines:</span>
                            <span className="stat-value">1/{tempSettings.maxLines}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Section */}
      <div className="timeline-section">
        {/* Playback Controls */}
        <div className="playback-controls">
          <button className="control-btn" onClick={handleGoToStart} title="Go to start">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="control-btn" onClick={handleSkipBackward} title="Skip backward 30s">
            <i className="fas fa-backward"></i>
          </button>
          <button className="control-btn play-main" onClick={handlePlayPause} title="Play/Pause">
            <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
          </button>
          <button className="control-btn" onClick={handleSkipForward} title="Skip forward 30s">
            <i className="fas fa-forward"></i>
          </button>
          <button className="control-btn" onClick={handleGoToEnd} title="Go to end">
            <i className="fas fa-step-forward"></i>
          </button>
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
            <div className="time-frame">{Math.floor(currentTime * 30)}</div>
          </div>
          <div className="time-separator">/</div>
          <div className="time-total">
            <div className="time-value">{formatTime(duration)}</div>
            <div className="time-frame">{Math.floor(duration * 30)}</div>
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

      {/* Enhanced Waveform Timeline with Resizing */}
      <div className="waveform-container" ref={waveformRef}>
        <div className="timeline-markers" style={{ transform: `scaleX(${zoomLevel / 100})` }}>
          {Array.from({ length: Math.ceil((duration * (zoomLevel / 100)) / 5) }, (_, i) => (
            <div key={i} className="timeline-marker">
              <div className="marker-tick"></div>
              <div className="marker-label">{formatTimeShort((i * 5) / (zoomLevel / 100))}</div>
            </div>
          ))}
        </div>
        <div className="waveform-content">
          {subtitles.map((subtitle) => {
            const leftPercent = (subtitle.startSeconds / duration) * 100 * (zoomLevel / 100)
            const widthPercent = ((subtitle.endSeconds - subtitle.startSeconds) / duration) * 100 * (zoomLevel / 100)

            return (
              <div
                key={subtitle.id}
                className={`waveform-block ${selectedSubtitleId === subtitle.id ? "selected" : ""}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${Math.max(widthPercent, 2)}%`,
                  cursor: isDragging ? "grabbing" : "grab",
                  borderColor: getSpeakerColor(subtitle.speakerId),
                }}
                onMouseDown={(e) => handleSubtitleMouseDown(e, subtitle.id)}
                onClick={() => handleSeek(subtitle.startSeconds)}
              >
                <div className="block-text">{subtitle.text}</div>
                <div className="block-handles">
                  <div
                    className="handle-left"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleSubtitleMouseDown(e, subtitle.id, "left")
                    }}
                  ></div>
                  <div
                    className="handle-right"
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleSubtitleMouseDown(e, subtitle.id, "right")
                    }}
                  ></div>
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
