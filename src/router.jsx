"use client"

import { createBrowserRouter } from "react-router-dom"
import { useState, useEffect } from "react"
import HomePage from "./pages/HomePage"
import PricingPage from "./pages/PricingPage"
import IntegrationsPage from "./pages/IntegrationsPage"
import FAQPage from "./pages/FAQPage"
import WorkspaceLayout from "./components/workspace/WorkspaceLayout"
import Dashboard from "./components/workspace/Dashboard"
import Members from "./components/workspace/Members"
import Billing from "./components/workspace/Billing"
import WorkspaceIntegrations from "./components/workspace/Integrations"
import UserDashboard from "./components/workspace/dashboard/UserDashboard"
import Editor from "./components/workspace/Editor"
import UserSettings from "./components/workspace/UserSettings"
import OrganizationSettings from "./components/workspace/OrganizationSettings"

// Admin components
import AdminLayout from "./admin/AdminLayout"
import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"
import AdminAnalytics from "./admin/AdminAnalytics"
import AdminHelp from "./admin/AdminHelp"

// Placeholder pages
import AboutPage from "./pages/placeholders/AboutPage"
import CareersPage from "./pages/placeholders/CareersPage"
import BlogPage from "./pages/placeholders/BlogPage"
import ContactPage from "./pages/placeholders/ContactPage"
import DocumentationPage from "./pages/placeholders/DocumentationPage"
import ApiReferencePage from "./pages/placeholders/ApiReferencePage"
import CommunityPage from "./pages/placeholders/CommunityPage"
import SupportPage from "./pages/placeholders/SupportPage"
import PrivacyPolicyPage from "./pages/placeholders/PrivacyPolicyPage"
import TermsOfServicePage from "./pages/placeholders/TermsOfServicePage"
import CookiePolicyPage from "./pages/placeholders/CookiePolicyPage"
import GdprPage from "./pages/placeholders/GdprPage"
import Users from "./pages/Users"
import Translations from "./pages/Translations"
import Content from "./pages/Content"
import Languages from "./pages/Languages"
import Pricing from "./pages/Pricing"
import Feedback from "./pages/Feedback"

// Create a theme state provider
export const ThemeProvider = ({ children }) => {
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

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>{({ theme, toggleTheme }) => <HomePage theme={theme} toggleTheme={toggleTheme} />}</ThemeProvider>
    ),
  },
  {
    path: "/pricing",
    element: (
      <ThemeProvider>
        {({ theme, toggleTheme }) => <PricingPage theme={theme} toggleTheme={toggleTheme} />}
      </ThemeProvider>
    ),
  },
  {
    path: "/integrations",
    element: (
      <ThemeProvider>
        {({ theme, toggleTheme }) => <IntegrationsPage theme={theme} toggleTheme={toggleTheme} />}
      </ThemeProvider>
    ),
  },
  {
    path: "/faq",
    element: (
      <ThemeProvider>{({ theme, toggleTheme }) => <FAQPage theme={theme} toggleTheme={toggleTheme} />}</ThemeProvider>
    ),
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/careers",
    element: <CareersPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/documentation",
    element: <DocumentationPage />,
  },
  {
    path: "/api-reference",
    element: <ApiReferencePage />,
  },
  {
    path: "/community",
    element: <CommunityPage />,
  },
  {
    path: "/support",
    element: <SupportPage />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServicePage />,
  },
  {
    path: "/cookie-policy",
    element: <CookiePolicyPage />,
  },
  {
    path: "/gdpr",
    element: <GdprPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms",
    element: <TermsOfServicePage />,
  },
  {
    path: "/cookies",
    element: <CookiePolicyPage />,
  },
  {
    path: "/workspace",
    element: (
      <ThemeProvider>
        {({ theme, toggleTheme }) => <WorkspaceLayout theme={theme} toggleTheme={toggleTheme} />}
      </ThemeProvider>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "editor/:fileId?", element: <Editor /> },
      { path: "members", element: <Members /> },
      { path: "billing", element: <Billing /> },
      { path: "integrations", element: <WorkspaceIntegrations /> },
      { path: "settings", element: <UserSettings /> },
      { path: "dashboard", element: <UserDashboard /> },
      { path: "organization", element: <OrganizationSettings /> },
    ],
  },
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
      { index: true, element: <AdminDashboard /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <Users /> },
      { path: "translations", element: <Translations /> },
      { path: "content", element: <Content /> },
      { path: "languages", element: <Languages /> },
      { path: "pricing", element: <Pricing /> },
      { path: "analytics", element: <AdminAnalytics /> },
      { path: "feedback", element: <Feedback /> },
      { path: "settings", element: <UserSettings /> },
      { path: "help", element: <AdminHelp /> },
    ],
  },
])

export default router
