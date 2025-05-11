"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

export default function ScrollingRainbow() {
  const sectionRef = useRef(null)
  const gradientRef = useRef(null)

  useGSAP(() => {
    // Create a timeline for color transitions
    const colorTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })

    // Define color stops for the rainbow effect
    const colors = [
      { position: 0, color: "#FF5757" }, // Red
      { position: 0.16, color: "#FF914D" }, // Orange
      { position: 0.33, color: "#FFDE59" }, // Yellow
      { position: 0.5, color: "#7ED957" }, // Green
      { position: 0.66, color: "#38B6FF" }, // Blue
      { position: 0.83, color: "#5E17EB" }, // Indigo
      { position: 1, color: "#B066FE" }, // Violet
    ]

    // Create the rainbow animation
    colors.forEach((stop, index) => {
      if (index < colors.length - 1) {
        const nextStop = colors[index + 1]

        colorTimeline.to(
          gradientRef.current,
          {
            background: `linear-gradient(135deg, ${stop.color} 0%, ${nextStop.color} 100%)`,
            duration: 1,
            ease: "none",
          },
          index,
        )
      }
    })

    // Add parallax effect to content
    gsap.to(".rainbow-content", {
      y: "30%",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })

    // Text reveal animation
    gsap.from(".rainbow-text", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "top 30%",
        scrub: 1,
      },
    })
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 overflow-hidden">
      {/* Background gradient that changes color */}
      <div
        ref={gradientRef}
        className="absolute inset-0 bg-gradient-to-br from-[#FF5757] to-[#FF914D] transition-colors duration-300"
      ></div>

      {/* Overlay texture */}
      <div className="absolute inset-0 bg-[url('/explore/Accessories collection.jpeg?height=100&width=100')] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="rainbow-content max-w-4xl mx-auto text-center text-white">
          <h2 className="rainbow-text text-5xl md:text-7xl font-bold mb-8">Colors of Fashion</h2>
          <p className="rainbow-text text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Explore our vibrant collection that brings life and color to your wardrobe
          </p>
          <div className="rainbow-text">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-opacity-90 transition-all">
              Discover the Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
