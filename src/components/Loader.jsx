"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, Torus } from "@react-three/drei"
import "../styles/Loader.css"

// Simple 3D Element with Teal Colors
const SimpleGeometry = () => {
  const groupRef = useRef()
  const sphereRef = useRef()
  const torusRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.01
      sphereRef.current.rotation.y += 0.015
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += 0.02
      torusRef.current.rotation.z += 0.01
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere ref={sphereRef} args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#14b8a6" transparent opacity={0.15} roughness={0.4} metalness={0.6} />
      </Sphere>

      <Torus ref={torusRef} args={[1.2, 0.1, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#5eead4" transparent opacity={0.2} roughness={0.3} metalness={0.7} />
      </Torus>

      <Torus args={[1.8, 0.05, 16, 100]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#99f6e4" transparent opacity={0.12} roughness={0.2} metalness={0.8} />
      </Torus>
    </group>
  )
}

// Main Loader Component
const Loader = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showTitle, setShowTitle] = useState(false)
  const [titleComplete, setTitleComplete] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Show title after initial delay
    const titleTimer = setTimeout(() => {
      setShowTitle(true)
    }, 800)

    // Complete title animation
    const completeTimer = setTimeout(() => {
      setTitleComplete(true)
    }, 3000)

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 4500)

    // Hide loader completely
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
    }, 5500)

    return () => {
      clearTimeout(titleTimer)
      clearTimeout(completeTimer)
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      className="smooth-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Background matching website with teal theme */}
      <div className="loader-bg" />

      {/* 3D Scene */}
      <div className="scene-wrapper">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[2, 2, 5]} intensity={0.6} color="#14b8a6" />
          <pointLight position={[-2, -2, -5]} intensity={0.3} color="#5eead4" />

          <Suspense fallback={null}>
            <SimpleGeometry />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="loader-main">
        <AnimatePresence>
          {showTitle && (
            <motion.div
              className="title-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {/* Brand Title */}
              <motion.h1
                className="main-title"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              >
                TRANSLATEA2Z
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="subtitle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: titleComplete ? 1 : 0, y: titleComplete ? 0 : 10 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                AI Translation Platform
              </motion.p>

              {/* Loading indicator */}
              <motion.div
                className="loading-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: titleComplete ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <div className="loading-dots">
                  <div className="dot" />
                  <div className="dot" />
                  <div className="dot" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle overlay */}
      <div className="overlay-gradient" />
    </motion.div>
  )
}

export default Loader
