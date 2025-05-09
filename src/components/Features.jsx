"use client"

import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import "../styles/Features.css"

const Features = () => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    } else {
      controls.start("hidden")
    }
  }, [controls, inView])

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
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.6,
      },
    },
    hover: {
      y: -15,
      scale: 1.02,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 300,
      },
    },
  }

  const features = [
    {
      title: "AI Speech Recognition",
      icon: "fa-microphone-alt",
      description: "Industry-leading accuracy with advanced noise reduction technology.",
      steps: [
        "125+ languages support",
        "Speaker identification",
        "Background noise filtering",
        "Technical terminology support",
      ],
      accentColor: "#a67bd5", // Updated to lighter purple
    },
    {
      title: "Automatic Translation",
      icon: "fa-language",
      description: "Translate content into multiple languages with natural-sounding results.",
      steps: ["Neural machine translation", "Context preservation", "Dialect recognition", "Slang and idiom handling"],
      accentColor: "#b68fd9", // Updated to lighter purple
    },
    {
      title: "Custom Dictionaries",
      icon: "fa-book",
      description: "Improve accuracy for specialized terminology and proper nouns.",
      steps: ["Industry-specific terms", "Brand name recognition", "Technical vocabulary", "Proper noun handling"],
      accentColor: "#c193e3", // Updated to lighter purple
    },
    {
      title: "Collaborative Editing",
      icon: "fa-users",
      description: "Edit and refine transcripts with your entire team in real-time.",
      steps: ["Real-time collaboration", "Comment & annotation", "Version history tracking", "Role-based permissions"],
      accentColor: "#b68fd9", // Updated to lighter purple
    },
  ]

  return (
    <section className="features-section" ref={ref} id="features">
      <div className="features-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 10,
                stiffness: 100,
              },
            },
          }}
        >
          <motion.h2
            className="section-title gradient-glow"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Powerful Features for Media Professionals
          </motion.h2>
          <motion.p className="section-subtitle">
            Transform speech to text and create professional-quality subtitles for global audiences.
          </motion.p>
        </motion.div>

        <motion.div className="features-grid" variants={containerVariants} initial="hidden" animate={controls}>
          {features.map((feature, index) => (
            <motion.div
              className="feature-card glass-effect"
              key={index}
              variants={itemVariants}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              style={{
                "--accent-color": feature.accentColor,
              }}
            >
              <div className="feature-header">
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="gradient-text">{feature.title}</h3>
              </div>

              <p className="feature-description">{feature.description}</p>

              <ul className="feature-steps">
                {feature.steps.map((step, i) => (
                  <li key={i}>
                    <i className="fas fa-check-circle"></i>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>

              <div className="card-hover-effect"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
