"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import "../styles/AnimatedCounter.css"

const AnimatedCounter = ({ value, title, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const inView = useInView(countRef, { once: true, threshold: 0.5 })

  useEffect(() => {
    if (!inView) return

    let start = 0
    const end = Number.parseInt(value.toString().replace(/,/g, ""))

    // First three decimals for better animation
    const incrementTime = (duration * 1000) / end

    // Don't exceed 50 ms per increment
    const minIncrementTime = Math.max(incrementTime, 50)

    const timer = setInterval(() => {
      start += 1
      const progress = Math.min(start / end, 1)
      setCount(Math.floor(progress * end))

      if (start >= end) clearInterval(timer)
    }, minIncrementTime)

    return () => {
      clearInterval(timer)
    }
  }, [value, inView, duration])

  return (
    <div className="animated-counter" ref={countRef}>
      <motion.div
        className="counter-value"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <span className="counter-number">{count}</span>
        {suffix && <span className="counter-suffix">{suffix}</span>}
      </motion.div>
      <motion.div
        className="counter-title"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {title}
      </motion.div>
    </div>
  )
}

export default AnimatedCounter
