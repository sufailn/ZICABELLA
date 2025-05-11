"use client"

import { useRef, useState, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ShoppingBag, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef(null)
  const menuTimelineRef = useRef(null)

  // Handle scroll state
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setScrolled(scrollPosition > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useGSAP(() => {
    // Create menu animation timeline
    menuTimelineRef.current = gsap.timeline({ paused: true })

    menuTimelineRef.current
      .to(".mobile-menu", {
        clipPath: "circle(150% at 90% 10%)",
        duration: 0.8,
        ease: "power3.inOut",
      })
      .from(
        ".nav-item",
        {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.4,
          ease: "power3.out",
        },
        "-=0.4",
      )

    // Header animation on scroll
    gsap.to(headerRef.current, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "50px top",
        scrub: true,
      },
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    })

    // Logo animation
    gsap.from(".logo", {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.5)",
    })

    // Nav items animation
    gsap.from(".desktop-nav .nav-item", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
    })

    // Icons animation
    gsap.from(".icon-item", {
      y: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.3,
    })

    // Hover animations for nav items
    gsap.utils.toArray(".desktop-nav .nav-item").forEach((item) => {
      const underline = document.createElement("span")
      underline.classList.add("nav-underline")
      item.appendChild(underline)

      const hoverTl = gsap.timeline({ paused: true })

      hoverTl
        .to(underline, {
          width: "100%",
          duration: 0.3,
          ease: "power1.out",
        })
        .to(
          item,
          {
            color: "#D4AF37",
            duration: 0.2,
            ease: "power1.inOut",
          },
          0,
        )

      item.addEventListener("mouseenter", () => hoverTl.play())
      item.addEventListener("mouseleave", () => hoverTl.reverse())
    })

    // Cart icon animation
    const cartBadge = document.querySelector(".cart-badge")
    if (cartBadge) {
      gsap.from(cartBadge, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 1,
        ease: "elastic.out(1, 0.5)",
      })
    }
  }, [])

  // Toggle mobile menu
  useEffect(() => {
    if (menuTimelineRef.current) {
      if (isMenuOpen) {
        menuTimelineRef.current.play()
      } else {
        menuTimelineRef.current.reverse()
      }
    }
  }, [isMenuOpen])

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "py-2 bg-white/90 backdrop-blur-md shadow-md" : "py-4",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              className="mr-4 md:hidden z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-6">
                <span
                  className={cn(
                    "absolute left-0 w-full h-0.5 bg-current transition-all duration-300",
                    isMenuOpen ? "top-3 rotate-45" : "top-1",
                  )}
                ></span>
                <span
                  className={cn(
                    "absolute left-0 top-3 w-full h-0.5 bg-current transition-all duration-300",
                    isMenuOpen ? "opacity-0" : "opacity-100",
                  )}
                ></span>
                <span
                  className={cn(
                    "absolute left-0 w-full h-0.5 bg-current transition-all duration-300",
                    isMenuOpen ? "top-3 -rotate-45" : "top-5",
                  )}
                ></span>
              </div>
            </button>
            <a href="#" className="logo text-2xl md:text-3xl font-bold relative">
              ZICA BELLA
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary"></span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav hidden md:block">
            <ul className="flex items-center gap-8">
              <li className="nav-item relative">
                <a href="#" className="py-2 hover:text-primary transition-colors relative">
                  Home
                </a>
              </li>
              <li className="nav-item relative">
                <a href="#" className="py-2 hover:text-primary transition-colors relative">
                  Shop
                </a>
              </li>
              <li className="nav-item relative">
                <a href="#" className="py-2 hover:text-primary transition-colors relative">
                  Collections
                </a>
              </li>
              <li className="nav-item relative">
                <a href="#" className="py-2 hover:text-primary transition-colors relative">
                  About
                </a>
              </li>
              <li className="nav-item relative">
                <a href="#" className="py-2 hover:text-primary transition-colors relative">
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "mobile-menu fixed inset-0 bg-white z-40 flex items-center justify-center",
              "clip-path-circle-0",
            )}
          >
            <nav>
              <ul className="flex flex-col items-center gap-6 text-xl">
                <li className="nav-item">
                  <a href="#" className="block py-2 hover:text-primary transition-colors">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="block py-2 hover:text-primary transition-colors">
                    Shop
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="block py-2 hover:text-primary transition-colors">
                    Collections
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="block py-2 hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="block py-2 hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="icon-item hover:text-primary transition-colors">
              <Search size={20} />
            </button>
            <button className="icon-item hover:text-primary transition-colors">
              <User size={20} />
            </button>
            <button className="icon-item hover:text-primary transition-colors relative">
              <ShoppingBag size={20} />
              <span className="cart-badge absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
