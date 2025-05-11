"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Premium Cotton Shirt",
    category: "Shirt",
    price: 89.99,
    image: "/explore/PremiumShirt.png",
  },
  {
    id: 2,
    name: "Designer T-Shirt",
    category: "Tshirt",
    price: 59.99,
    image: "/explore/Designer tshirt.jpeg",
  },
  {
    id: 3,
    name: "Cargo Pants Elite",
    category: "Cargo",
    price: 119.99,
    image: "/explore/Cargo pants1.jpeg",
  },
  {
    id: 4,
    name: "Slim Fit Jeans",
    category: "Jeans",
    price: 99.99,
    image: "/explore/Slim fit jean.jpeg",
  },
  {
    id: 5,
    name: "Summer Co-ord Set",
    category: "Co-ord Set",
    price: 149.99,
    image: "/explore/Summer co ord set.jpeg",
  },
  {
    id: 6,
    name: "Casual Shorts",
    category: "Shorts",
    price: 69.99,
    image: "/explore/Casual shorts.jpeg",
  },
  {
    id: 7,
    name: "Denim Jorts",
    category: "Jorts",
    price: 79.99,
    image: "/explore/Denim jorts1.jpeg",
  },
  {
    id: 8,
    name: "Luxury Dress Shirt",
    category: "Shirt",
    price: 109.99,
    image: "/explore/Luxury shirt.jpeg",
  },
]

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef(null)

  useGSAP(() => {
    // Title animation with character splitting
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

    // Horizontal scroll for products on mobile and tablet
    if (window.innerWidth < 1024) {
      const slider = sliderRef.current
      const productCards = gsap.utils.toArray(".product-card")
      const totalWidth = productCards.reduce((width: number, card) => {
        const productCard = card as HTMLElement
        return width + productCard.offsetWidth + 24 // 24px is the gap
      }, 0)

      // Set the width of the container
      if (slider) {
        slider.style.width = `${totalWidth}px`
      }

      // Create the horizontal scroll animation
      const scrollTween = gsap.to(slider, {
        x: () => -(totalWidth - window.innerWidth + 32), // 32px for padding
        ease: "none",
        scrollTrigger: {
          trigger: ".products-container",
          start: "top center",
          end: () => `+=${totalWidth - window.innerWidth + 32}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              gsap.to(progressRef.current, {
                width: `${self.progress * 100}%`,
                duration: 0.1,
              })
            }
          },
        },
      })

      // Navigation buttons
      document.querySelector(".prev-button")?.addEventListener("click", () => {
        const currentProgress = scrollTween?.scrollTrigger?.progress || 0
        const newProgress = Math.max(0, currentProgress - 0.25)
        scrollTween.scrollTrigger?.scroll(
          scrollTween.scrollTrigger.start +
            (scrollTween.scrollTrigger.end - scrollTween.scrollTrigger.start) * newProgress,
        )
      })

      document.querySelector(".next-button")?.addEventListener("click", () => {
        const currentProgress = scrollTween?.scrollTrigger?.progress || 0
        const newProgress = Math.min(1, currentProgress + 0.25)
        scrollTween.scrollTrigger?.scroll(
          scrollTween.scrollTrigger.start +
            (scrollTween.scrollTrigger.end - scrollTween.scrollTrigger.start) * newProgress,
        )
      })
    }

    // Product cards animation
    gsap.from(".product-card", {
      opacity: 0,
      y: 50,
      stagger: {
        each: 0.1,
        grid: "auto",
        from: "start",
      },
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
    })

    // Product hover animation
    gsap.utils.toArray(".product-card").forEach((card) => {
      const image = (card as HTMLElement).querySelector(".product-image")
      const overlay = (card as HTMLElement).querySelector(".product-overlay")
      const buttons = (card as HTMLElement).querySelectorAll(".product-button")

      const tl = gsap.timeline({ paused: true })
      tl.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: "power2.out",
      })
        .to(
          overlay,
          {
            opacity: 1,
            duration: 0.4,
          },
          0,
        )
        .to(
          buttons,
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.4,
          },
          "-=0.2",
        )
tl.reverse();
(card as HTMLElement).addEventListener("mouseenter", () => tl.play());
(card as HTMLElement).addEventListener("mouseleave", () => tl.reverse());
     
    })

    // Floating elements animation
    gsap.to(".floating-element", {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.3,
    })
  }, [])

  return (
    <section ref={sectionRef} className="featured-products py-20 md:py-32 bg-gray-50 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="floating-element absolute top-20 left-[10%] w-24 h-24 rounded-full bg-primary opacity-5"></div>
      <div className="floating-element absolute bottom-40 right-[15%] w-32 h-32 rounded-full bg-primary opacity-10"></div>

      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-4">
          Featured <span className="font-bold">Collection</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">
          Discover our handpicked selection of premium fashion pieces that define the season.
        </p>

        <div className="products-container overflow-hidden relative">
          {/* Mobile and tablet slider */}
          <div className="lg:hidden relative">
            <div ref={sliderRef} className="flex gap-6 px-4">
              {products.map((product) => (
                <div key={product.id} className="product-card group relative flex-shrink-0 w-[280px]">
                  <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="product-image object-cover transition-transform duration-500"
                    />
                    <div className="product-overlay absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          className="product-button rounded-full bg-white text-black hover:bg-gray-100 opacity-0 transform translate-y-4"
                        >
                          <ShoppingBag size={18} />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="product-button rounded-full bg-white border-white text-black hover:bg-gray-100 opacity-0 transform translate-y-4"
                        >
                          <Heart size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium text-lg">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.category}</p>
                    <p className="font-bold mt-1">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation controls */}
            <div className="absolute top-1/3 left-2 z-10">
              <button className="prev-button w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="absolute top-1/3 right-2 z-10">
              <button className="next-button w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-6 mx-auto w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div ref={progressRef} className="h-full bg-primary w-0"></div>
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="product-card group relative">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="product-image object-cover transition-transform duration-500"
                  />
                  <div className="product-overlay absolute inset-0 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        className="product-button rounded-full bg-white text-black hover:bg-gray-100 opacity-0 transform translate-y-4"
                      >
                        <ShoppingBag size={18} />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="product-button rounded-full bg-white border-white text-black hover:bg-gray-100 opacity-0 transform translate-y-4"
                      >
                        <Heart size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                  <p className="font-bold mt-1">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
