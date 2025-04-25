"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/Features.css"

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const features = [
    {
      title: "AI Speech Recognition",
      description: "Industry-leading accuracy with advanced noise reduction technology.",
      icon: "https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=200&auto=format&fit=crop",
      color: "#6366f1",
    },
    {
      title: "Automatic Translation",
      description: "Translate content into 125+ languages with natural-sounding results.",
      icon: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=200&auto=format&fit=crop",
      color: "#10b981",
    },
    {
      title: "Custom Dictionaries",
      description: "Improve accuracy for specialized terminology and proper nouns.",
      icon: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=200&auto=format&fit=crop",
      color: "#f59e0b",
    },
    {
      title: "Collaborative Editing",
      description: "Edit and refine transcripts with your entire team in real-time.",
      icon: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=200&auto=format&fit=crop",
      color: "#3b82f6",
    },
  ]

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  }

  return (
    <section className="features-section" id="features" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Powerful Features for Content Creators</h2>
          <p>Transform speech to text and create professional-quality subtitles for global audiences.</p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              className="feature-item"
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.3 },
              }}
              style={{
                "--feature-color": feature.color,
              }}
            >
              <div className="feature-image">
                <img src={feature.icon || "/placeholder.svg"} alt={feature.title} />
                <div className="feature-overlay" style={{ backgroundColor: feature.color }}></div>
              </div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <motion.button className="feature-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Learn more
                  <i className="fas fa-arrow-right"></i>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="features-showcase"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="showcase-content">
            <h3>Advanced Editing Tools</h3>
            <p>
              Our intuitive editor makes it easy to perfect your subtitles with precision timing controls, speaker
              identification, and style customization.
            </p>

            <ul className="showcase-features">
              <li>
                <i className="fas fa-check"></i>
                <span>Automatic speaker detection</span>
              </li>
              <li>
                <i className="fas fa-check"></i>
                <span>Custom timing adjustments</span>
              </li>
              <li>
                <i className="fas fa-check"></i>
                <span>Style and formatting options</span>
              </li>
              <li>
                <i className="fas fa-check"></i>
                <span>Export in multiple formats</span>
              </li>
            </ul>

            <motion.button
              className="showcase-button"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 112, 243, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Editor
              <i className="fas fa-arrow-right"></i>
            </motion.button>
          </div>

          <div className="showcase-image">
            <img
              src="https://images.unsplash.com/photo-1607968565043-36af90dde238?q=80&w=600&auto=format&fit=crop"
              alt="Advanced editing interface"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
