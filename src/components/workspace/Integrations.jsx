"use client"

import { motion } from "framer-motion"
import "../../styles/workspace/Integrations.css"

const Integrations = () => {
  // Sample integrations data
  const integrations = [
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Import and export files to Google Drive",
      icon: "https://cdn-icons-png.flaticon.com/512/2965/2965327.png",
      status: "available",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Import and export files to Dropbox",
      icon: "https://cdn-icons-png.flaticon.com/512/174/174845.png",
      status: "coming-soon",
    },
    {
      id: "wistia",
      name: "Wistia",
      description: "Connect with Wistia for video hosting",
      icon: "https://cdn-icons-png.flaticon.com/512/732/732212.png",
      status: "available",
    },
    {
      id: "brightcove",
      name: "Brightcove",
      description: "Integrate with Brightcove video platform",
      icon: "https://cdn-icons-png.flaticon.com/512/5968/5968875.png",
      status: "coming-soon",
    },
  ]

  return (
    <div className="integrations-container">
      <div className="integrations-header">
        <h1>Integrations</h1>
        <motion.button className="add-integration-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-plus-circle"></i>
          <span>Add Integration</span>
        </motion.button>
      </div>

      <div className="integration-section">
        <h2>Connect to External Services</h2>
        <p>Connect your workspace to external services to import and export files.</p>

        <div className="integrations-grid">
          {integrations.map((integration) => (
            <div className="integration-card" key={integration.id}>
              <div className="integration-icon">
                <img src={integration.icon || "/placeholder.svg"} alt={integration.name} />
              </div>
              <div className="integration-info">
                <div className="integration-header">
                  <h3>{integration.name}</h3>
                  {integration.status === "coming-soon" && <span className="coming-soon-badge">Coming Soon</span>}
                </div>
                <p>{integration.description}</p>
              </div>
              {integration.status === "available" ? (
                <motion.button className="connect-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Connect
                </motion.button>
              ) : (
                <button className="coming-soon-button" disabled>
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="active-integrations">
        <h2>Active Integrations</h2>
        <div className="empty-integrations">
          <div className="empty-icon">
            <i className="fas fa-plug"></i>
          </div>
          <p>No active integrations</p>
          <span>Connect to external services to import and export your files</span>
        </div>
      </div>
    </div>
  )
}

export default Integrations
