"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Box, Torus } from "@react-three/drei"
import * as THREE from "three"

const FloatingGeometry = ({ position, geometry, color, speed = 1 }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed
      meshRef.current.rotation.y += 0.007 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3
    }
  })

  const GeometryComponent = geometry === "sphere" ? Sphere : geometry === "box" ? Box : Torus

  const geometryProps = geometry === "torus" ? { args: [0.5, 0.2, 16, 100] } : { args: [0.5, 32, 32] }

  return (
    <GeometryComponent ref={meshRef} position={position} {...geometryProps}>
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.1}
        roughness={0.4}
        metalness={0.6}
        emissive={color}
        emissiveIntensity={0.05}
      />
    </GeometryComponent>
  )
}

const ParticleField = () => {
  const particlesRef = useRef()
  const particleCount = 150

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  // Teal color variations
  const tealColors = [
    new THREE.Color("#14b8a6"),
    new THREE.Color("#5eead4"),
    new THREE.Color("#99f6e4"),
    new THREE.Color("#0f766e"),
  ]

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20

    const color = tealColors[Math.floor(Math.random() * tealColors.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={particleCount} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={particleCount} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}

const BackgroundScene = () => {
  return (
    <>
      {/* Enhanced Lighting with Teal Colors */}
      <ambientLight intensity={0.3} color="#0f172a" />
      <directionalLight position={[10, 10, 5]} intensity={0.5} color="#14b8a6" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#5eead4" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.4} color="#99f6e4" castShadow />

      {/* Floating Geometries with Teal Colors */}
      <FloatingGeometry position={[-3, 2, -5]} geometry="sphere" color="#14b8a6" speed={0.8} />
      <FloatingGeometry position={[4, -1, -3]} geometry="box" color="#5eead4" speed={1.2} />
      <FloatingGeometry position={[-2, -3, -4]} geometry="torus" color="#99f6e4" speed={0.6} />
      <FloatingGeometry position={[3, 3, -6]} geometry="sphere" color="#0f766e" speed={1.0} />
      <FloatingGeometry position={[-4, 0, -2]} geometry="torus" color="#14b8a6" speed={0.9} />
      <FloatingGeometry position={[2, -2, -5]} geometry="box" color="#5eead4" speed={0.7} />

      {/* Particle Field */}
      <ParticleField />

      {/* Background Gradient Plane */}
      <mesh position={[0, 0, -10]} scale={[50, 50, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0.1}>
          <primitive
            attach="map"
            object={(() => {
              const canvas = document.createElement("canvas")
              canvas.width = 512
              canvas.height = 512
              const ctx = canvas.getContext("2d")

              // Create teal gradient
              const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
              gradient.addColorStop(0, "rgba(20, 184, 166, 0.3)")
              gradient.addColorStop(0.5, "rgba(94, 234, 212, 0.2)")
              gradient.addColorStop(1, "rgba(15, 23, 42, 0.1)")

              ctx.fillStyle = gradient
              ctx.fillRect(0, 0, 512, 512)

              const texture = new THREE.CanvasTexture(canvas)
              return texture
            })()}
          />
        </meshBasicMaterial>
      </mesh>
    </>
  )
}

export default BackgroundScene
