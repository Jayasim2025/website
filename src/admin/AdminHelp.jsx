"use client"

import { useState } from "react"
import "../styles/admin/AdminHelp.css"

const AdminHelp = () => {
  const [activeCategory, setActiveCategory] = useState("general")
  const [expandedQuestion, setExpandedQuestion] = useState(null)

  const helpCategories = [
    { id: "general", name: "General", icon: "fas fa-info-circle" },
    { id: "users", name: "User Management", icon: "fas fa-users" },
    { id: "translations", name: "Translations", icon: "fas fa-language" },
    { id: "settings", name: "Settings", icon: "fas fa-cog" },
    { id: "troubleshooting", name: "Troubleshooting", icon: "fas fa-exclamation-triangle" },
  ]

  const faqData = {
    general: [
      {
        id: "g1",
        question: "What is the admin dashboard?",
        answer:
          "The admin dashboard is a central control panel for managing the Translatea2z platform. It provides tools for user management, content management, analytics, and system settings.",
      },
      {
        id: "g2",
        question: "How do I navigate the admin panel?",
        answer:
          "You can navigate the admin panel using the sidebar on the left. It contains links to all major sections of the admin area. You can collapse the sidebar using the toggle button in the header.",
      },
      {
        id: "g3",
        question: "Can I customize the admin dashboard?",
        answer:
          "Yes, you can customize certain aspects of the dashboard through the Settings section. You can change the theme, adjust display preferences, and configure notification settings.",
      },
    ],
    users: [
      {
        id: "u1",
        question: "How do I add a new user?",
        answer:
          "To add a new user, go to the Users section and click the 'Add User' button. Fill in the required information and set the appropriate role and permissions.",
      },
      {
        id: "u2",
        question: "How do I change a user's role?",
        answer:
          "In the Users section, find the user you want to modify, click the edit button, and change their role from the dropdown menu. Save the changes to apply the new role.",
      },
    ],
    translations: [
      {
        id: "t1",
        question: "How do I view translation logs?",
        answer:
          "Go to the Translations section to view all translation logs. You can filter by user, language, or date range to find specific translations.",
      },
      {
        id: "t2",
        question: "Can I export translation data?",
        answer:
          "Yes, you can export translation data in CSV format by clicking the 'Export CSV' button in the Translations section.",
      },
    ],
    settings: [
      {
        id: "s1",
        question: "How do I change my admin password?",
        answer:
          "Go to the Settings section and find the 'Change Password' option. Enter your current password and your new password, then confirm the change.",
      },
      {
        id: "s2",
        question: "What is maintenance mode?",
        answer:
          "Maintenance mode temporarily disables user access to the platform while you perform updates or maintenance. Only administrators can access the site during maintenance mode.",
      },
    ],
    troubleshooting: [
      {
        id: "tr1",
        question: "What should I do if I'm locked out of my admin account?",
        answer:
          "Contact the system administrator or use the password recovery option on the login page. If you're the primary administrator, you may need to access the database directly to reset your credentials.",
      },
      {
        id: "tr2",
        question: "How do I report a bug in the admin panel?",
        answer:
          "Document the issue with screenshots and steps to reproduce it, then contact technical support or submit a bug report through the Help & Support section.",
      },
    ],
  }

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id)
  }

  return (
    <div className="admin-help">
      <div className="help-header">
        <h1>Help & Support</h1>
        <p>Find answers to common questions about the admin panel</p>
      </div>

      <div className="help-search">
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search for help topics..." />
        </div>
        <button className="contact-support-button">
          <i className="fas fa-headset"></i>
          Contact Support
        </button>
      </div>

      <div className="help-content">
        <div className="help-categories">
          {helpCategories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <i className={category.icon}></i>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="faq-section">
          <h2>{helpCategories.find((c) => c.id === activeCategory).name} FAQs</h2>
          <div className="faq-list">
            {faqData[activeCategory].map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${expandedQuestion === faq.id ? "expanded" : ""}`}
                  onClick={() => toggleQuestion(faq.id)}
                >
                  <span>{faq.question}</span>
                  <i className={`fas ${expandedQuestion === faq.id ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                </button>
                {expandedQuestion === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="help-resources">
        <h2>Additional Resources</h2>
        <div className="resources-grid">
          <a href="#" className="resource-card">
            <div className="resource-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="resource-content">
              <h3>Documentation</h3>
              <p>Comprehensive guides and reference materials</p>
            </div>
          </a>
          <a href="#" className="resource-card">
            <div className="resource-icon">
              <i className="fas fa-video"></i>
            </div>
            <div className="resource-content">
              <h3>Video Tutorials</h3>
              <p>Step-by-step visual guides</p>
            </div>
          </a>
          <a href="#" className="resource-card">
            <div className="resource-icon">
              <i className="fas fa-comments"></i>
            </div>
            <div className="resource-content">
              <h3>Community Forum</h3>
              <p>Connect with other administrators</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminHelp
