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

      {/* Directional light - Updated to purple theme */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#8a2be2" />
      <directionalLight position={[-5, -5, -5]} intensity={0.2} color="#a64dff" />

      {/* Distorted sphere - Updated to purple theme */}
      <Sphere ref={sphereRef} args={[5, 64, 64]} position={[0, 0, -15]}>
        <MeshDistortMaterial
          color="#8a2be2"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          opacity={0.1}
          transparent={true}
        />
      </Sphere>

      {/* Second sphere - Updated to purple theme */}
      <Sphere args={[3, 64, 64]} position={[8, -4, -10]}>
        <MeshDistortMaterial
          color="#a64dff"
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
