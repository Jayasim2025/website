"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/CallToAction.css"
import { useState } from "react"

const CallToAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [email, setEmail] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Email submitted:", email)
    // Add your email submission logic here
  }

  return (
    <section className="cta-section" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="cta-content glass-effect"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="gradient-glow">Ready to Transform Your Content?</h2>
          <p>
            Join thousands of creators using our platform to reach global audiences with accurate subtitles and
            translations.
          </p>

          <div className="cta-features">
            <div className="feature">
              <i className="fas fa-check"></i>
              <span>Start for free</span>
            </div>
            <div className="feature">
              <i className="fas fa-check"></i>
              <span>No credit card required</span>
            </div>
            <div className="feature">
              <i className="fas fa-check"></i>
              <span>Cancel anytime</span>
            </div>
            <div className="feature">
              <i className="fas fa-check"></i>
              <span>Dedicated support</span>
            </div>
          </div>

          <motion.form
            className="cta-form"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Get Started Free
            </motion.button>
          </motion.form>

          <p className="privacy-note">
            By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>
        </motion.div>

        <motion.div
          className="cta-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
            alt="Team collaboration"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
