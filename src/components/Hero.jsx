"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import "../styles/Hero.css"

const Hero = ({ toggleLoginModal }) => {
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay was prevented:", error)
      })
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
      // Here you would typically upload the file to your server
      console.log("Video selected:", file.name)
      // You can add your upload logic here
    } else if (file) {
      alert("Please select a valid video file")
    }
  }

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <motion.div className="hero-badges" variants={containerVariants} initial="hidden" animate="visible">
              <motion.span className="hero-badge" variants={itemVariants} transition={{ duration: 0.5 }}>
                <span className="badge-dot"></span>
                125+ Languages Supported
              </motion.span>
              <motion.span className="hero-badge" variants={itemVariants} transition={{ duration: 0.5 }}>
                <span className="badge-dot"></span>
                AI-Powered Subtitles
              </motion.span>
            </motion.div>

            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Generate <span className="gradient-text-secondary">Subtitles</span> in{" "}
              <span className="gradient-text-secondary">Seconds</span>
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Transform your audio and video content with accurate speech-to-text, subtitles, and translations. Perfect
              for creators, media companies, and anyone looking to reach global audiences.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.button
                className="btn btn-primary hero-btn upload-btn"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(138, 43, 226, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
              >
                Upload Video
                <i className="fas fa-cloud-upload-alt"></i>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  style={{ display: "none" }}
                />
              </motion.button>

              {selectedFile && (
                <div className="selected-file">
                  <span>Selected: {selectedFile.name}</span>
                </div>
              )}
            </motion.div>

            <motion.div
              className="trusted-by"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <p>Trusted by leading organizations</p>
              <div className="trusted-logos">
                <motion.span whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <img
                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=100&auto=format&fit=crop"
                    alt="FA logo"
                  />
                </motion.span>
                <motion.span whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <img
                    src="https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=100&auto=format&fit=crop"
                    alt="10 LOC logo"
                  />
                </motion.span>
                <motion.span whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <img
                    src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&auto=format&fit=crop"
                    alt="Welocalize logo"
                  />
                </motion.span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-video"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="video-container">
              <img
                src="https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=1000&auto=format&fit=crop"
                alt="Subtitle Dashboard Preview"
                className="feature-video"
              />
              <motion.div
                className="hero-feature-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                whileHover={{
                  x: -5,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span className="hero-feature-icon">✓</span>
                <div>
                  <h4 className="gradient-text-primary">125+ Languages</h4>
                  <p>Global reach with one click</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
