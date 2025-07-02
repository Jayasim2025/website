"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const StarField = () => {
  const starsRef = useRef()
  const starCount = 2000

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002
      starsRef.current.rotation.x += 0.0001
    }
  })

  const positions = new Float32Array(starCount * 3)
  const colors = new Float32Array(starCount * 3)

  // Teal star colors
  const starColors = [
    new THREE.Color("#14b8a6"),
    new THREE.Color("#5eead4"),
    new THREE.Color("#99f6e4"),
    new THREE.Color("#0f766e"),
    new THREE.Color("#ffffff"),
  ]

  for (let i = 0; i < starCount; i++) {
    // Create a more realistic star field distribution
    positions[i * 3] = (Math.random() - 0.5) * 100
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100

    const color = starColors[Math.floor(Math.random() * starColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={starCount} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={starCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.8} />
    </points>
  )
}

const BackgroundScene = () => {
  return (
    <>
      {/* Minimal ambient lighting for the starry night effect */}
      <ambientLight intensity={0.1} color="#0f172a" />

      {/* Star field */}
      <StarField />
    </>
  )
}

export default BackgroundScene
