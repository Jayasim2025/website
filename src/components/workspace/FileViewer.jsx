"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../../styles/workspace/FileViewer.css"

const FileViewer = ({ file, onClose }) => {
  const [activeTab, setActiveTab] = useState("transcription")
  const [editMode, setEditMode] = useState(false)

  // Mock transcript data
  const transcriptData = [
    {
      id: 1,
      speaker: "Speaker 0",
      text: "Did you know that Tupac's mother, Afeni Shakur, was an active member of the Black Panther",
      timeStart: "0.0s",
      timeEnd: "5.0s",
    },
    {
      id: 2,
      speaker: "Speaker 0",
      text: "Party and named him after Tupac Amaru the second, an eighteenth century political leader",
      timeStart: "5.0s",
      timeEnd: "10.8s",
    },
    {
      id: 3,
      speaker: "Speaker 0",
      text: "from Peru? Additionally, Tupac studied poetry and literature extensively during his",
      timeStart: "10.8s",
      timeEnd: "16.2s",
    },
  ]

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  const contentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: 50, opacity: 0, transition: { duration: 0.3 } },
  }

  const handleDownload = () => {
    // In a real app, this would generate and download the transcript or subtitles
    alert("Downloading transcript...")
  }

  const handleEdit = () => {
    setEditMode(!editMode)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="file-viewer-overlay"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="file-viewer" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
          <div className="file-viewer-header">
            <div className="file-info">
              <h2>{file.name}</h2>
              <div className="file-meta">
                <span className="file-type">{file.type.includes("audio") ? "Audio" : "Video"}</span>
                <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                <span className="file-date">{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="file-actions">
              <button className="action-button download" onClick={handleDownload}>
                <i className="fas fa-download"></i>
                <span>Download</span>
              </button>
              <button className="action-button edit" onClick={handleEdit}>
                <i className={`fas ${editMode ? "fa-save" : "fa-edit"}`}></i>
                <span>{editMode ? "Save" : "Edit"}</span>
              </button>
              <button className="action-button close" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="file-viewer-tabs">
            <button
              className={`tab-button ${activeTab === "transcription" ? "active" : ""}`}
              onClick={() => setActiveTab("transcription")}
            >
              <i className="fas fa-file-alt"></i>
              <span>Transcription</span>
            </button>
            <button
              className={`tab-button ${activeTab === "subtitles" ? "active" : ""}`}
              onClick={() => setActiveTab("subtitles")}
            >
              <i className="fas fa-closed-captioning"></i>
              <span>Subtitles</span>
            </button>
            <button
              className={`tab-button ${activeTab === "logs" ? "active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <i className="fas fa-list"></i>
              <span>Logs</span>
            </button>
          </div>

          <div className="file-viewer-content">
            {activeTab === "transcription" && (
              <div className="transcription-view">
                <div className="media-player">
                  {file.type.includes("audio") ? (
                    <div className="audio-player">
                      <div className="audio-waveform">
                        <div className="waveform-placeholder"></div>
                      </div>
                      <div className="audio-controls">
                        <button className="play-button">
                          <i className="fas fa-play"></i>
                        </button>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: "0%" }}></div>
                        </div>
                        <span className="time-display">0:00 / 0:22</span>
                      </div>
                    </div>
                  ) : (
                    <div className="video-player">
                      <div className="video-placeholder">
                        <i className="fas fa-film"></i>
                        <span>Video Preview</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="transcript-container">
                  <div className="transcript-header">
                    <div className="transcript-column">#</div>
                    <div className="transcript-column">Speaker</div>
                    <div className="transcript-column">Text</div>
                    <div className="transcript-column">Time</div>
                  </div>

                  <div className="transcript-items">
                    {transcriptData.map((item) => (
                      <div key={item.id} className="transcript-item">
                        <div className="transcript-column">{item.id}</div>
                        <div className="transcript-column">{item.speaker}</div>
                        <div className="transcript-column">
                          {editMode ? (
                            <textarea defaultValue={item.text} className="transcript-edit"></textarea>
                          ) : (
                            item.text
                          )}
                        </div>
                        <div className="transcript-column">
                          {item.timeStart} - {item.timeEnd}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subtitles" && (
              <div className="subtitles-view">
                <div className="languages-list">
                  <h3>Available Languages</h3>
                  <div className="language-items">
                    {file.languages &&
                      file.languages.map((lang) => {
                        const languageName =
                          {
                            en: "English",
                            es: "Spanish",
                            fr: "French",
                            de: "German",
                            it: "Italian",
                            pt: "Portuguese",
                            ru: "Russian",
                            ja: "Japanese",
                            ko: "Korean",
                            zh: "Chinese",
                            ar: "Arabic",
                            hi: "Hindi",
                          }[lang] || lang

                        return (
                          <div key={lang} className="language-item">
                            <span className="language-name">{languageName}</span>
                            <div className="language-actions">
                              <button className="language-action download">
                                <i className="fas fa-download"></i>
                              </button>
                              <button className="language-action edit">
                                <i className="fas fa-edit"></i>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>

                <div className="subtitle-preview">
                  <h3>Subtitle Preview</h3>
                  <div className="subtitle-timeline">
                    <div className="timeline-markers">
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className="timeline-marker">
                          <div className="marker-line"></div>
                          <div className="marker-time">{i < 10 ? `0:0${i}` : `0:${i}`}</div>
                        </div>
                      ))}
                    </div>

                    <div className="subtitle-segments">
                      <div className="subtitle-segment" style={{ left: "0%", width: "20%" }}>
                        <div className="segment-content">Did you know that Tupac's mother...</div>
                      </div>
                      <div className="subtitle-segment" style={{ left: "22%", width: "25%" }}>
                        <div className="segment-content">Party and named him after Tupac Amaru...</div>
                      </div>
                      <div className="subtitle-segment" style={{ left: "50%", width: "30%" }}>
                        <div className="segment-content">from Peru? Additionally, Tupac studied...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "logs" && (
              <div className="logs-view">
                <h3>Text Generation Jobs</h3>
                <p className="logs-description">
                  View all AI generation jobs created for this project, including transcriptions and translations.
                </p>

                <div className="logs-table">
                  <div className="logs-header">
                    <div className="logs-column">#</div>
                    <div className="logs-column">Type</div>
                    <div className="logs-column">Language</div>
                    <div className="logs-column">Status</div>
                    <div className="logs-column">Created At</div>
                    <div className="logs-column">Description</div>
                  </div>

                  <div className="logs-items">
                    <div className="logs-item">
                      <div className="logs-column">1</div>
                      <div className="logs-column">Speech to Text</div>
                      <div className="logs-column">en</div>
                      <div className="logs-column">
                        <span className="status-badge completed">completed</span>
                      </div>
                      <div className="logs-column">{new Date(file.uploadedAt).toLocaleString()}</div>
                      <div className="logs-column">This AI job generated a transcription from the media file.</div>
                    </div>

                    {file.languages &&
                      file.languages
                        .filter((lang) => lang !== "en")
                        .map((lang, index) => (
                          <div key={lang} className="logs-item">
                            <div className="logs-column">{index + 2}</div>
                            <div className="logs-column">Translation</div>
                            <div className="logs-column">{lang}</div>
                            <div className="logs-column">
                              <span className="status-badge completed">completed</span>
                            </div>
                            <div className="logs-column">{new Date(file.uploadedAt).toLocaleString()}</div>
                            <div className="logs-column">This AI job translated the transcript to {lang}.</div>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FileViewer
