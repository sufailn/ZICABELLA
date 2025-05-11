"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Canvas } from "@react-three/fiber"
import { Environment, Float, PresentationControls, ContactShadows } from "@react-three/drei"
import ModelViewer from "./model-viewer"

export default function ThreeDExperience() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const textRef = useRef(null)

  useGSAP(() => {
    // Title animation with character splitting
    const title = textRef.current.querySelector("h2")
    const originalText = title.textContent
    let newHTML = ""

    for (let i = 0; i < originalText.length; i++) {
      if (originalText[i] === " ") {
        newHTML += " "
      } else {
        newHTML += `<span class="char">${originalText[i]}</span>`
      }
    }

    title.innerHTML = newHTML

    // Animate each character
    gsap.from(".char", {
      opacity: 0,
      y: 40,
      rotateX: -90,
      stagger: 0.03,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
    })

    // Subtitle animation
    gsap.from(textRef.current.querySelector("p"), {
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.5,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
    })

    // Canvas reveal animation
    gsap.from(canvasRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
    })

    // Floating elements animation
    gsap.to(".floating-element", {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    })

    // Parallax effect on scroll
    gsap.to(canvasRef.current, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })

    // Rotate model on scroll
    gsap.to(".canvas-container", {
      attr: { "data-rotation": 360 },
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="model-section py-20 md:py-32 bg-black overflow-hidden relative">
      {/* Decorative elements */}
      <div className="floating-element absolute top-20 left-[10%] w-32 h-32 rounded-full bg-primary opacity-5"></div>
      <div className="floating-element absolute bottom-40 right-[15%] w-48 h-48 rounded-full bg-primary opacity-10"></div>

      <div className="container mx-auto px-4">
        <div ref={textRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-light text-center mb-6 text-white">
            Experience <span className="font-bold">Fashion in 3D</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Interact with our premium clothing in an immersive 3D environment. Rotate, zoom, and explore the details of
            our craftsmanship.
          </p>
        </div>

        <div ref={canvasRef} className="canvas-container h-[500px] md:h-[700px] relative" data-rotation="0">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
              config={{ mass: 2, tension: 400 }}
              snap={{ mass: 4, tension: 400 }}
            >
              <Float rotationIntensity={0.4} floatIntensity={0.8} speed={2}>
                <ModelViewer />
              </Float>
            </PresentationControls>
            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={5} blur={2.5} />
            <Environment preset="city" />
          </Canvas>

          {/* Interactive instructions */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
            <p className="mb-2">Click and drag to rotate • Scroll to zoom</p>
            <div className="flex justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
              <span className="inline-block w-2 h-2 bg-white/30 rounded-full"></span>
              <span className="inline-block w-2 h-2 bg-white/30 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
