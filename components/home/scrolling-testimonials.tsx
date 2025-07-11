"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const testimonials = [
  {
    content:
      "OnDo transformed our online presence completely. Their team delivered a stunning website that perfectly captures our brand identity and has significantly improved our conversion rates.",
    author: "Sarah Johnson",
    position: "Marketing Director, TechCorp",
    avatar: "/diverse-group.png",
    rating: 5,
  },
  {
    content:
      "Working with OnDo was a game-changer for our e-commerce business. Their attention to detail and technical expertise resulted in a seamless shopping experience that our customers love.",
    author: "Michael Chen",
    position: "CEO, StyleShop",
    avatar: "/diverse-group.png",
    rating: 5,
  },
  {
    content:
      "The team at OnDo went above and beyond our expectations. They not only delivered a beautiful website but also provided valuable insights that helped improve our overall digital strategy.",
    author: "Emily Rodriguez",
    position: "Operations Manager, HealthPlus",
    avatar: "/diverse-group.png",
    rating: 5,
  },
  {
    content:
      "Our website traffic increased by 150% within just three months of launching our new site designed by OnDo. Their SEO expertise and clean code made all the difference.",
    author: "David Wilson",
    position: "Digital Marketing Manager, GrowthTech",
    avatar: "/diverse-group.png",
    rating: 5,
  },
]

export default function ScrollingTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToTestimonial = (index: number) => {
    setActiveIndex(index)
  }

  // Handle autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(() => {
        nextTestimonial()
      }, 5000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, activeIndex])

  // Pause autoplay on hover/focus
  const pauseAutoplay = () => setAutoplay(false)
  const resumeAutoplay = () => setAutoplay(true)

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-black mx-auto"></div>
        </div>

        <div
          ref={containerRef}
          className="relative max-w-5xl mx-auto"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocus={pauseAutoplay}
          onBlur={resumeAutoplay}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-1"
              >
                <div className="bg-white rounded-xl p-8 md:p-10 shadow-lg border border-gray-100">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-gray-700 text-center mb-8 italic">
                    "{testimonials[activeIndex].content}"
                  </p>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black mb-4">
                      <Image
                        src={testimonials[activeIndex].avatar || "/placeholder.svg"}
                        alt={testimonials[activeIndex].author}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <h4 className="font-bold text-lg">{testimonials[activeIndex].author}</h4>
                    <p className="text-gray-600">{testimonials[activeIndex].position}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dots navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? "bg-black" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={activeIndex === index ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
