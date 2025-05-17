"use client"

import { motion } from "framer-motion"
import "../../styles/workspace/Projects.css"

const Projects = () => {
  // Sample projects data
  const projects = []

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h1>Projects</h1>
        <p>Manage your transcription and translation projects</p>

        <motion.button className="new-project-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <i className="fas fa-plus"></i>
          <span>New Project</span>
        </motion.button>
      </div>

      <div className="projects-content">
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className="project-date">{project.date}</span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-stats">
                  <div className="stat">
                    <i className="fas fa-file"></i>
                    <span>{project.files} files</span>
                  </div>
                  <div className="stat">
                    <i className="fas fa-language"></i>
                    <span>{project.languages} languages</span>
                  </div>
                </div>
                <div className="project-actions">
                  <button className="project-action">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="project-action">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-projects">
            <div className="empty-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <h3>No projects yet</h3>
            <p>Create your first project to start organizing your transcriptions and translations</p>
            <motion.button className="create-project-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <i className="fas fa-plus"></i>
              <span>Create Project</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
