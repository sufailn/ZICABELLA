"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import Header from "@/components/header"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import Categories from "@/components/categories"
import NewArrivals from "@/components/new-arrivals"
import ThreeDExperience from "@/components/3d-experience"
import CoverFlow from "@/components/cover-flow"
import ScrollingRainbow from "@/components/scrolling-rainbow"
import SmoothScrollyImages from "@/components/smooth-scrolly-images"
import ThreejsGsapExploration from "@/components/threejs-gsap-exploration"
import FullscreenZoom from "@/components/fullscreen-zoom"
import FilipZrnzevicInspired from "@/components/filip-zrnzevic-inspired"
import CassieEvansStyle from "@/components/cassie-evans-style"
import Footer from "@/components/footer"

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, DrawSVGPlugin, useGSAP)

export default function Home() {
  const smoother = useRef<ScrollSmoother | null>(null)
  const smoothWrapper = useRef(null)
  const smoothContent = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useGSAP(() => {
    const wrapper = smoothWrapper.current
    const content = smoothContent.current

    if (!wrapper || !content) return

    // Initialize ScrollSmoother
    smoother.current = ScrollSmoother.create({
      wrapper: wrapper,
      content: content,
      smooth: 1.5,
      effects: true,
    })

    // Initial animation
    const tl = gsap.timeline()

    const heroTitle = document.querySelector(".hero-title")
    const heroSubtitle = document.querySelector(".hero-subtitle")
    const heroCta = document.querySelector(".hero-cta")
    const heroImage = document.querySelector(".hero-image")

    if (heroTitle) {
      tl.from(heroTitle, {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      })
    }

    if (heroSubtitle) {
      tl.from(
        heroSubtitle,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      )
    }

    if (heroCta) {
      tl.from(
        heroCta,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6",
      )
    }

    if (heroImage) {
      tl.from(
        heroImage,
        {
          scale: 0.8,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        },
        "-=1",
      )
    }

    // Path animation
    const pathSvg = document.querySelector(".path-svg path")
    if (pathSvg) {
      gsap.from(pathSvg, {
        drawSVG: 0,
        duration: 2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: ".path-section",
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1,
        },
      })
    }

    setIsLoaded(true)

    return () => {
      // Clean up ScrollSmoother
      if (smoother.current) {
        smoother.current.kill()
      }
    }
  }, [])

  return (
    <div ref={smoothWrapper} className="smooth-wrapper">
      <div ref={smoothContent} className="smooth-content">
        <Header />
        <main>
          <Hero />

          <div className="path-section relative py-0">
            <svg
              className="path-svg absolute top-0 left-0 w-full h-full"
              viewBox="0 0 1440 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,150 C300,50 600,250 900,150 C1200,50 1440,150 1440,150"
                stroke="#D4AF37"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <div className="container mx-auto px-4 py-10">
              <h2 className="text-4xl md:text-5xl font-light text-center mb-16">
                Elegance in <span className="font-bold">Every Thread</span>
              </h2>
            </div>
          </div>

          <FeaturedProducts />

          <ScrollingRainbow />

          <CoverFlow />

          {/* <ThreeDExperience /> */}

          <SmoothScrollyImages />

          <Categories />

          <FullscreenZoom />

          <NewArrivals />

          <ThreejsGsapExploration />

          <FilipZrnzevicInspired />

          <CassieEvansStyle />
        </main>
        <Footer />
      </div>
    </div>
  )
}
