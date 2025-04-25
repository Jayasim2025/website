"use client"

import { motion } from "framer-motion"
import { useRef, useEffect } from "react"
import "../styles/Hero.css"

const Hero = ({ toggleLoginModal }) => {
  const videoRef = useRef(null)

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

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <motion.div className="hero-badges" variants={containerVariants} initial="hidden" animate="visible">
              <motion.span className="badge" variants={itemVariants} transition={{ duration: 0.5 }}>
                <span className="badge-dot"></span>
                125+ Languages Supported
              </motion.span>
              <motion.span className="badge" variants={itemVariants} transition={{ duration: 0.5 }}>
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
              Transform <span className="gradient-text">Speech</span> into <span className="gradient-text">Global</span>{" "}
              content
            </motion.h1>

            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Generate accurate subtitles and translations in seconds. Perfect for creators, media companies, and anyone
              looking to reach global audiences.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <motion.button
                className="btn btn-primary hero-btn"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(0, 112, 243, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get started free
                <i className="fas fa-arrow-right"></i>
              </motion.button>

              <motion.button
                className="btn btn-secondary"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "var(--primary-light)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLoginModal}
              >
                Try Demo
              </motion.button>
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
                    alt="Company logo"
                  />
                </motion.span>
                <motion.span whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <img
                    src="https://images.unsplash.com/photo-1611605698335-8b1569810432?q=80&w=100&auto=format&fit=crop"
                    alt="Company logo"
                  />
                </motion.span>
                <motion.span whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <img
                    src="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=100&auto=format&fit=crop"
                    alt="Company logo"
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
              <video ref={videoRef} autoPlay muted loop playsInline className="feature-video">
                <source
                  src="https://cdn.pixabay.com/vimeo/328940142/subtitle-24538.mp4?width=640&hash=e9e0f9a3c2c1d8c1c2e1e1c1c1c1c1c1c1c1c1c1"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <motion.div
                className="processing-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div className="processing-info">
                  <p>Processing Speed</p>
                  <p className="small">(1 hour of audio)</p>
                </div>
                <p className="processing-time">~2 minutes</p>
              </motion.div>

              <motion.div
                className="feature-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                whileHover={{
                  x: -5,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span className="feature-icon">✓</span>
                <div>
                  <h4>125+ Languages</h4>
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
