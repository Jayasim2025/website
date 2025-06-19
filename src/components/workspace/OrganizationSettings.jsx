"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../../styles/workspace/OrganizationSettings.css"

const OrganizationSettings = () => {
  const [activeTab, setActiveTab] = useState("home")
  const [organizationTitle, setOrganizationTitle] = useState("Personal")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showTeamsDialog, setShowTeamsDialog] = useState(false)
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Read Only Member")
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")

  // Initialize teams with only workspace name
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem("organizationTeams")
    if (savedTeams) {
      return JSON.parse(savedTeams)
    }
    return [
      {
        id: 0,
        name: "Team Translatea2z",
        createdOn: "8 months ago",
        isWorkspace: true,
      },
    ]
  })

  const navigate = useNavigate()

  const organizationMembers = [
    {
      id: 1,
      name: "User",
      role: "Owner",
      joinedOn: "26 May 2025",
      email: "user@example.com",
    },
  ]

  const roles = ["Admin", "Member", "Read Only Member"]

  const handleUpdateTitle = () => {
    console.log("Organization title updated:", organizationTitle)
  }

  const handleInviteUser = () => {
    if (inviteEmail.trim()) {
      console.log("Inviting user:", { email: inviteEmail, role: inviteRole })
      setInviteEmail("")
      setInviteRole("Read Only Member")
      setShowInviteDialog(false)
    }
  }

  const handleUpgradePlan = () => {
    navigate("/workspace/billing")
  }

  const handleViewBilling = () => {
    navigate("/workspace/billing")
  }

  // Team management functions
  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      const newTeam = {
        id: Date.now(),
        name: newTeamName.trim(),
        createdOn: new Date().toLocaleDateString(),
        isWorkspace: false,
      }

      const updatedTeams = [...teams, newTeam]
      setTeams(updatedTeams)
      setNewTeamName("")
      setShowCreateTeamDialog(false)

      // Save to localStorage
      localStorage.setItem("organizationTeams", JSON.stringify(updatedTeams))

      alert(`Team "${newTeam.name}" created successfully!`)
    }
  }

  return (
    <div className="organization-settings">
      {/* Header */}
      <div className="org-header">
        <div className="org-header-left">
          <button className="back-btn" onClick={() => navigate("/workspace")}>
            <i className="fas fa-arrow-left"></i>
            BACK TO ORGANIZATION
          </button>
          <div className="org-title-section">
            <h1 className="org-title">{organizationTitle}</h1>
            <div className="org-badges">
              <span className="owner-badge">OWNER</span>
              <span className="credits-badge">Credits : 100</span>
              <button className="view-teams-btn" onClick={() => setShowTeamsDialog(true)}>
                View Teams
              </button>
              <button className="view-settings-btn">
                <i className="fas fa-cog"></i>
                View Organization Settings
              </button>
            </div>
          </div>
        </div>
        <div className="org-header-right">
          <span className="created-date">Created 23 days ago</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="org-nav-tabs">
        <button className={`org-tab ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
          <i className="fas fa-home"></i>
          Home
        </button>
        <button
          className={`org-tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          <i className="fas fa-edit"></i>
          General
        </button>
        <button
          className={`org-tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <i className="fas fa-users"></i>
          Organization Members
        </button>
        <button
          className={`org-tab ${activeTab === "billing" ? "active" : ""}`}
          onClick={() => setActiveTab("billing")}
        >
          <i className="fas fa-credit-card"></i>
          Billing
        </button>
      </div>

      {/* Tab Content */}
      <div className="org-content">
        {activeTab === "home" && (
          <div className="home-tab">
            <h2>Organization Dashboard</h2>
            <p>Welcome to your organization dashboard. Manage your team, settings, and billing from here.</p>
          </div>
        )}

        {activeTab === "general" && (
          <div className="general-tab">
            <div className="edit-title-section">
              <h2>Edit Organization Title</h2>
              <p>This is the title that will be displayed on the organization page.</p>
              <input
                type="text"
                value={organizationTitle}
                onChange={(e) => setOrganizationTitle(e.target.value)}
                className="title-input"
              />
              <button className="update-btn" onClick={handleUpdateTitle}>
                Update
              </button>
            </div>

            <div className="default-org-section">
              <h2>Default Organization</h2>
              <p>
                If you have multiple organizations, you can set a default organization, which will be the organization
                that you are first taken to when you log in.
              </p>
              <button className="set-default-btn">Set as default</button>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="members-tab">
            <div className="members-header">
              <h2>Organization Members</h2>
              <button className="invite-user-btn" onClick={() => setShowInviteDialog(true)}>
                <i className="fas fa-plus"></i>
                Invite User
              </button>
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
                {organizationMembers.map((member, index) => (
                  <div key={member.id} className="table-row">
                    <div className="cell">{index + 1}</div>
                    <div className="cell">{member.name}</div>
                    <div className="cell">{member.role}</div>
                    <div className="cell">{member.joinedOn}</div>
                    <div className="cell">
                      <button className="action-btn">
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="team-invitations">
              <h3>Team invitations</h3>
              <p className="no-invitations">No pending invitations</p>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="billing-tab">
            <div className="billing-redirect">
              <h2>Billing & Plans</h2>
              <p>Manage your subscription and billing information.</p>
              <button className="view-billing-btn" onClick={handleViewBilling}>
                View Billing Details
              </button>
            </div>
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

      {/* View Teams Dialog */}
      <AnimatePresence>
        {showTeamsDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTeamsDialog(false)}
          >
            <motion.div
              className="teams-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Organization Teams</h3>
                <button className="dialog-close" onClick={() => setShowTeamsDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="teams-content">
                <div className="teams-table">
                  <div className="teams-table-header">
                    <div className="teams-header-cell">Row</div>
                    <div className="teams-header-cell">Team Name</div>
                    <div className="teams-header-cell">View Team</div>
                    <div className="teams-header-cell">Created On</div>
                  </div>

                  <div className="teams-table-body">
                    {teams.map((team, index) => (
                      <div key={team.id} className="teams-table-row">
                        <div className="teams-cell">{index + 1}</div>
                        <div className="teams-cell">
                          {team.name}
                          {team.isWorkspace && <span className="workspace-badge">Workspace</span>}
                        </div>
                        <div className="teams-cell">
                          <button className="view-team-btn">View</button>
                        </div>
                        <div className="teams-cell">{team.createdOn}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="teams-actions">
                  <button className="create-team-btn" onClick={() => setShowCreateTeamDialog(true)}>
                    <i className="fas fa-users"></i>
                    Create Team
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Team Dialog */}
      <AnimatePresence>
        {showCreateTeamDialog && (
          <motion.div
            className="dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateTeamDialog(false)}
          >
            <motion.div
              className="create-team-dialog"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="dialog-header">
                <h3>Create New Team</h3>
                <button className="dialog-close" onClick={() => setShowCreateTeamDialog(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="dialog-content">
                <p>Enter a name for your new team.</p>
                <div className="form-group">
                  <label>Team Name</label>
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="team-name-input"
                  />
                </div>
              </div>

              <div className="dialog-actions">
                <button className="cancel-btn" onClick={() => setShowCreateTeamDialog(false)}>
                  Cancel
                </button>
                <button className="create-btn" onClick={handleCreateTeam}>
                  Create Team
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OrganizationSettings
