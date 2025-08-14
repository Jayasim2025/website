"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/HowItWorks.css"

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const steps = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 22L12 20L8 22V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Upload Media",
      description:
        "Upload your video or audio files in any common format. Supports files up to 10GB or connect your cloud storage.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "AI Processing",
      description:
        "Our AI automatically transcribes your content with up to world-class accuracy and can translate into 125+ languages.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Review & Edit",
      description: "Use our intuitive editor to make any necessary adjustments to transcripts or translations.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Export & Deliver",
      description:
        "Export your subtitles in multiple formats (SRT, VTT, XML) or distribute directly to supported platforms.",
    },
  ]

  return (
    <section className="how-it-works-section" ref={ref} id="how-it-works">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="gradient-glow">How It Works</h2>
          <p>
            Creating professional subtitles and translations has never been easier. Our streamlined process gets you
            from raw media to final delivery in just minutes.
          </p>
        </motion.div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              className="step-card glass-effect"
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -10,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.2 },
              }}
            >
              <motion.div
                className="step-icon"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.icon}
              </motion.div>
              <h3 className="gradient-text">{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="processing-times glass-effect"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
        >
          <h3 className="gradient-text">Processing Time Estimates</h3>
          <div className="time-estimates">
            <div className="estimate">
              <span className="estimate-label">1 hour audio (audio-only file)</span>
              <span className="estimate-time">~2 minutes</span>
            </div>
            <div className="estimate">
              <span className="estimate-label">10 minute video (standard quality)</span>
              <span className="estimate-time">~2 minutes</span>
            </div>
            <div className="estimate">
              <span className="estimate-label">30 minute video podcast</span>
              <span className="estimate-time">~5 minutes</span>
            </div>
            <div className="estimate">
              <span className="estimate-label">60 minute high-quality documentary</span>
              <span className="estimate-time">~12 minutes</span>
            </div>
            <div className="estimate">
              <span className="estimate-label">Translation to each additional language</span>
              <span className="estimate-time">+1-3 minutes</span>
            </div>
          </div>

          <motion.a
            href="#"
            className="try-free-button"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(138, 43, 226, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Try it for free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
          <p className="no-credit-card">No credit card required. 1 hour of processing included in free trial.</p>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
