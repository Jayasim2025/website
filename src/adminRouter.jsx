"use client"

import { createBrowserRouter } from "react-router-dom"
import { useState, useEffect } from "react"
import AdminLayout from "./admin/AdminLayout"
import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminAnalytics from "./admin/AdminAnalytics"
import AdminHelp from "./admin/AdminHelp"
import Users from "./pages/Users"
import Translations from "./pages/Translations"
import Content from "./pages/Content"
import Languages from "./pages/Languages"
import Pricing from "./pages/Pricing"
import Feedback from "./pages/Feedback"
import Settings from "./pages/Settings"

// Create a theme state provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    return localStorage.getItem("theme") || "dark"
  })

  useEffect(() => {
    // Set theme attribute on document
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return children({ theme, toggleTheme })
}

const adminRouter = createBrowserRouter([
  {
    path: "/admin-login",
    element: (
      <ThemeProvider>
        {({ theme, toggleTheme }) => <AdminLogin theme={theme} toggleTheme={toggleTheme} />}
      </ThemeProvider>
    ),
  },
  {
    path: "/admin",
    element: (
      <ThemeProvider>
        {({ theme, toggleTheme }) => <AdminLayout theme={theme} toggleTheme={toggleTheme} />}
      </ThemeProvider>
    ),
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <Users /> },
      { path: "translations", element: <Translations /> },
      { path: "content", element: <Content /> },
      { path: "languages", element: <Languages /> },
      { path: "pricing", element: <Pricing /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "feedback", element: <Feedback /> },
      { path: "settings", element: <Settings /> },
      { path: "help", element: <AdminHelp /> },
    ],
  },
])

export default adminRouter
