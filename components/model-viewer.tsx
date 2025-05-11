"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Html, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei"
import * as THREE from "three"

export default function ModelViewer() {
  const group = useRef<THREE.Group | null>(null)
  const { viewport } = useThree()
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  // Rotation animation
  useFrame((state) => {
    if (group.current) {
      // Base rotation
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2

      // Add additional rotation when hovered
      if (hovered) {
        group.current.rotation.y += Math.sin(state.clock.getElapsedTime() * 2) * 0.03
      }

      // Add slight floating effect
      group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  // Handle interaction
  const handlePointerOver = () => setHovered(true)
  const handlePointerOut = () => setHovered(false)
  const handleClick = () => setActive(!active)

  return (
    <primitive
      object={new THREE.Group()}
      ref={group}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={viewport.width < 5 ? 0.8 : 1}
    >
      {/* Main body of the clothing item */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 3, 32, 1, true]} />
        <MeshDistortMaterial
          color="#f8f8f8"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
          distort={hovered ? 0.2 : 0.1}
          speed={hovered ? 2 : 1}
        />
      </mesh>

      {/* Collar with wobble effect */}
      <mesh position={[0, 1.4, 0]}>
        <torusGeometry args={[1.2, 0.2, 16, 32]} />
        <MeshWobbleMaterial
          color="#e0e0e0"
          roughness={0.5}
          metalness={0.1}
          factor={hovered ? 0.6 : 0.3}
          speed={hovered ? 2 : 1}
        />
      </mesh>

      {/* Left sleeve with distortion */}
      <mesh position={[1.5, 0.5, 0]} rotation={[0, 0, Math.PI * 0.25]}>
        <cylinderGeometry args={[0.4, 0.5, 1.5, 32, 1, true]} />
        <MeshDistortMaterial
          color="#f8f8f8"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
          distort={hovered ? 0.3 : 0.1}
          speed={hovered ? 3 : 1}
        />
      </mesh>

      {/* Right sleeve with distortion */}
      <mesh position={[-1.5, 0.5, 0]} rotation={[0, 0, -Math.PI * 0.25]}>
        <cylinderGeometry args={[0.4, 0.5, 1.5, 32, 1, true]} />
        <MeshDistortMaterial
          color="#f8f8f8"
          side={THREE.DoubleSide}
          roughness={0.6}
          metalness={0.1}
          distort={hovered ? 0.3 : 0.1}
          speed={hovered ? 3 : 1}
        />
      </mesh>

      {/* Brand logo */}
      <Text
        position={[0, 0, 1.21]}
        rotation={[0, 0, 0]}
        fontSize={0.3}
        color="#333333"
        font="/fonts/Inter_Bold.json"
        anchorX="center"
        anchorY="middle"
      >
        ZICA BELLA
      </Text>

      {/* Interactive HTML element */}
      {active && (
        <Html position={[0, 2.2, 0]} className="pointer-events-none" center>
          <div className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg w-48 text-center">
            <p className="font-bold">Premium Collection</p>
            <p className="text-sm mt-1">Hover to see fabric movement</p>
          </div>
        </Html>
      )}

      {/* Decorative elements */}
      <mesh position={[0, -1.2, 0.8]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[0, -1.0, 0.8]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>
    </primitive>
  )
}
