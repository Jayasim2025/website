"use client"

import { motion } from "framer-motion"
import "../styles/Features.css"

const Features = () => {
  const features = [
    {
      icon: "🎤",
      title: "AI Speech Recognition",
      description: "Industry-leading accuracy with advanced noise reduction technology.",
      features: [
        "125+ languages support",
        "Speaker identification",
        "Background noise filtering",
        "Technical terminology support",
      ],
    },
    {
      icon: "🌐",
      title: "Automatic Translation",
      description: "Translate content into multiple languages with natural-sounding results.",
      features: [
        "Neural machine translation",
        "Context preservation",
        "Dialect recognition",
        "Slang and idiom handling",
      ],
    },
    {
      icon: "📚",
      title: "Custom Dictionaries",
      description: "Improve accuracy for specialized terminology and proper nouns.",
      features: ["Industry-specific terms", "Brand name recognition", "Technical vocabulary", "Proper noun handling"],
    },
    {
      icon: "👥",
      title: "Collaborative Editing",
      description: "Edit and refine transcripts with your entire team in real-time.",
      features: [
        "Real-time collaboration",
        "Comment & annotation",
        "Version history tracking",
        "Role-based permissions",
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <motion.div
          className="features-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>
            Powerful Features for <span className="highlight">Every Creator</span>
          </h2>
          <p>
            Transform your content with cutting-edge AI technology designed for creators, businesses, and global
            audiences.
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={cardVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 },
              }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", color: "#14b8a6" }}>{feature.title}</h3>
              <p>{feature.description}</p>
              <ul className="feature-list">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="feature-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="features-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        ></motion.div>
      </div>
    </section>
  )
}

export default Features
