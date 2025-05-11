"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, MeshDistortMaterial, Text, PerspectiveCamera } from "@react-three/drei"

// Animated 3D object component
function AnimatedObject({ position, color, scrollY, index, mousePosition }) {
  const meshRef = useRef()
  const { viewport } = useThree()

  // Animation based on scroll and mouse position
  useFrame((state) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2

      // Scroll-based position
      meshRef.current.position.y = position[1] + scrollY.current * 0.1 * ((index % 3) - 1)

      // Mouse-based movement
      if (mousePosition.current) {
        const { x, y } = mousePosition.current
        meshRef.current.position.x = position[0] + x * 0.1 * (index % 2 === 0 ? 1 : -1)
        meshRef.current.position.z = position[2] + y * 0.1 * (index % 2 === 0 ? 1 : -1)
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <MeshDistortMaterial color={color} speed={5} distort={0.3} radius={1} />
    </mesh>
  )
}

// Text component that follows scroll
function ScrollingText({ text, position, scrollY, color }) {
  const textRef = useRef()

  useFrame(() => {
    if (textRef.current) {
      textRef.current.position.y = position[1] + scrollY.current * 0.2
      textRef.current.rotation.x = scrollY.current * 0.01
    }
  })

  return (
    <Text
      ref={textRef}
      position={position}
      color={color}
      fontSize={0.5}
      maxWidth={2}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign="center"
      font="/fonts/Inter_Bold.json"
    >
      {text}
    </Text>
  )
}

// Main scene component
function Scene({ scrollY, mousePosition }) {
  const objects = [
    { position: [-2, 1, 0], color: "#D4AF37" },
    { position: [2, -1, -2], color: "#FF5757" },
    { position: [0, 2, -1], color: "#38B6FF" },
    { position: [-1, -2, -3], color: "#7ED957" },
    { position: [3, 0, -2], color: "#B066FE" },
  ]

  const texts = [
    { text: "ZICA", position: [-1.5, 0, 1], color: "white" },
    { text: "BELLA", position: [1.5, 0, 1], color: "white" },
  ]

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {objects.map((obj, index) => (
        <AnimatedObject
          key={index}
          position={obj.position}
          color={obj.color}
          scrollY={scrollY}
          index={index}
          mousePosition={mousePosition}
        />
      ))}

      {texts.map((text, index) => (
        <ScrollingText key={index} text={text.text} position={text.position} scrollY={scrollY} color={text.color} />
      ))}

      <Environment preset="city" />
    </>
  )
}

export default function ThreejsGsapExploration() {
  const sectionRef = useRef(null)
  const scrollY = useRef(0)
  const mousePosition = useRef({ x: 0, y: 0 })

  // Track mouse position
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    mousePosition.current = { x, y }
  }

  useGSAP(() => {
    const section = sectionRef.current

    if (!section) return

    // Track scroll position
    gsap.to(scrollY, {
      current: 1,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          scrollY.current = self.progress
        },
      },
    })

    // Text animation
    gsap.from(".threejs-title span", {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-40 bg-black overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="container mx-auto px-4 mb-12 relative z-10">
        <h2 className="threejs-title text-4xl md:text-6xl font-bold text-center mb-8 text-white">
          {"3D Experience".split("").map((char, i) => (
            <span key={i} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Scroll and move your mouse to interact with our 3D fashion universe
        </p>
      </div>

      <div className="h-[600px] md:h-[800px]">
        <Canvas>
          <Scene scrollY={scrollY} mousePosition={mousePosition} />
        </Canvas>
      </div>
    </section>
  )
}
