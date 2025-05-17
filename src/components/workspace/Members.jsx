"use client"

import { motion } from "framer-motion"
import "../../styles/workspace/Members.css"

const Members = () => {
  // Sample member data
  const members = [
    {
      id: 1,
      name: "Lithin",
      email: "lithins147@gmail.com",
      role: "Owner",
      joinedOn: "25 Apr 2025",
    },
  ]

  return (
    <div className="members-container">
      <div className="members-header">
        <h1>Team Members</h1>
        <motion.button className="invite-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-user-plus"></i>
          <span>Invite user</span>
        </motion.button>
      </div>

      <div className="members-table">
        <div className="table-header">
          <div className="header-cell">#</div>
          <div className="header-cell">Name</div>
          <div className="header-cell">Role</div>
          <div className="header-cell">Joined On</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {members.map((member) => (
            <div className="table-row" key={member.id}>
              <div className="cell">{member.id}</div>
              <div className="cell member-info">
                <span className="member-name">{member.name}</span>
                <span className="member-email">{member.email}</span>
              </div>
              <div className="cell">{member.role}</div>
              <div className="cell">{member.joinedOn}</div>
              <div className="cell actions">
                <button className="action-button">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="member-limit-notice">
        <div className="notice-content">
          <span>Member limit reached (1/1)</span>
          <a href="#" className="learn-more">
            Learn more
          </a>
        </div>
        <motion.button className="upgrade-plan-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Upgrade Plan
        </motion.button>
      </div>

      <div className="invitations-section">
        <h2>Invitations</h2>
        <p className="no-invitations">No pending invitations</p>
      </div>
    </div>
  )
}

export default Members
