"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../../styles/workspace/Settings.css"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your workspace settings and preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <i className="fas fa-cog"></i>
            <span>General</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "speech" ? "active" : ""}`}
            onClick={() => setActiveTab("speech")}
          >
            <i className="fas fa-microphone"></i>
            <span>Speech to Text</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "translation" ? "active" : ""}`}
            onClick={() => setActiveTab("translation")}
          >
            <i className="fas fa-language"></i>
            <span>Translation</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <i className="fas fa-paint-brush"></i>
            <span>Appearance</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === "general" && (
            <div className="general-settings">
              <h2>General Settings</h2>
              <div className="settings-section">
                <h3>Workspace Information</h3>
                <div className="form-group">
                  <label>Workspace Name</label>
                  <input type="text" defaultValue="Personal" />
                </div>
                <div className="form-group">
                  <label>Workspace Description</label>
                  <textarea defaultValue="My personal workspace for transcription and translation projects"></textarea>
                </div>
              </div>

              <div className="settings-section">
                <h3>Default Language</h3>
                <div className="form-group">
                  <label>Interface Language</label>
                  <select defaultValue="en">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>

              <div className="settings-actions">
                <motion.button className="save-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Save Changes
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === "speech" && (
            <div className="speech-settings">
              <div className="settings-header-with-badge">
                <h2>Speech to Text Settings</h2>
                <span className="premium-badge">
                  <i className="fas fa-crown"></i> PREMIUM
                </span>
              </div>

              <div className="settings-info">
                <i className="fas fa-info-circle"></i>
                <p>Configure default subtitle generation behavior for all new projects in this workspace</p>
              </div>

              <div className="settings-section">
                <h3>Text Layout</h3>
                <div className="form-group">
                  <label>Max characters per section</label>
                  <div className="select-with-info">
                    <select defaultValue="82">
                      <option value="42">42 characters</option>
                      <option value="64">64 characters</option>
                      <option value="82">82 characters</option>
                      <option value="100">100 characters</option>
                    </select>
                    <button className="info-button">
                      <i className="fas fa-question-circle"></i>
                    </button>
                  </div>
                  <p className="form-hint">Industry standard is typically 64-84 characters</p>
                </div>

                <div className="form-group">
                  <label>Max lines per section</label>
                  <div className="select-with-info">
                    <select defaultValue="2">
                      <option value="1">1 line</option>
                      <option value="2">2 lines</option>
                      <option value="3">3 lines</option>
                    </select>
                    <button className="info-button">
                      <i className="fas fa-question-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Timing</h3>
                <div className="form-group">
                  <label>Min duration (seconds)</label>
                  <div className="select-with-info">
                    <select defaultValue="1">
                      <option value="0.5">0.5 second</option>
                      <option value="1">1 second</option>
                      <option value="1.5">1.5 seconds</option>
                      <option value="2">2 seconds</option>
                    </select>
                    <button className="info-button">
                      <i className="fas fa-question-circle"></i>
                    </button>
                  </div>
                  <p className="form-hint">1-1.5 seconds minimum is recommended for readability</p>
                </div>

                <div className="form-group">
                  <label>Max duration (seconds)</label>
                  <div className="select-with-info">
                    <select defaultValue="6">
                      <option value="4">4 seconds</option>
                      <option value="5">5 seconds</option>
                      <option value="6">6 seconds</option>
                      <option value="7">7 seconds</option>
                    </select>
                    <button className="info-button">
                      <i className="fas fa-question-circle"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-actions">
                <motion.button className="upgrade-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Upgrade Now
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === "translation" && (
            <div className="translation-settings">
              <h2>Translation Settings</h2>
              <div className="settings-section">
                <h3>Default Languages</h3>
                <div className="form-group">
                  <label>Source Language</label>
                  <select defaultValue="en">
                    <option value="auto">Auto-detect</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Languages</label>
                  <div className="target-languages">
                    <div className="language-tag">
                      English <i className="fas fa-times"></i>
                    </div>
                    <div className="language-tag">
                      Spanish <i className="fas fa-times"></i>
                    </div>
                    <div className="language-tag">
                      French <i className="fas fa-times"></i>
                    </div>
                    <div className="language-tag add">
                      <i className="fas fa-plus"></i> Add Language
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Translation Quality</h3>
                <div className="form-group">
                  <label>Translation Model</label>
                  <select defaultValue="advanced">
                    <option value="standard">Standard</option>
                    <option value="advanced">Advanced</option>
                    <option value="premium">Premium (Business Plan Only)</option>
                  </select>
                  <p className="form-hint">Advanced model provides better quality for most languages</p>
                </div>
              </div>

              <div className="settings-actions">
                <motion.button className="save-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Save Changes
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
