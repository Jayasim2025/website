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
  const [duration, setDuration] = useState(60) // Default 1 minute for demo
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [volume, setVolume] = useState(70)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

  // Backend Integration Structure - Word-level data
  const [wordLevelData, setWordLevelData] = useState([])
  const [isLoadingWords, setIsLoadingWords] = useState(false)

  // Backend Integration Point - Get Result API for word-level data
  const getResultFromAPI = async (projectId) => {
    try {
      const apiEndpoint = `/api/projects/${projectId}/get-result`
      const requestData = {
        projectId: projectId,
        requestType: "word_level_data",
        includeTimestamps: true,
        includeConfidence: true,
        timestamp: Date.now(),
      }

      console.log("🔗 Backend Integration Point: Get Result API")
      console.log("📡 API Endpoint:", apiEndpoint)
      console.log("📋 Request Data:", requestData)
      console.log("📥 Expected Response Format:", {
        success: true,
        projectId: "string",
        status: "processed",
        wordLevelData: [
          {
            id: "number",
            word: "string",
            startTime: "number (seconds)",
            endTime: "number (seconds)",
            confidence: "number (0-1)",
            speakerId: "number",
          },
        ],
        totalWords: "number",
        duration: "number",
      })

      // For demo purposes, simulate API call
      // Backend team will replace this with actual fetch call
      const simulatedResponse = await simulateGetResultAPI(requestData)

      console.log("📤 Get Result API Response:", simulatedResponse)
      return simulatedResponse
    } catch (error) {
      console.error("❌ Get Result API Error:", error)
      return { success: false, wordLevelData: [] }
    }
  }

  // Simulate API response for demo - Backend team will remove this
  const simulateGetResultAPI = async (requestData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const demoWords = generateDemoWordData()
        resolve({
          success: true,
          projectId: requestData.projectId,
          status: "processed",
          wordLevelData: demoWords,
          totalWords: demoWords.length,
          duration: duration,
          processingTime: "2.3 seconds",
          confidence: 0.94,
        })
      }, 800)
    })
  }

  // Word grouping functionality for subtitle creation
  const groupWordsIntoSubtitles = (words, groupingSettings = null) => {
    if (!words || words.length === 0) return []

    const effectiveSettings = groupingSettings || settings
    console.log("🔄 Grouping words into subtitles")
    console.log("📊 Grouping settings:", effectiveSettings)
    console.log("📝 Total words to group:", words.length)

    const subtitles = []
    let currentSubtitle = {
      id: 1,
      words: [],
      startTime: 0,
      endTime: 0,
      speakerId: 0,
    }

    let currentCharCount = 0
    const maxChars = effectiveSettings.maxCharacters
    const maxDuration = effectiveSettings.maxDuration

    words.forEach((word, index) => {
      const wordLength = word.word.length + 1

      const wouldExceedChars = currentCharCount + wordLength > maxChars
      const wouldExceedDuration =
        currentSubtitle.words.length > 0 && word.endTime - currentSubtitle.startTime > maxDuration

      if ((wouldExceedChars || wouldExceedDuration) && currentSubtitle.words.length > 0) {
        const text = currentSubtitle.words.map((w) => w.word).join(" ")
        subtitles.push({
          id: currentSubtitle.id,
          startTime: formatSecondsToTime(currentSubtitle.startTime),
          endTime: formatSecondsToTime(currentSubtitle.endTime),
          startSeconds: currentSubtitle.startTime,
          endSeconds: currentSubtitle.endTime,
          speakerId: currentSubtitle.speakerId,
          text: text,
          characters: text.length,
          duration: (currentSubtitle.endTime - currentSubtitle.startTime).toFixed(1),
          words: [...currentSubtitle.words],
        })

        console.log(`📝 Created subtitle ${currentSubtitle.id}:`, {
          text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
          wordCount: currentSubtitle.words.length,
          duration: (currentSubtitle.endTime - currentSubtitle.startTime).toFixed(1),
        })

        currentSubtitle = {
          id: subtitles.length + 1,
          words: [],
          startTime: word.startTime,
          endTime: word.endTime,
          speakerId: Math.floor(Math.random() * 3),
        }
        currentCharCount = 0
      }

      if (currentSubtitle.words.length === 0) {
        currentSubtitle.startTime = word.startTime
      }
      currentSubtitle.endTime = word.endTime
      currentSubtitle.words.push(word)
      currentCharCount += wordLength
    })

    if (currentSubtitle.words.length > 0) {
      const text = currentSubtitle.words.map((w) => w.word).join(" ")
      subtitles.push({
        id: currentSubtitle.id,
        startTime: formatSecondsToTime(currentSubtitle.startTime),
        endTime: formatSecondsToTime(currentSubtitle.endTime),
        startSeconds: currentSubtitle.startTime,
        endSeconds: currentSubtitle.endTime,
        speakerId: currentSubtitle.speakerId,
        text: text,
        characters: text.length,
        duration: (currentSubtitle.endTime - currentSubtitle.startTime).toFixed(1),
        words: [...currentSubtitle.words],
      })
    }

    console.log("✅ Word grouping completed:", {
      totalSubtitles: subtitles.length,
      averageWordsPerSubtitle: (words.length / subtitles.length).toFixed(1),
      averageCharactersPerSubtitle: (
        subtitles.reduce((sum, sub) => sum + sub.characters, 0) / subtitles.length
      ).toFixed(1),
    })

    return subtitles
  }

  // Media player states
  const [mediaUrl, setMediaUrl] = useState(null)
  const [isVideo, setIsVideo] = useState(false)
  const [isAudio, setIsAudio] = useState(false)

  // History management for undo/redo
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isUndoRedoAction, setIsUndoRedoAction] = useState(false)

  // Enhanced waveform interaction states with PERFECT zoom ranges
  const [zoomLevel, setZoomLevel] = useState(50) // Start at 50% for 1-minute videos
  const [selectedSubtitleId, setSelectedSubtitleId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [hoveredHandle, setHoveredHandle] = useState(null)

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
    maxLines: 2,
    minDuration: 1.0,
    maxDuration: 6.0,
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
    // Load current project from localStorage
    const currentProject = localStorage.getItem("currentProject")
    if (currentProject) {
      const projectData = JSON.parse(currentProject)
      setProject(projectData)
      loadProjectData(projectData)
    } else {
      navigate("/workspace")
    }
  }, [navigate])

  // Backend Integration Point - Fetch word-level data
  const fetchWordLevelDataFromBackend = async (projectId) => {
    try {
      setIsLoadingWords(true)
      console.log("🚀 Starting Get Result API Integration")
      console.log("🆔 Project ID:", projectId)

      const apiResponse = await getResultFromAPI(projectId)

      if (apiResponse.success) {
        console.log("✅ Word-level data loaded successfully")
        console.log("📊 Data Statistics:", {
          totalWords: apiResponse.totalWords,
          duration: apiResponse.duration,
          averageConfidence: apiResponse.confidence,
          processingTime: apiResponse.processingTime,
        })

        setWordLevelData(apiResponse.wordLevelData)
        return apiResponse.wordLevelData
      } else {
        console.error("❌ Failed to load word-level data from API")
        return []
      }
    } catch (error) {
      console.error("❌ Error fetching word-level data:", error)
      return []
    } finally {
      setIsLoadingWords(false)
    }
  }

  // Generate demo word-level data based on project duration - OPTIMIZED FOR 1 MINUTE
  const generateDemoWordData = () => {
    const sampleWords = [
      "Did",
      "you",
      "know",
      "that",
      "Tupac's",
      "mother",
      "Afeni",
      "Shakur",
      "was",
      "an",
      "active",
      "member",
      "of",
      "the",
      "Black",
      "Panther",
      "Party",
      "and",
      "named",
      "him",
      "after",
      "Tupac",
      "Amaru",
      "the",
      "second",
      "an",
      "eighteenth",
      "century",
      "politician",
      "from",
      "Peru",
      "Additionally",
      "Tupac",
      "studied",
      "poetry",
      "and",
      "literature",
      "extensively",
      "during",
      "his",
      "time",
      "in",
      "the",
      "Baltimore",
      "School",
      "for",
      "the",
      "Arts",
      "and",
      "developed",
      "a",
      "deep",
      "appreciation",
      "for",
      "Shakespeare",
      "and",
      "other",
      "classical",
      "writers",
      "which",
      "influenced",
      "his",
      "lyrical",
      "style",
      "throughout",
      "his",
      "career",
      "in",
      "hip",
      "hop",
      "music",
      "making",
      "him",
      "one",
      "of",
      "the",
      "most",
      "influential",
      "artists",
      "of",
      "all",
      "time",
      "with",
      "his",
      "powerful",
      "messages",
      "about",
      "social",
      "justice",
      "and",
      "equality",
      "that",
      "continue",
      "to",
      "resonate",
      "with",
      "people",
      "around",
      "the",
      "world",
      "today",
      "inspiring",
      "new",
      "generations",
      "of",
      "artists",
      "and",
      "activists",
      "to",
      "speak",
      "out",
      "against",
      "injustice",
      "and",
      "fight",
      "for",
      "positive",
      "change",
      "in",
      "their",
      "communities",
    ]

    const words = []
    const wordsPerSecond = 2.2 // Slightly slower for better readability
    const totalWords = Math.floor(duration * wordsPerSecond)

    for (let i = 0; i < totalWords; i++) {
      const word = sampleWords[i % sampleWords.length]
      const startTime = i / wordsPerSecond
      const wordDuration = 0.35 + Math.random() * 0.15 // 0.35-0.5 seconds per word
      const endTime = Math.min(startTime + wordDuration, duration)

      words.push({
        id: i + 1,
        word: word,
        startTime: startTime,
        endTime: endTime,
        confidence: 0.92 + Math.random() * 0.08,
        speakerId: i < totalWords * 0.3 ? 0 : i < totalWords * 0.7 ? 1 : 2, // Distribute across speakers
      })
    }

    return words
  }

  const loadProjectData = async (projectData) => {
    try {
      // Set media information from project data
      if (projectData.fileData) {
        setIsVideo(projectData.fileData.isVideo)
        setIsAudio(projectData.fileData.isAudio)
        const projectDuration = projectData.fileData.durationSeconds || 60
        setDuration(projectDuration)

        // Set initial zoom based on duration
        if (projectDuration <= 60) {
          setZoomLevel(50) // Start at 50% for 1-minute videos
        } else if (projectDuration <= 900) {
          setZoomLevel(25) // Start at 25% for 15-minute videos
        } else {
          setZoomLevel(10) // Start at 10% for longer videos
        }

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

      setSpeakers(sampleSpeakers)

      // Fetch word-level data (Backend Integration Point)
      const words = await fetchWordLevelDataFromBackend(projectData.id)

      // Group words into subtitles
      const generatedSubtitles = groupWordsIntoSubtitles(words)
      setSubtitles(generatedSubtitles)

      // Initialize history with current state
      const initialState = {
        subtitles: generatedSubtitles,
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
        return newHistory.slice(-50)
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
      setTempSettings(prevState.settings)
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
      setTempSettings(nextState.settings)
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

  // Convert pixel position to time
  const getTimeFromPosition = useCallback(
    (clientX) => {
      if (!waveformRef.current) return 0

      const rect = waveformRef.current.getBoundingClientRect()
      const relativeX = clientX - rect.left
      const scrollLeft = waveformRef.current.scrollLeft

      const totalWidth = rect.width * (zoomLevel / 100)
      const actualX = relativeX + scrollLeft
      const timeRatio = actualX / totalWidth
      const time = timeRatio * duration

      return Math.max(0, Math.min(duration, time))
    },
    [duration, zoomLevel],
  )

  // Handle mouse down on subtitle blocks
  const handleSubtitleMouseDown = useCallback(
    (e, subtitleId, handle = null) => {
      e.preventDefault()
      e.stopPropagation()

      const subtitle = subtitles.find((sub) => sub.id === subtitleId)
      if (!subtitle) return

      setSelectedSubtitleId(subtitleId)
      setDragStartX(e.clientX)
      setDragStartTime(getTimeFromPosition(e.clientX))

      if (handle === "left" || handle === "right") {
        // Only allow resizing at start and end
        setIsResizing(true)
        setResizeHandle(handle)
      } else {
        // Allow dragging only if not near edges
        setIsDragging(true)
      }

      const handleMouseMove = (moveEvent) => {
        handleSubtitleMouseMove(moveEvent, subtitle)
      }

      const handleMouseUp = () => {
        handleSubtitleMouseUp()
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.userSelect = "none"
    },
    [subtitles, getTimeFromPosition],
  )

  // Handle mouse move during drag/resize
  const handleSubtitleMouseMove = useCallback(
    (e, originalSubtitle) => {
      if ((!isDragging && !isResizing) || !selectedSubtitleId) return

      const currentMouseTime = getTimeFromPosition(e.clientX)

      if (isResizing) {
        const updatedSubtitles = subtitles.map((sub) => {
          if (sub.id === selectedSubtitleId) {
            let newStartSeconds = sub.startSeconds
            let newEndSeconds = sub.endSeconds

            if (resizeHandle === "left") {
              newStartSeconds = currentMouseTime
              if (newEndSeconds - newStartSeconds < settings.minDuration) {
                newStartSeconds = newEndSeconds - settings.minDuration
              }
              newStartSeconds = Math.max(0, newStartSeconds)
            } else if (resizeHandle === "right") {
              newEndSeconds = currentMouseTime
              if (newEndSeconds - newStartSeconds < settings.minDuration) {
                newEndSeconds = newStartSeconds + settings.minDuration
              }
              if (newEndSeconds - newStartSeconds > settings.maxDuration) {
                newEndSeconds = newStartSeconds + settings.maxDuration
              }
              newEndSeconds = Math.min(duration, newEndSeconds)
            }

            return {
              ...sub,
              startSeconds: newStartSeconds,
              endSeconds: newEndSeconds,
              startTime: formatSecondsToTime(newStartSeconds),
              endTime: formatSecondsToTime(newEndSeconds),
              duration: (newEndSeconds - newStartSeconds).toFixed(1),
            }
          }
          return sub
        })

        setSubtitles(updatedSubtitles)
      } else if (isDragging) {
        const timeDelta = currentMouseTime - dragStartTime
        const subtitleDuration = originalSubtitle.endSeconds - originalSubtitle.startSeconds

        let newStartSeconds = originalSubtitle.startSeconds + timeDelta
        let newEndSeconds = originalSubtitle.endSeconds + timeDelta

        if (newStartSeconds < 0) {
          newStartSeconds = 0
          newEndSeconds = subtitleDuration
        }
        if (newEndSeconds > duration) {
          newEndSeconds = duration
          newStartSeconds = duration - subtitleDuration
        }

        const updatedSubtitles = subtitles.map((sub) => {
          if (sub.id === selectedSubtitleId) {
            return {
              ...sub,
              startSeconds: newStartSeconds,
              endSeconds: newEndSeconds,
              startTime: formatSecondsToTime(newStartSeconds),
              endTime: formatSecondsToTime(newEndSeconds),
              duration: (newEndSeconds - newStartSeconds).toFixed(1),
            }
          }
          return sub
        })

        setSubtitles(updatedSubtitles)
      }

      setHasUnsavedChanges(true)
    },
    [
      isDragging,
      isResizing,
      selectedSubtitleId,
      dragStartTime,
      subtitles,
      resizeHandle,
      settings.minDuration,
      settings.maxDuration,
      duration,
      getTimeFromPosition,
    ],
  )

  // Handle mouse up
  const handleSubtitleMouseUp = useCallback(() => {
    if ((isDragging || isResizing) && selectedSubtitleId) {
      const action = isResizing
        ? `Resize subtitle ${selectedSubtitleId} (${resizeHandle})`
        : `Move subtitle ${selectedSubtitleId}`
      saveToHistory(action)
    }

    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
    setDragStartX(0)
    setDragStartTime(0)
    document.body.style.userSelect = ""
  }, [isDragging, isResizing, selectedSubtitleId, resizeHandle, saveToHistory])

  const handleHandleMouseEnter = useCallback((handle) => {
    setHoveredHandle(handle)
  }, [])

  const handleHandleMouseLeave = useCallback(() => {
    setHoveredHandle(null)
  }, [])

  const getSpeakerName = (speakerId) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    return speaker ? speaker.name : `Speaker ${speakerId}`
  }

  const getSpeakerColor = (speakerId) => {
    const speaker = speakers.find((s) => s.id === speakerId)
    return speaker ? speaker.color : "#3b82f6"
  }

  // Backend Integration Point - Export functionality
  const handleExport = async (format) => {
    try {
      const exportData = {
        subtitles: subtitles.map((sub) => {
          let processedText = settings.includeSpeakerNames ? `${getSpeakerName(sub.speakerId)}: ${sub.text}` : sub.text

          if (processedText.length > settings.maxCharacters) {
            processedText = processedText.substring(0, settings.maxCharacters) + "..."
          }

          return {
            ...sub,
            text: processedText,
          }
        }),
        settings,
        format,
        projectId: project.id,
      }

      console.log("🔗 Backend Integration Point: Export subtitles")
      console.log("📡 Expected API endpoint: POST /api/export")
      console.log("📋 Export data ready for backend:", exportData)

      // Backend team will implement actual export API call here
      // For demo, simulate download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `subtitles_${project.name}_${format}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setShowExportMenu(false)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const handleSelectSubtitle = (id) => {
    setSelectedSubtitleId(id)

    const subtitle = subtitles.find((sub) => sub.id === id)
    if (subtitle) {
      const waveformContainer = waveformRef.current
      if (waveformContainer) {
        const leftPercent = (subtitle.startSeconds / duration) * 100 * (zoomLevel / 100)
        const scrollPosition = (leftPercent / 100) * waveformContainer.scrollWidth
        waveformContainer.scrollLeft = scrollPosition - waveformContainer.clientWidth / 3
      }
    }
  }

  const handleSubtitleEdit = async (id, newText, newTiming = null) => {
    const limitedText = newText.length > settings.maxCharacters ? newText.substring(0, settings.maxCharacters) : newText

    const updatedSubtitles = subtitles.map((sub) => {
      if (sub.id === id) {
        const updatedSub = {
          ...sub,
          text: limitedText,
          characters: limitedText.length,
        }

        if (newTiming) {
          const { startSeconds, endSeconds } = newTiming
          updatedSub.startSeconds = startSeconds
          updatedSub.endSeconds = endSeconds
          updatedSub.startTime = formatSecondsToTime(startSeconds)
          updatedSub.endTime = formatSecondsToTime(endSeconds)
          updatedSub.duration = (endSeconds - startSeconds).toFixed(1)
        }

        return updatedSub
      }
      return sub
    })

    setSubtitles(updatedSubtitles)
    saveToHistory(`Edit subtitle ${id}`, updatedSubtitles)
  }

  const splitSubtitle = async (id, type) => {
    try {
      const subtitle = subtitles.find((s) => s.id === id)
      if (!subtitle || !subtitle.text.trim()) return

      const newSubtitles = [...subtitles]
      const index = newSubtitles.findIndex((s) => s.id === id)

      if (type === "word") {
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
      setShowMarkCompleteDialog(false)
      navigate("/workspace")
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
    } catch (error) {
      console.error("Change speaker error:", error)
    }
  }

  const handleTempSettingsChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Handle regrouping of words when user changes settings
  const handleRegroupWords = async (newSettings) => {
    try {
      console.log("🔄 Regrouping words with new settings")
      console.log("⚙️ New settings:", newSettings)
      console.log("📝 Current word count:", wordLevelData.length)

      if (wordLevelData.length === 0) {
        console.warn("⚠️ No word-level data available for regrouping")
        return
      }

      const regroupedSubtitles = groupWordsIntoSubtitles(wordLevelData, newSettings)

      console.log("✅ Regrouping completed:", {
        oldSubtitleCount: subtitles.length,
        newSubtitleCount: regroupedSubtitles.length,
        settingsApplied: newSettings,
      })

      setSubtitles(regroupedSubtitles)
      saveToHistory("Regroup words with new settings", regroupedSubtitles, speakers, newSettings)
    } catch (error) {
      console.error("❌ Error regrouping words:", error)
    }
  }

  const handleApplySettings = async () => {
    try {
      console.log("⚙️ Applying new settings")
      console.log("📋 Settings before:", settings)
      console.log("📋 Settings after:", tempSettings)

      // First update the settings state
      setSettings(tempSettings)

      // If we have word-level data, regroup the words
      if (wordLevelData.length > 0) {
        await handleRegroupWords(tempSettings)
      } else {
        // Apply character limits to existing subtitles if no word data
        const updatedSubtitles = subtitles.map((subtitle) => {
          let newText = subtitle.text

          // Apply character limit
          if (newText.length > tempSettings.maxCharacters) {
            newText = newText.substring(0, tempSettings.maxCharacters)
          }

          // Apply duration limits
          let newDuration = subtitle.endSeconds - subtitle.startSeconds
          if (newDuration < tempSettings.minDuration) {
            newDuration = tempSettings.minDuration
          } else if (newDuration > tempSettings.maxDuration) {
            newDuration = tempSettings.maxDuration
          }

          const newEndSeconds = subtitle.startSeconds + newDuration

          return {
            ...subtitle,
            text: newText,
            characters: newText.length,
            endSeconds: Math.min(newEndSeconds, duration),
            endTime: formatSecondsToTime(Math.min(newEndSeconds, duration)),
            duration: newDuration.toFixed(1),
          }
        })

        setSubtitles(updatedSubtitles)
        saveToHistory("Apply settings", updatedSubtitles, speakers, tempSettings)
      }

      console.log("✅ Settings applied successfully")
    } catch (error) {
      console.error("❌ Apply settings error:", error)
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

  // PERFECT zoom functionality - Specific ranges as requested
  const handleZoomChange = (newZoom) => {
    let minZoom, maxZoom

    if (duration <= 60) {
      // 1 minute videos: 10% to 100%
      minZoom = 10
      maxZoom = 100
    } else if (duration <= 900) {
      // 15 minute videos: 10% to 1000%
      minZoom = 10
      maxZoom = 1000
    } else {
      // Longer videos: 10% to 3000%
      minZoom = 10
      maxZoom = 3000
    }

    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom))
    setZoomLevel(clampedZoom)

    console.log("🔍 Perfect Zoom System:", {
      duration: `${Math.floor(duration / 60)}:${Math.floor(duration % 60)
        .toString()
        .padStart(2, "0")}`,
      requestedZoom: newZoom,
      appliedZoom: clampedZoom,
      range: `${minZoom}% - ${maxZoom}%`,
      category: duration <= 60 ? "1-minute" : duration <= 900 ? "15-minute" : "long-duration",
    })
  }

  // Calculate timeline marker intervals based on zoom and duration
  const getTimelineMarkerInterval = () => {
    const pixelsPerSecond = (zoomLevel / 100) * 100

    if (pixelsPerSecond > 200) return 1 // Every second
    if (pixelsPerSecond > 100) return 2 // Every 2 seconds
    if (pixelsPerSecond > 50) return 5 // Every 5 seconds
    if (pixelsPerSecond > 20) return 10 // Every 10 seconds
    if (pixelsPerSecond > 10) return 15 // Every 15 seconds
    return 30 // Every 30 seconds
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
        <div className="header-left">
          <button className="back-button" onClick={() => navigate("/workspace")} title="Back to Workspace">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="video-title">
            {project.name.length > 30 ? `${project.name.substring(0, 30)}...` : project.name}
          </div>
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
                {isLoadingWords && (
                  <div className="loading-indicator">
                    <i className="fas fa-spinner fa-spin"></i>
                    Loading word-level data from backend...
                  </div>
                )}
                {subtitles.map((subtitle, index) => (
                  <div
                    key={subtitle.id}
                    id={`subtitle-${subtitle.id}`}
                    className={`subtitle-entry ${selectedSubtitleId === subtitle.id ? "selected-subtitle" : ""}`}
                    onClick={() => handleSelectSubtitle(subtitle.id)}
                  >
                    <div className="subtitle-header">
                      <div className="subtitle-number">
                        ({subtitle.id}/{subtitles.length})
                        <i
                          className="fas fa-play"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSeek(subtitle.startSeconds)
                          }}
                        ></i>
                      </div>
                      <div className="subtitle-actions">
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            splitSubtitle(subtitle.id, "word")
                          }}
                        >
                          <i className="fas fa-cut"></i> Split at word
                        </button>
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            splitSubtitle(subtitle.id, "half")
                          }}
                        >
                          <i className="fas fa-cut"></i> Split into half
                        </button>
                        <button
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            mergeWithAbove(subtitle.id)
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation()
                            openChangeSpeakerDialog(subtitle.id, subtitle.speakerId)
                          }}
                        >
                          {getSpeakerName(subtitle.speakerId)}
                        </button>
                      </div>

                      <div className="text-section">
                        <textarea
                          className="subtitle-textarea"
                          value={subtitle.text}
                          onChange={(e) => handleSubtitleEdit(subtitle.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
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
                    <p>Demo Media Player</p>
                    <small>Backend team will integrate actual media playback</small>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Simplified Speakers Tab */}
        {activeTab === "speakers" && (
          <div className="speakers-tab-simple">
            <div className="speakers-content">
              <h2>Speakers</h2>

              <div className="speakers-list-simple">
                {speakers.map((speaker, index) => (
                  <div key={speaker.id} className="speaker-item-simple">
                    <span className="speaker-number">{index + 1}.</span>
                    <span className="speaker-name">{speaker.name}</span>
                    <button
                      className="speaker-edit-btn-simple"
                      onClick={() => openEditSpeakerDialog(speaker)}
                      title="Edit speaker"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                ))}
              </div>

              <button className="add-speaker-btn-simple" onClick={() => setShowAddSpeakerDialog(true)}>
                Add Speaker
              </button>
            </div>
          </div>
        )}

        {/* Simplified Settings Tab */}
        {activeTab === "settings" && (
          <div className="settings-tab-simple">
            <div className="settings-header">
              <div className="header-content">
                <h2>Settings</h2>
                <p className="settings-description">
                  Configure subtitle formatting, timing, and export preferences. Changes will be applied to all
                  subtitles.
                </p>
              </div>
              <button className="apply-settings-btn" onClick={handleApplySettings}>
                <i className="fas fa-check"></i>
                Apply Settings
              </button>
            </div>

            <div className="settings-content">
              <div className="settings-single-column">
                {/* General Settings Card */}
                <div className="settings-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-cog"></i>
                      General Settings
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
                          <div className="toggle-title">Include Speaker Names</div>
                          <div className="toggle-description">Add speaker names to subtitle text when exporting</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Subtitle Guidelines Card */}
                <div className="settings-card">
                  <div className="card-header">
                    <h3>
                      <i className="fas fa-align-left"></i>
                      Subtitle Guidelines
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="setting-item">
                      <label className="setting-label">Max characters per subtitle</label>
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
                      <div className="setting-help">Recommended: 42-82 characters for optimal readability</div>
                    </div>

                    <div className="setting-item">
                      <label className="setting-label">Max lines per subtitle</label>
                      <select
                        value={tempSettings.maxLines}
                        onChange={(e) => handleTempSettingsChange("maxLines", Number.parseInt(e.target.value))}
                        className="setting-select"
                      >
                        <option value={1}>1 line</option>
                        <option value={2}>2 lines</option>
                        <option value={3}>3 lines</option>
                      </select>
                      <div className="setting-help">Most platforms support 1-2 lines maximum</div>
                    </div>

                    <div className="setting-item">
                      <label className="setting-label">Min duration (seconds)</label>
                      <select
                        value={tempSettings.minDuration}
                        onChange={(e) => handleTempSettingsChange("minDuration", Number.parseFloat(e.target.value))}
                        className="setting-select"
                      >
                        <option value={0.5}>0.5 seconds</option>
                        <option value={1}>1 second</option>
                        <option value={1.5}>1.5 seconds</option>
                        <option value={2}>2 seconds</option>
                      </select>
                      <div className="setting-help">Minimum time a subtitle should be displayed</div>
                    </div>

                    <div className="setting-item">
                      <label className="setting-label">Max duration (seconds)</label>
                      <select
                        value={tempSettings.maxDuration}
                        onChange={(e) => handleTempSettingsChange("maxDuration", Number.parseFloat(e.target.value))}
                        className="setting-select"
                      >
                        <option value={3}>3 seconds</option>
                        <option value={4}>4 seconds</option>
                        <option value={5}>5 seconds</option>
                        <option value={6}>6 seconds</option>
                        <option value={8}>8 seconds</option>
                        <option value={10}>10 seconds</option>
                      </select>
                      <div className="setting-help">Maximum time a subtitle should be displayed</div>
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

        {/* PERFECT Zoom Controls with Specific Ranges */}
        <div className="zoom-controls">
          <button
            className="zoom-btn"
            onClick={() => handleZoomChange(zoomLevel - (duration <= 60 ? 10 : duration <= 900 ? 50 : 100))}
            disabled={zoomLevel <= 10}
          >
            <i className="fas fa-search-minus"></i>
          </button>
          <div className="zoom-display">
            <input
              type="range"
              className="zoom-slider"
              min={10}
              max={duration <= 60 ? 100 : duration <= 900 ? 1000 : 3000}
              value={zoomLevel}
              onChange={(e) => handleZoomChange(Number.parseInt(e.target.value))}
            />
            <span className="zoom-value">{zoomLevel}%</span>
          </div>
          <button
            className="zoom-btn"
            onClick={() => handleZoomChange(zoomLevel + (duration <= 60 ? 10 : duration <= 900 ? 50 : 100))}
            disabled={zoomLevel >= (duration <= 60 ? 100 : duration <= 900 ? 1000 : 3000)}
          >
            <i className="fas fa-search-plus"></i>
          </button>
        </div>
      </div>

      {/* Enhanced Waveform Timeline with Perfect Scaling */}
      <div className="waveform-container" ref={waveformRef}>
        <div className="timeline-markers" style={{ width: `${zoomLevel}%` }}>
          {Array.from({ length: Math.ceil(duration / getTimelineMarkerInterval()) + 1 }, (_, i) => {
            const time = i * getTimelineMarkerInterval()
            if (time > duration) return null

            return (
              <div key={i} className="timeline-marker" style={{ left: `${(time / duration) * 100}%` }}>
                <div className="marker-tick"></div>
                <div className="marker-label">{formatTimeShort(time)}</div>
              </div>
            )
          })}
        </div>
        <div className="waveform-content" style={{ width: `${zoomLevel}%` }}>
          {subtitles.map((subtitle) => {
            const leftPercent = (subtitle.startSeconds / duration) * 100
            const widthPercent = ((subtitle.endSeconds - subtitle.startSeconds) / duration) * 100
            const isSelected = selectedSubtitleId === subtitle.id

            return (
              <div
                key={subtitle.id}
                className={`waveform-block ${isSelected ? "selected" : ""} ${isDragging && isSelected ? "dragging" : ""} ${isResizing && isSelected ? "resizing" : ""}`}
                style={{
                  left: `${leftPercent}%`,
                  width: `${Math.max(widthPercent, 0.5)}%`,
                  cursor: isDragging ? "grabbing" : "grab",
                  borderColor: getSpeakerColor(subtitle.speakerId),
                  backgroundColor: isSelected
                    ? `${getSpeakerColor(subtitle.speakerId)}60`
                    : `${getSpeakerColor(subtitle.speakerId)}30`,
                }}
                onMouseDown={(e) => {
                  // Only allow dragging if not clicking on resize handles
                  const rect = e.currentTarget.getBoundingClientRect()
                  const clickX = e.clientX - rect.left
                  const isNearStart = clickX < 12
                  const isNearEnd = clickX > rect.width - 12

                  if (!isNearStart && !isNearEnd) {
                    handleSubtitleMouseDown(e, subtitle.id)
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isDragging && !isResizing) {
                    handleSeek(subtitle.startSeconds)
                    setSelectedSubtitleId(subtitle.id)
                  }
                }}
              >
                {/* Left resize handle - only at start */}
                <div
                  className={`resize-handle resize-handle-left ${hoveredHandle === `${subtitle.id}-left` ? "hovered" : ""}`}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    handleSubtitleMouseDown(e, subtitle.id, "left")
                  }}
                  onMouseEnter={() => handleHandleMouseEnter(`${subtitle.id}-left`)}
                  onMouseLeave={handleHandleMouseLeave}
                  style={{ cursor: "ew-resize" }}
                >
                  <div className="handle-indicator"></div>
                </div>

                {/* Block content */}
                <div className="block-content">
                  <div className="block-text">
                    {subtitle.text.length > 25 ? `${subtitle.text.substring(0, 25)}...` : subtitle.text}
                  </div>
                  <div className="block-info">
                    <span className="block-speaker">{getSpeakerName(subtitle.speakerId)}</span>
                    <span className="block-duration">{subtitle.duration}s</span>
                  </div>
                </div>

                {/* Right resize handle - only at end */}
                <div
                  className={`resize-handle resize-handle-right ${hoveredHandle === `${subtitle.id}-right` ? "hovered" : ""}`}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    handleSubtitleMouseDown(e, subtitle.id, "right")
                  }}
                  onMouseEnter={() => handleHandleMouseEnter(`${subtitle.id}-right`)}
                  onMouseLeave={handleHandleMouseLeave}
                  style={{ cursor: "ew-resize" }}
                >
                  <div className="handle-indicator"></div>
                </div>
              </div>
            )
          })}

          {/* Current time indicator */}
          <div
            className="current-time-indicator"
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          >
            <div className="time-line"></div>
            <div className="time-handle">
              <div className="time-tooltip">{formatTimeShort(currentTime)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AnimatePresence>
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
                <h3>Add New Speaker</h3>
                <button className="dialog-close" onClick={() => setShowAddSpeakerDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="dialog-body">
                <input
                  type="text"
                  placeholder="Enter speaker name"
                  value={newSpeakerName}
                  onChange={(e) => setNewSpeakerName(e.target.value)}
                  className="dialog-input"
                  autoFocus
                />
              </div>
              <div className="dialog-footer">
                <button className="dialog-btn secondary" onClick={() => setShowAddSpeakerDialog(false)}>
                  Cancel
                </button>
                <button className="dialog-btn primary" onClick={handleAddSpeaker} disabled={!newSpeakerName.trim()}>
                  Add Speaker
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

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
              <div className="dialog-body">
                <input
                  type="text"
                  placeholder="Enter speaker name"
                  value={newSpeakerName}
                  onChange={(e) => setNewSpeakerName(e.target.value)}
                  className="dialog-input"
                  autoFocus
                />
              </div>
              <div className="dialog-footer">
                <button className="dialog-btn secondary" onClick={() => setShowEditSpeakerDialog(false)}>
                  Cancel
                </button>
                <button className="dialog-btn primary" onClick={handleEditSpeaker} disabled={!newSpeakerName.trim()}>
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

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
              <div className="dialog-body">
                <select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="dialog-select"
                  autoFocus
                >
                  {speakers.map((speaker) => (
                    <option key={speaker.id} value={speaker.id}>
                      {speaker.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dialog-footer">
                <button className="dialog-btn secondary" onClick={() => setShowChangeSpeakerDialog(false)}>
                  Cancel
                </button>
                <button className="dialog-btn primary" onClick={handleChangeSpeaker}>
                  Change Speaker
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

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
              <div className="dialog-body">
                <p>
                  Are you sure you want to mark this project as complete? This will save all changes and return you to
                  the workspace.
                </p>
              </div>
              <div className="dialog-footer">
                <button className="dialog-btn secondary" onClick={() => setShowMarkCompleteDialog(false)}>
                  Cancel
                </button>
                <button className="dialog-btn primary" onClick={confirmMarkComplete}>
                  Mark Complete
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
