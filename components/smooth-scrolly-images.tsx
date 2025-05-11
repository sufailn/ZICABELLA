"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"

const images = [
  { id: 1, src: "/explore/Casual wear.jpeg?height=800&width=600", alt: "Fashion model in casual wear" },
  { id: 2, src: "explore/Urban street style.jpeg?height=800&width=600", alt: "Urban street style" },
  { id: 3, src: "/explore/Summer collection.jpeg?height=800&width=600", alt: "Summer collection" },
  { id: 4, src: "/explore/Formal attire.jpeg?height=800&width=600", alt: "Formal attire" },
  { id: 5, src: "/explore/Accessories collection.jpeg?height=800&width=600", alt: "Accessories collection" },
  { id: 6, src: "/explore/Winter fashion.jpeg?height=800&width=600", alt: "Winter fashion" },
]

export default function SmoothScrollyImages() {
  const sectionRef = useRef(null)
  const imagesRef = useRef(null)
  const imagesWrapperRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const imagesContainer = imagesRef.current
    const imagesWrapper = imagesWrapperRef.current

    if (!section || !imagesContainer || !imagesWrapper) return

    const images = gsap.utils.toArray(".scrolly-image")

    // Set initial positions
    gsap.set(images, {
      y: (i) => (i % 2 === 0 ? "10%" : "-10%"),
    })

    // Create a GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Create the parallax effect
      images.forEach((image, i) => {
        if (!image) return

        const speed = i % 2 === 0 ? 0.5 : -0.5

        gsap.to(image, {
          y: `${speed * 100}%`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })

        // Add hover animation
        const imageWrapper = (image as HTMLElement).parentElement
        if (!imageWrapper) return

        const overlay = imageWrapper.querySelector(".image-overlay")
        const caption = imageWrapper.querySelector(".image-caption")

        if (!overlay || !caption) return

        imageWrapper.addEventListener("mouseenter", () => {
          gsap.to(image, {
            scale: 1.05, // Slight zoom
            duration: 0.5,
            ease: "power2.out",
          })

          gsap.to(overlay, {
            opacity: 0.3,
            duration: 0.5,
          })

          gsap.to(caption, {
            y: 0,
            opacity: 1,
            duration: 0.5,
          })
        })

        imageWrapper.addEventListener("mouseleave", () => {
          gsap.to(image, {
            scale: 1, // Reset zoom
            duration: 0.5,
            ease: "power2.out",
          })

          gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
          })

          gsap.to(caption, {
            y: 20,
            opacity: 0,
            duration: 0.5,
          })
        })
      })
    })

    // Horizontal scroll for the image gallery
    if (imagesWrapper.scrollWidth > window.innerWidth) {
      gsap.to(imagesWrapper, {
        x: () => -(imagesWrapper.scrollWidth - window.innerWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: imagesContainer,
          start: "top center",
          end: () => `+=${imagesWrapper.scrollWidth - window.innerWidth + 500}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }

    return () => {
      ctx.revert() // This will clean up all event listeners
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 overflow-hidden bg-gray-800">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
          Fashion <span className="font-bold">Gallery</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Scroll to explore our latest photoshoots and collections
        </p>
      </div>

      <div ref={imagesRef} className="relative overflow-hidden">
        <div ref={imagesWrapperRef} className="flex gap-8 px-4 py-8" style={{ width: `${images.length * 400}px` }}>
          {images.map((image, index) => (
            <div key={image.id} className="relative w-[350px] h-[500px] flex-shrink-0 overflow-hidden rounded-xl">
              <Image
                src={image.src || "/explore/banner.jpeg"}
                alt={image.alt}
                fill
                className={`scrolly-image object-cover transition-transform duration-700`}
              />
              <div className="image-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-500"></div>
              <div className="image-caption absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 opacity-1 transition-all duration-500">
                <h3 className="text-white text-xl font-bold">{image.alt}</h3>
                <p className="text-white/80 mt-2">Zica Bella Collection</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
