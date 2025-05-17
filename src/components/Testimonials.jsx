"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/Testimonials.css"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Creator, 2.5M Subscribers",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    content:
      "Translatea2z has revolutionized my content strategy. I've seen a 40% increase in international viewers since I started using it for my videos.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Video Producer at GlobalReach",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    content:
      "The ability to quickly generate accurate subtitles in multiple languages has helped us expand our audience reach by over 40% in just three months.",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Podcast Host, Tech Insights",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    content:
      "As an independent creator, Translatea2z has been a game-changer. I can now offer my podcast in multiple languages without breaking the bank.",
  },
]

const Testimonials = () => {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  useEffect(() => {
    if (!autoplay || !inView) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay, inView])

  const handlePrev = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="testimonials-section" ref={ref} id="testimonials">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2>What Our Customers Say</h2>
          <p>Trusted by content creators and media professionals worldwide</p>
        </motion.div>

        <motion.div
          className="testimonials-container"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="testimonials-wrapper glass-effect">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card"
              >
                <div className="testimonial-content">
                  <div className="quote-icon">
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <p>{testimonials[current].content}</p>
                </div>

                <div className="testimonial-author">
                  <img src={testimonials[current].image || "/placeholder.svg"} alt={testimonials[current].name} />
                  <div className="author-info">
                    <h4>{testimonials[current].name}</h4>
                    <p>{testimonials[current].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="testimonial-controls">
              <motion.button
                className="control-button prev"
                onClick={handlePrev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-chevron-left"></i>
              </motion.button>

              <div className="testimonial-indicators">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === current ? "active" : ""}`}
                    onClick={() => {
                      setAutoplay(false)
                      setCurrent(index)
                    }}
                  />
                ))}
              </div>

              <motion.button
                className="control-button next"
                onClick={handleNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </div>
          </div>

          <div className="testimonials-stats">
            <div className="stat-item glass-effect">
              <h3>2.5M+</h3>
              <p>Content Creators</p>
            </div>
            <div className="stat-item glass-effect">
              <h3>125+</h3>
              <p>Languages</p>
            </div>
            <div className="stat-item glass-effect">
              <h3>40%</h3>
              <p>Avg. Audience Growth</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
