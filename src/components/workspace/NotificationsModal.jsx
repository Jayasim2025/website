"use client"

import { motion } from "framer-motion"
import "../../styles/workspace/NotificationsModal.css"

const NotificationsModal = ({ closeNotifications, theme }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeNotifications()
    }
  }

  const notifications = [
    {
      id: 1,
      type: "text-track",
      title: "New Text Track Created",
      message:
        'A new text track "Generated Text Track" has been created for project "ElevenLabs_2023-07-14T10_42_32.000Z_Adam_KuGyWUvu4suo4hmhaP7k.mp3"',
      time: "a month ago",
      icon: "fas fa-edit",
    },
    {
      id: 2,
      type: "project",
      title: "Project Processing Complete",
      message: "Your project has been successfully processed and is ready for editing.",
      time: "2 days ago",
      icon: "fas fa-check-circle",
    },
    {
      id: 3,
      type: "export",
      title: "Export Ready",
      message: "Your subtitle export is ready for download.",
      time: "1 week ago",
      icon: "fas fa-download",
    },
  ]

  return (
    <motion.div
      className="notifications-backdrop"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="notifications-modal"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="notifications-header">
          <h3>Notifications</h3>
          <button className="close-notifications" onClick={closeNotifications}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="notifications-content">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon">
                  <i className={notification.icon}></i>
                </div>
                <div className="notification-details">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-notifications">
              <i className="fas fa-bell-slash"></i>
              <p>No notifications yet</p>
            </div>
          )}
        </div>

        <div className="notifications-footer">
          <button className="mark-all-read">Mark all as read</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default NotificationsModal
