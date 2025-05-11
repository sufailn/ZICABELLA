"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"

const categories = [
  { id: 1, name: "Shirts", image: "/placeholder.svg?height=600&width=400" },
  { id: 2, name: "T-Shirts", image: "/placeholder.svg?height=600&width=400" },
  { id: 3, name: "Cargo", image: "/placeholder.svg?height=600&width=400" },
  { id: 4, name: "Jeans", image: "/placeholder.svg?height=600&width=400" },
  { id: 5, name: "Co-ord Sets", image: "/placeholder.svg?height=600&width=400" },
  { id: 6, name: "Shorts", image: "/placeholder.svg?height=600&width=400" },
  { id: 7, name: "Jorts", image: "/placeholder.svg?height=600&width=400" },
]

export default function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const horizontalRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef(null)

  useGSAP(() => {
    // Title animation with split text
    const title = sectionRef.current?.querySelector("h2")
    const titleText = title?.textContent || ""
    let titleHTML = ""

    for (let i = 0; i < titleText.length; i++) {
      if (titleText[i] === " ") {
        titleHTML += " "
      } else {
        titleHTML += `<span class="inline-block">${titleText[i]}</span>`
      }
    }

    if (title) {
      title.innerHTML = titleHTML
    }

    if (title) {
      gsap.from(title.querySelectorAll("span"), {
        opacity: 0,
        y: 20,
        stagger: 0.03,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      })
    }

    // Subtitle animation
    if (sectionRef.current) {
      gsap.from(sectionRef.current.querySelector("p"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      })
    }

    // Horizontal scroll for categories
    if (window.innerWidth > 768) {
      const categories = gsap.utils.toArray(".category-item")

      // Calculate the width of all categories
      const totalWidth = categories.reduce((width: number, category) => {
        return width + (category as HTMLElement).offsetWidth + 24 // 24px is the gap
      }, 0)

      // Set the width of the container
      if (horizontalRef.current) {
        horizontalRef.current.style.width = `${totalWidth}px`
      }

      // Create the horizontal scroll animation
      gsap.to(horizontalRef.current, {
        x: () => -(totalWidth - window.innerWidth + 32), // 32px for padding
        ease: "none",
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top center",
          end: () => `+=${totalWidth - window.innerWidth + 32}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }

    // Staggered animation for category items
    gsap.from(".category-item", {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
    })

    // Hover animation for category items
    gsap.utils.toArray(".category-item").forEach((item) => {
      const categoryItem = item as HTMLElement
      const image = categoryItem.querySelector("img")
      const overlay = categoryItem.querySelector(".category-overlay")
      const text = categoryItem.querySelector(".category-text")

      const tl = gsap.timeline({ paused: true })
      tl.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          overlay,
          {
            opacity: 0.7,
            duration: 0.4,
          },
          0,
        )
        .to(
          text,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
          },
          "-=0.2",
        )

      categoryItem.addEventListener("mouseenter", () => tl.play())
      categoryItem.addEventListener("mouseleave", () => tl.reverse())
    })

    // Parallax effect on scroll
    gsap.utils.toArray(".category-item").forEach((item, i) => {
      const categoryItem = item as HTMLElement; // Cast to HTMLElement
      return gsap.to(categoryItem, {
        y: i % 2 === 0 ? -30 : 30,
        ease: "none",
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, [])

  return (
    <section ref={sectionRef} className="categories-section py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
          Shop by <span className="font-bold">Category</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Explore our wide range of fashion categories to find your perfect style.
        </p>
      </div>

      <div ref={categoriesRef} className="categories-container relative">
        <div className="md:hidden grid grid-cols-2 gap-4 px-4">
          {categories.map((category) => (
            <a
              key={category.id}
              href="#"
              className="category-item relative rounded-xl overflow-hidden aspect-square group"
            >
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700"
              />
              <div className="category-overlay absolute inset-0 bg-black opacity-30 transition-opacity duration-300"></div>
              <div className="category-text absolute inset-0 flex items-center justify-center transform translate-y-4 opacity-0 transition-all duration-300">
                <h3 className="text-white text-xl font-bold">{category.name}</h3>
              </div>
            </a>
          ))}
        </div>

        <div className="hidden md:block overflow-hidden">
          <div ref={horizontalRef} className="flex gap-6 px-4">
            {categories.map((category) => (
              <a
                key={category.id}
                href="#"
                className="category-item relative rounded-xl overflow-hidden h-[400px] w-[300px] flex-shrink-0 group"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700"
                />
                <div className="category-overlay absolute inset-0 bg-black opacity-30 transition-opacity duration-300"></div>
                <div className="category-text absolute inset-0 flex flex-col items-center justify-center transform translate-y-4 opacity-0 transition-all duration-300">
                  <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                    View Collection
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden md:flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
              <div className="scroll-progress h-full w-0 bg-primary"></div>
            </div>
            <span className="text-sm text-gray-500">Scroll to explore</span>
          </div>
        </div>
      </div>
    </section>
  )
}
