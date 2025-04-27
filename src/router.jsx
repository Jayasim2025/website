"use client"

import { createBrowserRouter } from "react-router-dom"
import { useState } from "react"
import Layout from "./components/Layout"
import adminRouter from "./adminRouter"

// For the workspace components
import WorkspaceLayout from "./components/workspace/WorkspaceLayout"
import Home from "./components/workspace/Home" // Renamed from Dashboard
import Projects from "./components/workspace/Projects"
import Settings from "./components/workspace/Settings"
import Members from "./components/workspace/Members"
import Billing from "./components/workspace/Billing"
import WorkspaceIntegrations from "./components/workspace/Integrations"
import UserDashboard from "./components/workspace/dashboard/UserDashboard"

// Create a theme state provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark")

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return children({ theme, toggleTheme })
}

const mainRoutes = [
  {
    path: "/",
    element: (
      <ThemeProvider>{({ theme, toggleTheme }) => <Layout theme={theme} toggleTheme={toggleTheme} />}</ThemeProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      // Add other main website routes here
    ],
  },
  {
    path: "/workspace",
    element: (
      <ThemeProvider>
        {({ theme, toggleTheme }) => <WorkspaceLayout theme={theme} toggleTheme={toggleTheme} />}
      </ThemeProvider>
    ),
    children: [
      { index: true, element: <Home /> }, // Changed from Dashboard to Home
      { path: "projects", element: <Projects /> },
      { path: "settings", element: <Settings /> },
      { path: "members", element: <Members /> },
      { path: "billing", element: <Billing /> },
      { path: "integrations", element: <WorkspaceIntegrations /> },
      { path: "dashboard", element: <UserDashboard /> }, // New user dashboard
    ],
  },
]

// Combine main routes with admin routes
const router = createBrowserRouter([...mainRoutes, ...adminRouter.routes])

export default router
