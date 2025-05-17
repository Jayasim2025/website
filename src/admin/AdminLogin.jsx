"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/admin/AdminLogin.css"

const AdminLogin = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // For demo purposes, using a simple check
    // In a real app, you would validate against a backend
    if (username === "admin" && password === "admin123") {
      navigate("/admin/dashboard")
    } else {
      setError("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="admin-login-container">
      <div className="background-canvas">{/* This will be replaced by the 3D background */}</div>

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="logo-icon">T</div>
          <h2>Translatea2z Admin</h2>
          <p>Enter your credentials to access the admin panel</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Login to Admin Panel
          </button>
        </form>

        <div className="login-demo-info">
          <p>For demo purposes, use:</p>
          <p className="demo-credentials">Username: admin | Password: admin123</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
