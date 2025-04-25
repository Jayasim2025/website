"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"

const BackgroundScene = () => {
  const sphereRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t
      sphereRef.current.rotation.y = t * 0.5
    }
  })

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.2} />

      {/* Directional light */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#0070f3" />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#00a2ff" />

      {/* Distorted sphere */}
      <Sphere ref={sphereRef} args={[5, 64, 64]} position={[0, 0, -15]}>
        <MeshDistortMaterial
          color="#0070f3"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          opacity={0.1}
          transparent={true}
        />
      </Sphere>

      {/* Second sphere */}
      <Sphere args={[3, 64, 64]} position={[8, -4, -10]}>
        <MeshDistortMaterial
          color="#00a2ff"
          attach="material"
          distort={0.6}
          speed={3}
          roughness={0.3}
          metalness={0.7}
          opacity={0.08}
          transparent={true}
        />
      </Sphere>
    </>
  )
}

export default BackgroundScene
