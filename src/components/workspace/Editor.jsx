"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Editor.css"

const Editor = () => {
  const [activeTab, setActiveTab] = useState("content")
  const [project, setProject] = useState(null)
  const [subtitles, setSubtitles] = useState([])
  const [speakers, setSpeakers] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [settings, setSettings] = useState({
    maxCharacters: 82,
    maxLines: 2,
    minDuration: 1,
    maxDuration: 6,
    includeSpeakerNames: false
  })
  const audioRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load current project
    const currentProject = localStorage.getItem("currentProject")
    if (currentProject) {
      const projectData = JSON.parse(currentProject)
      setProject(projectData)
      loadProjectData(projectData)
    } else {
      navigate("/workspace")
    }
  }, [navigate])

  const loadProjectData = (projectData) => {
    // Sample subtitle data - in real app, this would come from API
    const sampleSubtitles = [
      {
        id: 1,
        startTime: "00:00:06",
        endTime: "00:00:06",
        speaker: "Speaker 1",
        text: "it Kattabomman in the Panchalam Kurchi, which includes 96 villages",
        startSeconds: 6,
        endSeconds: 9,
        characters: 65
      },
      {
        id: 2,
        startTime: "00:00:06",
        endTime: "00:00:09",
        speaker: "Speaker 1", 
        text: "The reign of Kattabomman started in 1790 Kattabomman was against the British East India",
        startSeconds: 6,
        endSeconds: 16,
        characters: 89
      },
      {
        id: 3,
        startTime: "00:00:11",
        endTime: "00:00:16",
        speaker: "Speaker 1",
        text: "Company to pay taxes in 1799, the Polygar War broke out and that was the reason for",
        startSeconds: 11,
        endSeconds: 20,
        characters: 82
      }
    ]

    const sampleSpeakers = [
      { id: 0, name: "Speaker 0" },
      { id: 1, name: "Speaker 1" }
    ]

    setSubtitles(sampleSubtitles)
    setSpeakers(sampleSpeakers)
  }

  const handleExport = (format) => {
    // Export functionality - integrate with backend API
    console.log(`Exporting as ${format}`)
    setShowExportMenu(false)
    
    // In real app, make API call to export
    // const response = await fetch('/api/export', {
    //   method: 'POST',
    //   body: JSON.stringify({ projectId: project.id, format })
    // })
  }

  const handleSubtitleEdit = (id, newText) => {
    setSubtitles(subs => 
      subs.map(sub => 
        sub.id === id ? { ...sub, text: newText, characters: newText.length } : sub
      )
    )
  }

  const splitSubtitle = (id, type) => {
    // Implementation for splitting subtitles
    console.log(`Split subtitle ${id} by ${type}`)
  }

  const mergeWithAbove = (id) => {
    // Implementation for merging subtitles
    console.log(`Merge subtitle ${id} with above`)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!project) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-title">
          <button className="back-button" onClick={() => navigate("/workspace")}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <span className="project-name">{project.name}</span>
        </div>
        
        <div className="editor-actions">
          <button className="help-button">
            <i className="fas fa-question-circle"></i>
          </button>
          <div className="save-status">
            <i className="fas fa-check-circle"></i>
            <span>Saved</span>
          </div>
          <button className="complete-button">
            <i className="fas fa-check"></i>
            Mark as Complete
          </button>
          <button className="undo-button">
            <i className="fas fa-undo"></i>
            Undo
          </button>
          <button className="redo-button">
            <i className="fas fa-redo"></i>
            Redo
          </button>
          
          <div className="export-dropdown">
            <button 
              className="export-button"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <i className="fas fa-download"></i>
              Export Subtitles
            </button>
            
            <AnimatePresence>
              {showExportMenu && (
                <motion.div 
                  className="export-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button onClick={() => handleExport('json')}>Export JSON</button>
                  <button onClick={() => handleExport('vtt')}>Export VTT</button>
                  <button onClick={() => handleExport('srt')}>Export SRT</button>
                  <button onClick={() => handleExport('transcript')}>Export Transcript</button>
                  <button onClick={() => handleExport('doc')}>Export Doc</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-sidebar">
          <nav className="editor-nav">
            <button 
              className={`nav-item ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <i className="fas fa-align-left"></i>
              <span>Content Editor</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'speakers' ? 'active' : ''}`}
              onClick={() => setActiveTab('speakers')}
            >
              <i className="fas fa-users"></i>
              <span>Speakers</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'translations' ? 'active' : ''}`}
              onClick={() => setActiveTab('translations')}
            >
              <i className="fas fa-language"></i>
              <span>Translations</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="editor-main">
          {activeTab === 'content' && (
            <div className="content-editor">
              <div className="subtitle-list">
                {subtitles.map((subtitle, index) => (
                  <div key={subtitle.id} className="subtitle-item">
                    <div className="subtitle-header">
                      <span className="subtitle-number">({index + 1}/{subtitles.length})</span>
                      <button className="play-button">
                        <i className="fas fa-play"></i>
                      </button>
                      <div className="subtitle-timing">
                        <span>{subtitle.startTime}</span>
                        <span className="char-count">{subtitle.characters}</span>
                        <span>{subtitle.endTime}</span>
                        <span className="char-count">{subtitle.endSeconds - subtitle.startSeconds}s</span>
                      </div>
                    </div>
                    
                    <div className="subtitle-content">
                      <div className="speaker-label">
                        <i className="fas fa-user"></i>
                        <span>{subtitle.speaker}</span>
                      </div>
                      <textarea
                        className="subtitle-text"
                        value={subtitle.text}
                        onChange={(e) => handleSubtitleEdit(subtitle.id, e.target.value)}
                      />
                    </div>

                    <div className="subtitle-actions">
                      <button onClick={() => splitSubtitle(subtitle.id, 'word')}>
                        <i className="fas fa-cut"></i> Split at word
                      </button>
                      <button onClick={() => splitSubtitle(subtitle.id, 'half')}>
                        <i className="fas fa-cut"></i> Split into half
                      </button>
                      <button onClick={() => mergeWithAbove(subtitle.id)}>
                        <i className="fas fa-arrow-up"></i> Merge with above
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'speakers' && (
            <div className="speakers-editor">
              <h3>Speakers</h3>
              <div className="speakers-list">
                {speakers.map((speaker) => (
                  <div key={speaker.id} className="speaker-item">
                    <span className="speaker-number">{speaker.id + 1}.</span>
                    <span className="speaker-name">{speaker.name}</span>
                    <button className="edit-speaker">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                ))}
                <button className="add-speaker">Add Speaker</button>
              </div>
            </div>
          )}

          {activeTab === 'translations' && (
            <div className="translations-editor">
              <h3>Translations</h3>
              <p>Translation features coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-editor">
              <div className="settings-header">
                <h3>Guidelines</h3>
                <label className="speaker-names-toggle">
                  <input
                    type="checkbox"
                    checked={settings.includeSpeakerNames}
                    onChange={(e) => setSettings(s => ({ ...s, includeSpeakerNames: e.target.checked }))}
                  />
                  Include Speaker names in Subtitles
                </label>
              </div>

              <div className="settings-form">
                <div className="setting-group">
                  <label>Max characters per section</label>
                  <select 
                    value={settings.maxCharacters}
                    onChange={(e) => setSettings(s => ({ ...s, maxCharacters: parseInt(e.target.value) }))}
                  >
                    <option value={42}>42 characters</option>
                    <option value={64}>64 characters</option>
                    <option value={82}>82 characters</option>
                    <option value={100}>100 characters</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label>Max lines per subtitle section</label>
                  <select 
                    value={settings.maxLines}
                    onChange={(e) => setSettings(s => ({ ...s, maxLines: parseInt(e.target.value) }))}
                  >
                    <option value={1}>1 line</option>
                    <option value={2}>2 lines</option>
                    <option value={3}>3 lines</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label>Min duration per subtitle section (seconds)</label>
                  <select 
                    value={settings.minDuration}
                    onChange={(e) => setSettings(s => ({ ...s, minDuration: parseFloat(e.target.value) }))}
                  >
                    <option value={0.5}>0.5 second</option>
                    <option value={1}>1 second</option>
                    <option value={1.5}>1.5 seconds</option>
                    <option value={2}>2 seconds</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label>Max duration per subtitle section (seconds)</label>
                  <select 
                    value={settings.maxDuration}
                    onChange={(e) => setSettings(s => ({ ...s, maxDuration: parseInt(e.target.value) }))}
                  >
                    <option value={4}>4 seconds</option>
                    <option value={5}>5 seconds</option>
                    <option value={6}>6 seconds</option>
                    <option value={7}>7 seconds</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="video-player">
          <div className="player-container">
            <div className="video-placeholder">
              <div className="audio-visualizer">
                <i className="fas fa-volume-up"></i>
                <p>Audio Player</p>
                <p>{project.name}</p>
              </div>
            </div>
            
            <div className="player-controls">
              <button className="control-btn">
                <i className="fas fa-step-backward"></i>
              </button>
              <button className="control-btn">
                <i className="fas fa-backward"></i>
              </button>
              <button className="control-btn play-pause">
                <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
              </button>
              <button className="control-btn">
                <i className="fas fa-forward"></i>
              </button>
              <button className="control-btn">
                <i className="fas fa-step-forward"></i>
              </button>
              <span className="beta-badge">Beta</span>
            </div>

            <div className="timeline">
              <span className="time-display">00:00:15</span>
              <span className="time-separator">/</span>
              <span className="total-time">00:02:34</span>
              <button className="timeline-search">
                <i className="fas fa-search"></i>
              </button>
              <div className="volume-control">
                <input type="range" min="0" max="100" defaultValue="70" />
              </div>
            </div>
          </div>

          <div className="waveform-container">
            <div className="waveform">
              {/* Waveform visualization would go here */}
              <div className="subtitle-blocks">
                {subtitles.map((sub) => (
                  <div 
                    key={sub.id}
                    className="subtitle-block"
                    style={{
                      left: `${(sub.startSeconds / 154) * 100}%`,
                      width: `${((sub.endSeconds - sub.startSeconds) / 154) * 100}%`
                    }}
                  >
                    {sub.text.substring(0, 50)}...
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
