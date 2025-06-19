"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/Members.css"

const Members = () => {
  const navigate = useNavigate()

  // State for invite dialog
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Read Only Member")
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  // Sample member data
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Lithin",
      email: "lithins147@gmail.com",
      role: "Owner",
      joinedOn: "25 Apr 2025",
    },
  ])

  const [pendingInvitations, setPendingInvitations] = useState([])

  const roles = ["Admin", "Member", "Read Only Member"]

  const handleUpgradePlan = () => {
    navigate("/workspace/billing")
  }

  const handleInviteUser = () => {
    if (inviteEmail.trim()) {
      const newInvitation = {
        id: Date.now(),
        email: inviteEmail,
        role: inviteRole,
        invitedOn: new Date().toLocaleDateString(),
        status: "Pending",
      }

      setPendingInvitations([...pendingInvitations, newInvitation])
      console.log("User invited:", newInvitation)

      // Reset form
      setInviteEmail("")
      setInviteRole("Read Only Member")
      setShowInviteDialog(false)

      // Show success message
      alert(`Invitation sent to ${inviteEmail}`)
    }
  }

  const cancelInvitation = (invitationId) => {
    setPendingInvitations(pendingInvitations.filter((inv) => inv.id !== invitationId))
  }

  return (
    <div className="members-container">
      <div className="members-header">
        <h1>Team Members</h1>
        <motion.button
          className="invite-button"
          onClick={() => setShowInviteDialog(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
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
          {members.map((member, index) => (
            <div className="table-row" key={member.id}>
              <div className="cell">{index + 1}</div>
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
        <motion.button
          className="upgrade-plan-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpgradePlan}
        >
          Upgrade Plan
        </motion.button>
      </div>

      <div className="invitations-section">
        <h2>Team Invitations</h2>
        {pendingInvitations.length === 0 ? (
          <p className="no-invitations">No pending invitations</p>
        ) : (
          <div className="invitations-list">
            {pendingInvitations.map((invitation) => (
              <div key={invitation.id} className="invitation-item">
                <div className="invitation-info">
                  <span className="invitation-email">{invitation.email}</span>
                  <span className="invitation-role">{invitation.role}</span>
                  <span className="invitation-date">Invited on {invitation.invitedOn}</span>
                </div>
                <div className="invitation-actions">
                  <span className="invitation-status">{invitation.status}</span>
                  <button className="cancel-invitation" onClick={() => cancelInvitation(invitation.id)}>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite User Dialog */}
      <AnimatePresence>
        {showInviteDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInviteDialog(false)}
          >
            <motion.div
              className="invite-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Invite organization member</h3>
                <button className="dialog-close" onClick={() => setShowInviteDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="dialog-content">
                <p>Invite a member to your organization.</p>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="email-input"
                  />
                </div>

                <div className="form-group">
                  <div className="role-dropdown">
                    <button className="role-select" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
                      {inviteRole}
                      <i className="fas fa-chevron-down"></i>
                    </button>

                    {showRoleDropdown && (
                      <div className="role-options">
                        <div className="role-header">Organization Roles</div>
                        {roles.map((role) => (
                          <button
                            key={role}
                            className={`role-option ${inviteRole === role ? "selected" : ""}`}
                            onClick={() => {
                              setInviteRole(role)
                              setShowRoleDropdown(false)
                            }}
                          >
                            {inviteRole === role && <i className="fas fa-check"></i>}
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="dialog-actions">
                <button className="cancel-btn" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </button>
                <button className="invite-btn" onClick={handleInviteUser}>
                  Invite
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Members
