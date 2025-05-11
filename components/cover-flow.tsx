"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"

const products = [
  { id: 1, name: " Slim Fit Jeans", image: "/Explore/PremiumShirt.jpeg" },
  { id: 2, name: "Designer T-Shirt", image: "/explore/Designer tshirt.jpeg" },
  { id: 3, name: "Cargo Pants Elite", image: "/explore/Cargo pants.jpeg" },
  { id: 4, name: "Premium Cotton Shirt", image: "/explore/PremiumShirt.png" },
  { id: 5, name: "Summer Co-ord Set", image: "/explore/Summer co ord set.jpeg" },
  { id: 6, name: "Casual Shorts", image: "/explore/Casual shorts.jpeg" },
  { id: 7, name: "Denim Jorts", image: "/explore/Denim jorts.jpeg" },
  { id: 8, name: "Luxury Dress Shirt", image: "/explore/Luxury shirt.jpeg" },
  { id: 9, name: "Premium Cotton Shirt", image: "/explore/PremiumShirt.png" },
  { id: 10, name: "Designer T-Shirt", image: "/explore/Designer tshirt.jpeg" },
  { id: 11, name: "Cargo Pants Elite", image: "/explore/Cargo pants1.jpeg" },
  { id: 12, name: "Slim Fit Jeans", image: "/explore/Slim fit jean.jpeg" },
]

export default function CoverFlow() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    const cards = cardsRef.current
    const track = trackRef.current
    const section = sectionRef.current

    if (!cards || !track || !section) return

    // Set initial positions with 3D transforms
    gsap.set(cards, {
      xPercent: -50,
      left: "50%",
      position: "absolute",
    })

    // Position each card with perspective
    cards.forEach((card, i) => {
      if (!card) return
      const progress = i / (cards.length - 1)
      const position = gsap.utils.mapRange(0, 1, -100, 100, progress)

      gsap.set(card, {
        zIndex: i < cards.length / 2 ? i : cards.length - i,
        z: i < cards.length / 2 ? i * 10 : (cards.length - i) * 10,
        rotationY: position < 0 ? 15 : position > 0 ? -15 : 0,
        x: position * 10,
        scale: 1 - Math.abs(position) * 0.003,
        opacity: 1 - Math.abs(position) * 0.005,
      })
    })

    // Create infinite scrolling animation
    const infiniteScroll = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" },
    })

    const totalWidth = cards.length * 100 // Approximate width per card

    infiniteScroll.to(cards, {
      duration: 20,
      x: "+=1000", // Move cards to the right
      modifiers: {
        x: (x, target) => {
          const currentX = Number.parseFloat(x)
          const newX = ((currentX % totalWidth) + totalWidth) % totalWidth
          const position = gsap.utils.mapRange(0, totalWidth, -100, 100, newX)

          gsap.set(target, {
            zIndex: Math.round(100 - Math.abs(position)),
            rotationY: position < 0 ? 15 : position > 0 ? -15 : 0,
            scale: 1 - Math.abs(position) * 0.003,
            opacity: 1 - Math.abs(position) * 0.005,
            z: 100 - Math.abs(position),
          })

          return currentX
        },
      },
    })

    // Mouse move effect
    const handleMouseMove = (e: { clientX: number }) => {
      const rect = section.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const centerX = rect.width / 2
      const distFromCenter = (mouseX - centerX) / centerX

      infiniteScroll.timeScale(distFromCenter * 2)

      if (Math.abs(distFromCenter) < 0.1) {
        infiniteScroll.timeScale(0)
      }
    }

    const ctx = gsap.context(() => {
      section.addEventListener("mousemove", handleMouseMove)
      section.addEventListener("mouseenter", () => infiniteScroll.play())
      section.addEventListener("mouseleave", () => infiniteScroll.pause())
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 overflow-hidden bg-black">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4 text-white">
          Explore Our <span className="font-bold">Collection</span>
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Move your mouse to navigate through our premium fashion pieces
        </p>
      </div>

      <div className="relative h-[500px] perspective-1000 overflow-hidden">
        <div ref={trackRef} className="absolute inset-0 transform-style-preserve-3d">
          {products.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                cardsRef.current[index] = el
              }}
              className="w-[300px] h-[400px] absolute top-1/2 left-1/2 transform -translate-y-1/2 rounded-xl overflow-hidden shadow-2xl cursor-pointer"
            >
              <div className="relative w-full h-full">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
