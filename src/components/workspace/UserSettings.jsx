"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../../styles/workspace/UserSettings.css"

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState("account")
  const [userInfo, setUserInfo] = useState({
    name: "User",
    email: "lithins147@gmail.com",
    password: ""
  })

  const handleUpdateProfile = () => {
    // API call to update profile
    console.log("Updating profile...")
  }

  const handleUpdateEmail = () => {
    // API call to update email
    console.log("Updating email...")
  }

  const handleUpdatePassword = () => {
    // API call to update password
    console.log("Updating password...")
  }

  const generateApiKey = () => {
    // API call to generate new API key
    console.log("Generating API key...")
  }

  return (
    <div className="user-settings-container">
      <div className="settings-header">
        <h1>User Settings</h1>
        <p>Manage your account and security settings here.</p>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <i className="fas fa-user"></i>
            <span>Account Settings</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <i className="fas fa-shield-alt"></i>
            <span>Security</span>
          </button>
          <button
            className={`settings-tab ${activeTab === "developer" ? "active" : ""}`}
            onClick={() => setActiveTab("developer")}
          >
            <i className="fas fa-code"></i>
            <span>Developer Settings</span>
          </button>
        </div>

        <div className="settings-panel">
          {activeTab === "account" && (
            <div className="account-settings">
              <h2>Account Settings</h2>
              <p>Manage your account settings here.</p>

              <div className="settings-section">
                <h3>Avatar</h3>
                <div className="avatar-section">
                  <div className="avatar-display">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                      alt="User avatar"
                      className="user-avatar"
                    />
                    <button className="avatar-upload">
                      <i className="fas fa-camera"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h3>Name</h3>
                <div className="form-group">
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <motion.button
                  className="update-button"
                  onClick={handleUpdateProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Update
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="security-settings">
              <h2>Security Settings</h2>
              <p>Manage your login credentials here.</p>

              <div className="settings-section">
                <h3>Update Email</h3>
                <div className="form-group">
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <motion.button
                  className="update-button"
                  onClick={handleUpdateEmail}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Update Email
                </motion.button>
              </div>

              <div className="settings-section">
                <h3>Update Password</h3>
                <div className="form-group">
                  <input
                    type="password"
                    value={userInfo.password}
                    onChange={(e) => setUserInfo({...userInfo, password: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
                <motion.button
                  className="update-button"
                  onClick={handleUpdatePassword}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Update Password
                </motion.button>
              </div>
            </div>
          )}

          {activeTab === "developer" && (
            <div className="developer-settings">
              <h2>Developer Settings</h2>
              <p>Manage your developer settings here.</p>

              <div className="settings-section">
                <motion.button
                  className="generate-key-button"
                  onClick={generateApiKey}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate API Key
                </motion.button>
              </div>

              <div className="settings-section">
                <h3>Active API Keys</h3>
                <div className="api-keys-list">
                  <p className="no-keys">No active API keys</p>
                </div>
              </div>

              <div className="settings-section">
                <h3>Revoked Keys</h3>
                <div className="revoked-keys">
                  <p className="no-keys">No revoked keys</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSettings
