"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import "../styles/Hero.css"

const Hero = ({ toggleLoginModal }) => {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file)
      console.log("Video selected:", file.name)
    } else if (file) {
      alert("Please select a valid video file")
    }
  }

  return (
    <section className="hero-section-perfect" id="home" ref={heroRef}>
      <div className="hero-container-perfect">
        {/* Floating badges */}
        <motion.div
          className="hero-badges-perfect"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span
            className="hero-badge-perfect badge-languages"
            whileHover={{ scale: 1.1, rotate: 2 }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 1, 0],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <span className="badge-dot-perfect"></span>
            125+ Languages
          </motion.span>
          <motion.span
            className="hero-badge-perfect badge-ai"
            whileHover={{ scale: 1.1, rotate: -2 }}
            animate={{
              y: [0, 8, 0],
              rotate: [0, -1, 0],
            }}
            transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
          >
            <span className="badge-dot-perfect"></span>
            AI-Powered
          </motion.span>
        </motion.div>

        {/* Main content area */}
        <div className="hero-main-perfect">
          {/* Left side - Text */}
          <div className="hero-text-perfect">
            <motion.h1 className="hero-title-perfect">
              <motion.span
                className="title-word"
                initial={{ opacity: 0, x: -50, rotateX: -90 }}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                GENERATE
              </motion.span>
              <motion.span
                className="title-word title-highlight-perfect"
                initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                SUBTITLES
              </motion.span>
              <motion.span
                className="title-word"
                initial={{ opacity: 0, x: 50, rotateX: 90 }}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                IN SECONDS
              </motion.span>
            </motion.h1>

            <motion.p
              className="hero-description-perfect"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              Transform your content with AI-powered subtitles and translations. Perfect for creators, businesses, and
              global audiences.
            </motion.p>

            <motion.div
              className="hero-buttons-perfect"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 }}
            >
              <motion.button
                className="btn-upload-perfect"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(20, 184, 166, 0.4)",
                  y: -3,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                animate={{
                  boxShadow: [
                    "0 8px 25px rgba(20, 184, 166, 0.2)",
                    "0 8px 25px rgba(94, 234, 212, 0.3)",
                    "0 8px 25px rgba(20, 184, 166, 0.2)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <motion.span
                  className="btn-icon-perfect"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  ⚡
                </motion.span>
                Upload Video Now
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  style={{ display: "none" }}
                />
              </motion.button>

              <motion.button
                className="btn-demo-perfect"
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  borderColor: "#5eead4",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLoginModal}
              >
                <motion.span
                  className="btn-icon-perfect"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  🎬
                </motion.span>
                Watch Demo
              </motion.button>
            </motion.div>

            {selectedFile && (
              <motion.div
                className="selected-file-perfect"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.span
                  className="file-icon-perfect"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  📁
                </motion.span>
                <span>Ready: {selectedFile.name}</span>
                <motion.span
                  className="processing-perfect"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  ⚙️
                </motion.span>
              </motion.div>
            )}
          </div>

          {/* Right side - Image with overlapping elements */}
          <div className="hero-visual-perfect">
            <motion.div
              className="hero-image-wrapper-perfect"
              initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 1.2 }}
              whileHover={{
                scale: 1.02,
                rotateY: -5,
                rotateX: 2,
              }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=600&auto=format&fit=crop"
                alt="AI Subtitle Generator"
                className="hero-image-perfect"
                animate={{
                  y: [0, -10, 0],
                  rotateZ: [0, 1, -1, 0],
                }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* Floating UI elements */}
              <motion.div
                className="floating-element-perfect element-global"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <motion.span
                  className="element-icon-perfect"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  🌍
                </motion.span>
                <span>GLOBAL</span>
              </motion.div>

              <motion.div
                className="floating-element-perfect element-accurate"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2.3 }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <motion.span
                  className="element-icon-perfect"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  🎯
                </motion.span>
                <span>ACCURATE</span>
              </motion.div>

              <motion.div
                className="floating-element-perfect element-fast"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2.6 }}
                whileHover={{ scale: 1.1, rotate: 3 }}
              >
                <motion.span
                  className="element-icon-perfect"
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 15, 0],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  ⚡
                </motion.span>
                <span>FAST</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
