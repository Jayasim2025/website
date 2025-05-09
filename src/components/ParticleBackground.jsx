"use client"

import { useEffect, useRef } from "react"
import "../styles/ParticleBackground.css"

const ParticleBackground = ({ theme }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create gradient background
    const createGradientBackground = () => {
      // Create a linear gradient from top to bottom
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)

      if (theme === "dark") {
        // Enhanced dark mode with purple gradient
        gradient.addColorStop(0, "rgba(30, 20, 51, 1)") // Dark purple at top
        gradient.addColorStop(0.3, "rgba(45, 26, 74, 0.98)") // Medium purple
        gradient.addColorStop(0.6, "rgba(58, 32, 99, 0.95)") // Light purple
        gradient.addColorStop(0.9, "rgba(110, 61, 200, 0.92)") // Lighter purple
        gradient.addColorStop(1, "rgba(138, 43, 226, 0.9)") // Brightest purple at bottom
      } else {
        // Light mode with subtle purple gradient
        gradient.addColorStop(0, "rgba(248, 247, 252, 1)")
        gradient.addColorStop(0.5, "rgba(240, 235, 255, 0.98)")
        gradient.addColorStop(1, "rgba(230, 225, 255, 0.95)")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Particle settings - significantly increased for more boldness
    const particleCount = 250 // Increased particle count
    const particles = []
    const maxConnectionDistance = 200 // Increased connection distance

    // Create particles with more vibrant colors and larger sizes
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 4.5 + 2.5 // Larger particles
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: size,
        color:
          theme === "dark"
            ? `rgba(${200 + Math.random() * 55}, ${120 + Math.random() * 80}, ${250 + Math.random() * 5}, ${0.85 + Math.random() * 0.15})`
            : `rgba(${160 + Math.random() * 65}, ${70 + Math.random() * 90}, ${240 + Math.random() * 15}, ${0.6 + Math.random() * 0.25})`,
        speedX: (Math.random() - 0.5) * 1.1, // Faster movement
        speedY: (Math.random() - 0.5) * 1.1, // Faster movement
        pulseSpeed: 0.07 + Math.random() * 0.07, // Faster pulsing
        pulseDirection: 1,
        pulseAmount: 0,
        maxPulse: Math.random() * 0.7 + 0.7, // More pronounced pulsing
      })
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient background
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      createGradientBackground()

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Pulse effect
        particle.pulseAmount += particle.pulseSpeed * particle.pulseDirection
        if (particle.pulseAmount >= particle.maxPulse || particle.pulseAmount <= 0) {
          particle.pulseDirection *= -1
        }

        const currentRadius = particle.radius * (1 + particle.pulseAmount * 0.5) // More pronounced pulse

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with enhanced glow effect
        const glow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          currentRadius * 0.2,
          particle.x,
          particle.y,
          currentRadius * 5, // Much larger glow radius
        )
        glow.addColorStop(0, particle.color)
        glow.addColorStop(1, "rgba(138, 43, 226, 0)")

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentRadius * 5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Draw the particle core with increased brightness
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })

      // Draw connections with enhanced styling
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxConnectionDistance) {
            // Calculate opacity based on distance - significantly increased opacity
            const opacity =
              theme === "dark"
                ? 0.45 * (1 - distance / maxConnectionDistance) // Much higher opacity
                : 0.3 * (1 - distance / maxConnectionDistance) // Higher opacity for light mode

            // Create gradient line with more vibrant colors
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)

            if (theme === "dark") {
              gradient.addColorStop(0, `rgba(220, 140, 255, ${opacity * 1.5})`)
              gradient.addColorStop(0.5, `rgba(240, 160, 255, ${opacity})`)
              gradient.addColorStop(1, `rgba(220, 140, 255, ${opacity * 1.5})`)
            } else {
              gradient.addColorStop(0, `rgba(180, 120, 250, ${opacity * 1.4})`)
              gradient.addColorStop(0.5, `rgba(200, 140, 255, ${opacity})`)
              gradient.addColorStop(1, `rgba(180, 120, 250, ${opacity * 1.4})`)
            }

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.8 * (1 - distance / maxConnectionDistance) // Much thicker lines
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="particle-background" />
}

export default ParticleBackground
