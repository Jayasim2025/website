"use client"

import { motion } from "framer-motion"
import "../styles/Loader.css"

const Loader = () => {
  return (
    <div className="loader-container">
      <motion.div className="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.div
          className="loader-logo"
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 112, 243, 0.3)",
              "0 0 40px rgba(0, 112, 243, 0.6)",
              "0 0 20px rgba(0, 112, 243, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.span
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            T
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Translatea2z
        </motion.h1>

        <div className="loader-progress-container">
          <motion.div
            className="loader-progress"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>

        <motion.p
          className="loader-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Preparing your experience...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Loader
