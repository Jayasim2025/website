"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import "../styles/LoginModal.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// Update the API_BASE_URL to use the AWS EC2 instance
const API_BASE_URL = "http://ec2-54-169-176-135.ap-southeast-1.compute.amazonaws.com:8080"

const LoginModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  // Update the handleSubmit function to use the correct endpoints
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create headers with CORS settings
      const headers = {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      }

      if (isLogin) {
        // Login API call
        const response = await axios.post(
          `${API_BASE_URL}/auth/v1/login`,
          {
            email,
            password,
          },
          { headers },
        )

        // Store token in localStorage
        if (response.data && response.data.token) {
          localStorage.setItem("auth_token", response.data.token)
          console.log("Login successful:", response.data)
          navigate("/workspace")
        } else {
          setError("Invalid response from server")
        }
      } else {
        // Signup API call
        const response = await axios.post(
          `${API_BASE_URL}/auth/v1/signup`,
          {
            email,
            password,
            fullName: name,
          },
          { headers },
        )

        console.log("Signup successful:", response.data)

        // Auto login after signup
        if (response.data && response.data.success) {
          const loginResponse = await axios.post(
            `${API_BASE_URL}/auth/v1/login`,
            {
              email,
              password,
            },
            { headers },
          )

          if (loginResponse.data && loginResponse.data.token) {
            localStorage.setItem("auth_token", loginResponse.data.token)
            navigate("/workspace")
          }
        } else {
          setError("Account created but couldn't log in automatically")
        }
      }
    } catch (err) {
      console.error("Auth error:", err.response?.data || err.message || err)
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials and try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setError("")
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="login-modal"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-header">
          <div className="modal-logo">
            <div className="logo-icon">T</div>
          </div>
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Sign in to continue to Translatea2z" : "Get started with your free account"}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required={!isLogin}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          {isLogin && (
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
          )}

          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <motion.button
                type="button"
                className="social-button google"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fab fa-google"></i>
              </motion.button>
              <motion.button
                type="button"
                className="social-button facebook"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fab fa-facebook-f"></i>
              </motion.button>
              <motion.button
                type="button"
                className="social-button twitter"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fab fa-twitter"></i>
              </motion.button>
            </div>
          </div>
        </form>

        <div className="modal-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="toggle-form" onClick={toggleForm}>
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginModal
