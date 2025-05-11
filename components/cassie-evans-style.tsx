"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"

export default function CassieEvansStyle() {
  const sectionRef = useRef(null)
  const textPathRef = useRef(null)
  const circlesRef = useRef(null)
  const imagesRef = useRef(null)

  useGSAP(() => {
    const section = sectionRef.current
    const textPath = textPathRef.current
    const circles = circlesRef.current
    const images = imagesRef.current

    if (!section || !textPath || !circles || !images) return

    // Create the text path animation
    gsap.to(textPath, {
      attr: { startOffset: "100%" },
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    })

    // Create the circles animation
    const circleElements = gsap.utils.toArray(".animated-circle")

    circleElements.forEach((circle, i) => {
      if (!circle) return

      const delay = i * 0.2

      gsap.from(circle, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: circles,
          start: "top 80%",
        },
        delay,
      })

      // Create a continuous floating animation
      gsap.to(circle, {
        y: `${i % 2 === 0 ? "-" : "+"}20`,
        duration: 2 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay,
      })
    })

    // Create the staggered image reveal
    const imageElements = gsap.utils.toArray(".reveal-image")

    imageElements.forEach((image, i) => {
      if (!image) return

      const imageWrapper = (image as HTMLElement).parentElement
      if (!imageWrapper) return

      const imageMask = imageWrapper.querySelector(".image-mask")
      if (!imageMask) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: imageWrapper,
          start: "top 80%",
        },
      })

      tl.from(imageMask, {
        xPercent: -100,
        duration: 1,
        ease: "power2.inOut",
      }).from(
        image,
        {
          scale: 1.3,
          duration: 1.5,
          ease: "power2.out",
        },
        0,
      )
    })

    // Create the text reveal animation
    const textBlocks = gsap.utils.toArray(".reveal-text") as HTMLElement[]

    textBlocks.forEach((block) => {

      gsap.from(block, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: block,
          start: "top 80%",
        },
      })
    })
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 overflow-hidden bg-white">
      {/* SVG Text Path */}
      <div className="relative h-20 mb-12 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path id="textPath" d="M0,50 C250,0 750,100 1000,50" fill="none" stroke="none" />
          <text className="text-3xl font-bold">
            <textPath ref={textPathRef} href="#textPath" startOffset="0%">
              ZICA BELLA FASHION • PREMIUM COLLECTION • ZICA BELLA FASHION • PREMIUM COLLECTION •
            </textPath>
          </text>
        </svg>
      </div>

      {/* Decorative Circles */}
      <div ref={circlesRef} className="relative container mx-auto px-4 mb-20">
        <div className="animated-circle absolute top-0 left-[10%] w-32 h-32 rounded-full bg-primary opacity-10"></div>
        <div className="animated-circle absolute top-20 right-[20%] w-48 h-48 rounded-full bg-pink-500 opacity-5"></div>
        <div className="animated-circle absolute bottom-0 left-[30%] w-24 h-24 rounded-full bg-blue-500 opacity-10"></div>
        <div className="animated-circle absolute bottom-20 right-[5%] w-40 h-40 rounded-full bg-purple-500 opacity-5"></div>
      </div>

      {/* Content */}
      <div ref={imagesRef} className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="flex flex-col justify-center">
            <h2 className="reveal-text text-4xl md:text-5xl font-bold mb-6">Smooth Scrolling Experience</h2>
            <p className="reveal-text text-gray-600 text-lg mb-8">
              Our premium fashion collection is presented with the smoothest scrolling experience, allowing you to
              explore our designs with elegance and style.
            </p>
            <div className="reveal-text">
              <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all">
                Explore Collection
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl">
            <div className="image-mask absolute inset-0 bg-primary z-10 transform origin-left"></div>
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Fashion model"
              width={600}
              height={800}
              className="reveal-image w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="relative overflow-hidden rounded-xl md:order-2">
            <div className="image-mask absolute inset-0 bg-primary z-10 transform origin-left"></div>
            <Image
              src="/placeholder.svg?height=800&width=600"
              alt="Fashion collection"
              width={600}
              height={800}
              className="reveal-image w-full h-auto object-cover"
            />
          </div>

          <div className="flex flex-col justify-center md:order-1">
            <h2 className="reveal-text text-4xl md:text-5xl font-bold mb-6">Animated Elegance</h2>
            <p className="reveal-text text-gray-600 text-lg mb-8">
              Every scroll reveals new elements with carefully crafted animations, enhancing your shopping experience
              with visual delight.
            </p>
            <div className="reveal-text">
              <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all">
                View Lookbook
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
