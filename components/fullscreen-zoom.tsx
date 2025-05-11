"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"

const featuredItems = [
  {
    id: 1,
    title: "Summer Collection",
    description: "Light fabrics for hot days",
    image: "/placeholder.svg?height=1200&width=800",
  },
  {
    id: 2,
    title: "Autumn Essentials",
    description: "Transitional pieces for changing seasons",
    image: "/placeholder.svg?height=1200&width=800",
  },
  {
    id: 3,
    title: "Winter Warmers",
    description: "Cozy and stylish cold weather options",
    image: "/placeholder.svg?height=1200&width=800",
  },
]

export default function FullscreenZoom() {
  const sectionRef = useRef(null)
  const overlayRef = useRef(null)
  const fullscreenImageRef = useRef(null)
  const fullscreenContentRef = useRef(null)

  useGSAP(() => {
    const overlay = overlayRef.current
    const fullscreenImage = fullscreenImageRef.current
    const fullscreenContent = fullscreenContentRef.current

    if (!overlay || !fullscreenImage || !fullscreenContent) return

    // Set up the fullscreen overlay
    gsap.set(overlay, {
      opacity: 0,
      visibility: "hidden",
    })

    gsap.set(fullscreenImage, {
      scale: 1.5,
      opacity: 0,
    })

    gsap.set(fullscreenContent, {
      y: 50,
      opacity: 0,
    })

    // Set up hover animations for each item
    const items = gsap.utils.toArray(".zoom-item")

    // Create a GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      items.forEach((item) => {
        if (!item) return

        const image = item.querySelector("img")
        const title = item.querySelector(".item-title")?.textContent || ""
        const description = item.querySelector(".item-description")?.textContent || ""
        const imageSrc = image?.src || ""

        // Create hover animation
        item.addEventListener("mouseenter", () => {
          gsap.to(item.querySelector(".zoom-overlay"), {
            opacity: 0.3,
            duration: 0.3,
          })

          gsap.to(item.querySelector(".zoom-content"), {
            y: 0,
            opacity: 1,
            duration: 0.3,
          })
        })

        item.addEventListener("mouseleave", () => {
          gsap.to(item.querySelector(".zoom-overlay"), {
            opacity: 0,
            duration: 0.3,
          })

          gsap.to(item.querySelector(".zoom-content"), {
            y: 20,
            opacity: 0,
            duration: 0.3,
          })
        })

        // Set up fullscreen zoom
        item.addEventListener("click", () => {
          // Update fullscreen content
          fullscreenImage.src = imageSrc
          const titleElement = fullscreenContent.querySelector("h3")
          const descElement = fullscreenContent.querySelector("p")

          if (titleElement) titleElement.textContent = title
          if (descElement) descElement.textContent = description

          // Animate overlay in
          gsap.to(overlay, {
            opacity: 1,
            visibility: "visible",
            duration: 0.5,
          })

          // Animate image in
          gsap.to(fullscreenImage, {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
          })

          // Animate content in
          gsap.to(fullscreenContent, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.2,
          })

          // Disable body scroll
          document.body.style.overflow = "hidden"
        })
      })

      // Close fullscreen on click
      overlay.addEventListener("click", () => {
        // Animate overlay out
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            gsap.set(overlay, {
              visibility: "hidden",
            })
          },
        })

        // Animate image out
        gsap.to(fullscreenImage, {
          scale: 1.5,
          opacity: 0,
          duration: 0.5,
        })

        // Animate content out
        gsap.to(fullscreenContent, {
          y: 50,
          opacity: 0,
          duration: 0.3,
        })

        // Re-enable body scroll
        document.body.style.overflow = "auto"
      })
    })

    return () => {
      ctx.revert() // This will clean up all event listeners
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-gray-100">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
          Featured <span className="font-bold">Collections</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Click on any image to explore in fullscreen detail
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 px-4">
        {featuredItems.map((item) => (
          <div key={item.id} className="zoom-item relative h-[400px] rounded-xl overflow-hidden cursor-pointer">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="zoom-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-300"></div>
            <div className="zoom-content absolute bottom-0 left-0 right-0 p-6 transform translate-y-20 opacity-0 transition-all duration-300">
              <h3 className="item-title text-white text-2xl font-bold">{item.title}</h3>
              <p className="item-description text-white/80 mt-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen overlay */}
      <div ref={overlayRef} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
          <div className="absolute top-4 right-4 z-10">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="h-full flex flex-col md:flex-row items-center">
            <div className="relative w-full md:w-2/3 h-[50vh] md:h-full">
              <img
                ref={fullscreenImageRef}
                src="/placeholder.svg"
                alt="Fullscreen view"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            <div ref={fullscreenContentRef} className="w-full md:w-1/3 p-8 text-white">
              <h3 className="text-3xl font-bold mb-4"></h3>
              <p className="text-lg text-white/80 mb-6"></p>
              <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-opacity-90 transition-all">
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
