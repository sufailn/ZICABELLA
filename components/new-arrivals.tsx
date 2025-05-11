"use client"

import { SetStateAction, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

const newArrivals = [
  {
    id: 1,
    name: "Summer Collection Shirt",
    description: "Breathable premium cotton with a modern cut, perfect for warm days and stylish evenings.",
    price: 79.99,
    image: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 2,
    name: "Premium Denim Jeans",
    description: "Crafted from the finest denim with our signature wash, these jeans offer both comfort and style.",
    price: 129.99,
    image: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 3,
    name: "Exclusive Co-ord Set",
    description:
      "This matching set combines contemporary design with luxurious fabrics for an effortless statement look.",
    price: 149.99,
    image: "/placeholder.svg?height=800&width=600",
  },
  {
    id: 4,
    name: "Designer T-Shirt Collection",
    description: "Our signature graphic tees feature exclusive designs printed on ultra-soft premium cotton.",
    price: 69.99,
    image: "/placeholder.svg?height=800&width=600",
  },
]

export default function NewArrivals() {
  const sectionRef = useRef(null)
  const sliderRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const slider = sliderRef.current

    if (!section || !slider) return

    // Initialize the timeline
    timeline.current = gsap.timeline({ paused: true })

    // Title animation
    gsap.from(".arrivals-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
      },
    })

    // Subtitle animation with split text effect
    const subtitleText = document.querySelector(".arrivals-subtitle")
    if (subtitleText) {
      const text = subtitleText.textContent || ""
      subtitleText.innerHTML = ""

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span")
        span.textContent = text[i] === " " ? "\u00A0" : text[i]
        span.style.display = "inline-block"
        span.style.opacity = "0"
        span.style.transform = "translateY(20px)"
        subtitleText.appendChild(span)
      }

      gsap.to(subtitleText.children, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      })
    }

    // Initialize the slider
    const slides = gsap.utils.toArray(".arrival-slide")

    slides.forEach((slide, i) => {
      if (!slide) return

      gsap.set(slide, {
        xPercent: i * 100,
        opacity: i === 0 ? 1 : 0.5,
        scale: i === 0 ? 1 : 0.9,
      })
    })

    // Create a function to animate to a specific slide
    const goToSlide = (index: SetStateAction<number>) => {
      if (animating) return
      setAnimating(true)

      const tl = gsap.timeline({
        onComplete: () => {
          setAnimating(false)
          setCurrentSlide(index)
        },
      })

      // Animate all slides
      slides.forEach((slide, i) => {
        if (!slide) return

        tl.to(
          slide,
          {
            xPercent: (i - Number(index)) * 100,
            opacity: i === index ? 1 : 0.5,
            scale: i === index ? 1 : 0.9,
            duration: 1,
            ease: "power3.inOut",
          },
          0,
        )
      })

      // Animate the content of the current slide
      const currentSlide = slides[Number(index)]
      if (currentSlide) {
        const currentContent = (currentSlide as HTMLElement).querySelectorAll(".slide-content > *")
        tl.fromTo(
          currentContent,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
          0.3,
        )
      }
    }

    // Create a GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // Set up navigation buttons
      document.querySelectorAll(".nav-button").forEach((button) => {
        if (!button) return

        button.addEventListener("click", () => {
          if (animating) return
          const direction = button.classList.contains("next") ? 1 : -1
          const newIndex = (currentSlide + direction + slides.length) % slides.length
          goToSlide(newIndex)
        })
      })

      // Set up progress indicators
      document.querySelectorAll(".progress-indicator").forEach((indicator, i) => {
        if (!indicator) return

        indicator.addEventListener("click", () => {
          if (i !== currentSlide) {
            goToSlide(i)
          }
        })

        // Initial active state
        if (i === 0) {
          indicator.classList.add("active")
        }
      })

      // Floating elements animation
      gsap.to(".floating-circle", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      })
    })

    // Update progress indicators when slide changes
    const updateProgress = () => {
      document.querySelectorAll(".progress-indicator").forEach((indicator, i) => {
        if (i === currentSlide) {
          indicator.classList.add("active")
        } else {
          indicator.classList.remove("active")
        }
      })
    }

    // Call the watcher initially
    updateProgress()

    return () => {
      ctx.revert() // Properly clean up all GSAP animations in this context
    }
  }, [currentSlide])

  return (
    <section ref={sectionRef} className="new-arrivals py-20 md:py-32 bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 mb-12 relative">
        {/* Decorative elements */}
        <div className="floating-circle absolute top-10 left-[10%] w-16 h-16 rounded-full bg-primary opacity-10"></div>
        <div className="floating-circle absolute bottom-20 right-[15%] w-24 h-24 rounded-full bg-primary opacity-5"></div>

        <h2 className="arrivals-title text-4xl md:text-5xl font-light text-center mb-4">
          New <span className="font-bold">Arrivals</span>
        </h2>
        <p className="arrivals-subtitle text-gray-400 text-center max-w-2xl mx-auto">
          Be the first to discover our latest fashion pieces, fresh off the runway.
        </p>
      </div>

      <div ref={sliderRef} className="arrivals-slider relative h-[700px] md:h-[800px] overflow-hidden">
        {newArrivals.map((item, index) => (
          <div key={item.id} className="arrival-slide absolute top-0 left-0 w-full h-full">
            <div className="container mx-auto px-4 h-full flex items-center">
              <div className="slide-content grid md:grid-cols-2 gap-8 items-center">
                <div className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="space-y-6 md:space-y-8">
                  <span className="inline-block px-3 py-1 bg-primary text-black text-sm font-medium rounded-full">
                    New Arrival
                  </span>
                  <h3 className="text-3xl md:text-5xl font-bold">{item.name}</h3>
                  <p className="text-gray-400 max-w-md text-lg">{item.description}</p>
                  <p className="text-3xl font-bold">${item.price}</p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                      Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation buttons */}
        <button className="nav-button prev absolute top-1/2 left-4 md:left-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all z-10">
          <ChevronLeft />
        </button>
        <button className="nav-button next absolute top-1/2 right-4 md:right-8 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-all z-10">
          <ChevronRight />
        </button>

        {/* Progress indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {newArrivals.map((_, i) => (
            <button
              key={i}
              className={`progress-indicator w-12 h-1 bg-white/30 hover:bg-white/50 transition-all ${i === currentSlide ? "active bg-primary w-20" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  )
}
