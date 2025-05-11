"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"

export default function FilipZrnzevicInspired() {
  const sectionRef = useRef(null)
  const galleryRef = useRef(null)
  const imagesRef = useRef([])

  useGSAP(() => {
    const section = sectionRef.current
    const gallery = galleryRef.current
    const imageWrappers = imagesRef.current

    if (!section || !gallery || !imageWrappers) return

    // Create a staggered reveal animation for the title
    const titleChars = gsap.utils.toArray(".title-char")

    gsap.from(titleChars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.03,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
    })

    // Create a GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Create a magnetic hover effect for images
      imageWrappers.forEach((imageWrapper) => {
        if (!imageWrapper) return

        const image = imageWrapper.querySelector("img")
        const overlay = imageWrapper.querySelector(".image-overlay")
        const title = imageWrapper.querySelector(".image-title")

        if (!image || !overlay || !title) return

        // Magnetic effect
        imageWrapper.addEventListener("mousemove", (e) => {
          const rect = imageWrapper.getBoundingClientRect()
          const mouseX = e.clientX - rect.left
          const mouseY = e.clientY - rect.top

          const centerX = rect.width / 2
          const centerY = rect.height / 2

          const moveX = (mouseX - centerX) / 15
          const moveY = (mouseY - centerY) / 15

          gsap.to(image, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: "power2.out",
          })

          // Tilt effect
          const tiltX = ((mouseY - centerY) / (rect.height / 2)) * -10
          const tiltY = ((mouseX - centerX) / (rect.width / 2)) * 10

          gsap.to(imageWrapper, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 0.5,
            ease: "power2.out",
          })
        })

        // Reset on mouse leave
        imageWrapper.addEventListener("mouseleave", () => {
          gsap.to(image, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          })

          gsap.to(imageWrapper, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
          })
        })

        // Hover effect for overlay and title
        imageWrapper.addEventListener("mouseenter", () => {
          gsap.to(overlay, {
            opacity: 0.7,
            duration: 0.3,
          })

          gsap.to(title, {
            y: 0,
            opacity: 1,
            duration: 0.4,
          })
        })

        imageWrapper.addEventListener("mouseleave", () => {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.3,
          })

          gsap.to(title, {
            y: 20,
            opacity: 0,
            duration: 0.4,
          })
        })
      })
    })

    // Create a horizontal scroll effect
    if (gallery) {
      gsap.to(gallery, {
        x: () => -(gallery.scrollWidth - window.innerWidth + 100),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: () => `+=${gallery.scrollWidth - window.innerWidth + 500}`,
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
    <section ref={sectionRef} className="py-20 md:py-32 overflow-hidden bg-black">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-8 text-white perspective-1000">
          {"Artistic Vision".split("").map((char, i) => (
            <span key={i} className="title-char inline-block transform-style-preserve-3d">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>
        <p className="text-gray-400 text-center max-w-2xl mx-auto">Explore our artistic fashion photography</p>
      </div>

      <div className="relative overflow-hidden h-[600px]">
        <div ref={galleryRef} className="flex gap-8 px-4 absolute left-0">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              ref={(el) => (imagesRef.current[item - 1] = el)}
              className="gallery-item relative w-[400px] h-[500px] flex-shrink-0 overflow-hidden rounded-xl perspective-1000 transform-style-preserve-3d"
            >
              <Image
                src={`/placeholder.svg?height=1000&width=800`}
                alt={`Fashion item ${item}`}
                fill
                className="object-cover transition-transform duration-500"
              />
              <div className="image-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-300"></div>
              <div className="image-title absolute bottom-0 left-0 right-0 p-6 transform translate-y-20 opacity-0 transition-all duration-300">
                <h3 className="text-white text-2xl font-bold">Artistic Series {item}</h3>
                <p className="text-white/80 mt-2">Zica Bella Exclusive</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
