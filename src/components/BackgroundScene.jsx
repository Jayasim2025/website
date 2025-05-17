"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"

const BackgroundScene = () => {
  const sphereRef = useRef()
  const sphere2Ref = useRef()
  const sphere3Ref = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.2 // Increased animation speed
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t
      sphereRef.current.rotation.y = t * 0.6
      sphereRef.current.rotation.z = t * 0.3
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.rotation.x = -t * 0.5
      sphere2Ref.current.rotation.y = -t * 0.3
      sphere2Ref.current.rotation.z = t * 0.2
    }
    if (sphere3Ref.current) {
      sphere3Ref.current.rotation.x = t * 0.4
      sphere3Ref.current.rotation.y = -t * 0.5
      sphere3Ref.current.rotation.z = -t * 0.3
    }
  })

  return (
    <>
      {/* Enhanced ambient light */}
      <ambientLight intensity={0.4} />

      {/* Enhanced directional lights with more vibrant purple colors */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#9d4edd" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#c77dff" />
      <directionalLight position={[0, 10, 0]} intensity={0.6} color="#7b2cbf" />
      <directionalLight position={[-10, 5, -5]} intensity={0.4} color="#5a189a" />

      {/* Main distorted sphere - Enhanced with more vibrant purple */}
      <Sphere ref={sphereRef} args={[5.5, 128, 128]} position={[0, 0, -15]}>
        <MeshDistortMaterial
          color="#8a2be2"
          attach="material"
          distort={0.6}
          speed={3}
          roughness={0.2}
          metalness={0.9}
          opacity={0.18}
          transparent={true}
        />
      </Sphere>

      {/* Second sphere - Brighter purple with more distortion */}
      <Sphere ref={sphere2Ref} args={[3.5, 128, 128]} position={[8, -4, -10]}>
        <MeshDistortMaterial
          color="#c77dff"
          attach="material"
          distort={0.8}
          speed={4}
          roughness={0.3}
          metalness={0.8}
          opacity={0.15}
          transparent={true}
        />
      </Sphere>

      {/* Third sphere - Deep purple */}
      <Sphere ref={sphere3Ref} args={[2.5, 128, 128]} position={[-7, 3, -12]}>
        <MeshDistortMaterial
          color="#5a189a"
          attach="material"
          distort={0.7}
          speed={3.5}
          roughness={0.25}
          metalness={0.85}
          opacity={0.12}
          transparent={true}
        />
      </Sphere>

      {/* Fourth sphere - Small accent sphere */}
      <Sphere args={[1.5, 64, 64]} position={[5, 6, -8]}>
        <MeshDistortMaterial
          color="#e0aaff"
          attach="material"
          distort={0.9}
          speed={5}
          roughness={0.2}
          metalness={0.9}
          opacity={0.1}
          transparent={true}
        />
      </Sphere>
    </>
  )
}

export default BackgroundScene
