"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  const heroRef = useRef(null)

  useGSAP(() => {
    // Parallax effect on hero image
    gsap.to(".hero-image-container", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    // Floating animation for decorative elements
    gsap.to(".floating-element", {
      y: -20,
      duration: 2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    })
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4  w-20 h-20 rounded-full bg-gradient-to-r from-pink-200 to-pink-300 opacity-40 floating-element"></div>
      <div className="absolute bottom-1/3 right-[15%] w-32 h-32 rounded-full bg-gradient-to-r from-purple-200 to-purple-300 opacity-30 floating-element"></div>
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 flex flex-col items-center text-center">
        <div className="max-w-3xl"></div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 text-center">
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Redefine Your <span className="text-primary">Style</span>
            </h1>
            <p className="hero-subtitle mt-6 text-xl md:text-2xl text-gray-600 max-w-md mx-auto">
              Discover the latest fashion trends with Zica Bella's premium collection..
            </p>
            <div className="hero-cta mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
              Explore Collection
              </Button>
            </div>
            </div>
          {/* <div className="order-1 md:order-2 hero-image-container">
            <div className="hero-image relative h-[500px] md:h-[600px] overflow-hidden rounded-xl">
              <Image
                src="/explore/Luxury shirt.jpeg"
                alt="Fashion model wearing Zica Bella clothing"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  )
}
