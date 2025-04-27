"use client"

import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Menu, X, LogOut, User, Bell, Sun, Moon } from "lucide-react"
import BackgroundScene from "../components/BackgroundScene"
import AdminSidebar from "./AdminSidebar"

const AdminLayout = ({ theme, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    // In a real app, you would clear auth tokens/session
    navigate("/admin-login")
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 3D Background */}
      <Canvas className="absolute inset-0 z-0" camera={{ position: [0, 0, 20], fov: 50 }}>
        <BackgroundScene />
      </Canvas>

      {/* Admin Header */}
      <header className="relative z-10 bg-card-background/80 backdrop-blur-md border-b border-border-color shadow-sm h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-primary-light transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="ml-4 flex items-center">
              <motion.div
                className="logo-icon w-8 h-8 flex items-center justify-center bg-primary-gradient text-white rounded-md font-bold"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                T
              </motion.div>
              <span className="ml-2 font-bold text-lg gradient-text">Translatea2z Admin</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-primary-light transition-colors">
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button className="p-2 rounded-full hover:bg-primary-light transition-colors">
              <Bell size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-primary-light transition-colors"
              >
                <User size={20} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-card-background border border-border-color rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-border-color">
                      <p className="text-sm font-medium">Admin User</p>
                      <p className="text-xs text-text-secondary">admin@translatea2z.com</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm hover:bg-primary-light transition-colors"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-64 bg-card-background/80 backdrop-blur-md border-r border-border-color h-[calc(100vh-4rem)] overflow-y-auto"
            >
              <AdminSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto h-[calc(100vh-4rem)]">
          <div className="bg-card-background/80 backdrop-blur-md rounded-xl border border-border-color p-6 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
