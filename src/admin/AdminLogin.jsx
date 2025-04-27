"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import BackgroundScene from "../components/BackgroundScene"

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
    <div className="min-h-screen flex items-center justify-center relative">
      {/* 3D Background */}
      <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 0, 20], fov: 50 }}>
        <BackgroundScene />
      </Canvas>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card-background backdrop-blur-md rounded-xl p-8 shadow-xl border border-border-color w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            className="logo-icon mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-primary-gradient text-white rounded-xl font-bold text-2xl"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            T
          </motion.div>
          <h2 className="text-2xl font-bold gradient-text">Translatea2z Admin</h2>
          <p className="text-text-secondary mt-2">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 text-red-500 p-3 rounded-md mb-4 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md border border-border-color bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-color transition"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md border border-border-color bg-background-secondary focus:outline-none focus:ring-2 focus:ring-primary-color transition"
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-primary-gradient text-white rounded-md font-medium shadow-md hover:shadow-glow-shadow transition-all duration-300"
          >
            Login to Admin Panel
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          <p>For demo purposes, use:</p>
          <p className="font-medium">Username: admin | Password: admin123</p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
