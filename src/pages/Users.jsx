"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import "../styles/admin/Users.css"

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Sample user data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-05-15",
      lastActive: "2023-06-20",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Editor",
      status: "Active",
      joinDate: "2023-04-10",
      lastActive: "2023-06-19",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "Viewer",
      status: "Inactive",
      joinDate: "2023-03-22",
      lastActive: "2023-05-01",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "Editor",
      status: "Active",
      joinDate: "2023-06-01",
      lastActive: "2023-06-21",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.wilson@example.com",
      role: "Viewer",
      status: "Pending",
      joinDate: "2023-06-15",
      lastActive: "2023-06-15",
    },
    {
      id: 6,
      name: "Sarah Brown",
      email: "sarah.brown@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-02-10",
      lastActive: "2023-06-18",
    },
  ]

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="users-container">
      <div className="users-header">
        <h1>User Management</h1>
        <motion.button className="add-user-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-plus"></i>
          <span>Add User</span>
        </motion.button>
      </div>

      <div className="users-filters">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="header-cell">ID</div>
          <div className="header-cell">Name</div>
          <div className="header-cell">Email</div>
          <div className="header-cell">Role</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Join Date</div>
          <div className="header-cell">Last Active</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {filteredUsers.map((user) => (
            <div className="table-row" key={user.id}>
              <div className="cell">{user.id}</div>
              <div className="cell">{user.name}</div>
              <div className="cell">{user.email}</div>
              <div className="cell">
                <span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span>
              </div>
              <div className="cell">
                <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
              </div>
              <div className="cell">{user.joinDate}</div>
              <div className="cell">{user.lastActive}</div>
              <div className="cell actions">
                <button className="action-button edit">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-button delete">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination">
        <button className="pagination-button">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="pagination-button active">1</button>
        <button className="pagination-button">2</button>
        <button className="pagination-button">3</button>
        <span className="pagination-ellipsis">...</span>
        <button className="pagination-button">10</button>
        <button className="pagination-button">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
}

export default Users
