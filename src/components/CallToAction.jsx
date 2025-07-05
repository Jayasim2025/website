"use client"

import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import "../styles/CallToAction.css"

const CallToAction = () => {
  const navigate = useNavigate()

  const handleStartTrial = () => {
    navigate("/pricing")
  }

  return (
    <section className="cta-section" id="contact">
      <div className="cta-container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="cta-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>

          <motion.p
            className="cta-description"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Join thousands of creators already using our platform to reach global audiences.
          </motion.p>

          <motion.button
            className="cta-button"
            onClick={handleStartTrial}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 35px rgba(20, 184, 166, 0.4)",
              y: -3,
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
