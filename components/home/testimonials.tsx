"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { useA11y } from "@/components/a11y/a11y-provider"

const testimonials = [
  {
    content:
      "Digi.com transformed our online presence completely. Their team delivered a stunning website that perfectly captures our brand identity and has significantly improved our conversion rates.",
    author: "Sarah Johnson",
    position: "Marketing Director, TechCorp",
    avatar: "/diverse-group.png",
  },
  {
    content:
      "Working with Digi.com was a game-changer for our e-commerce business. Their attention to detail and technical expertise resulted in a seamless shopping experience that our customers love.",
    author: "Michael Chen",
    position: "CEO, StyleShop",
    avatar: "/diverse-group.png",
  },
  {
    content:
      "The team at Digi.com went above and beyond our expectations. They not only delivered a beautiful website but also provided valuable insights that helped improve our overall digital strategy.",
    author: "Emily Rodriguez",
    position: "Operations Manager, HealthPlus",
    avatar: "/diverse-group.png",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { isReducedMotion } = useA11y()

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Handle autoplay
  useEffect(() => {
    if (autoplay && !isReducedMotion) {
      autoplayRef.current = setInterval(() => {
        nextTestimonial()
      }, 6000)
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [autoplay, isReducedMotion])

  // Pause autoplay on hover/focus
  const pauseAutoplay = () => setAutoplay(false)
  const resumeAutoplay = () => setAutoplay(true)

  return (
    <section className="py-24 bg-gray-50" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-700">
            Don't just take our word for it - hear from some of our satisfied clients
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-4xl mx-auto"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          onFocus={pauseAutoplay}
          onBlur={resumeAutoplay}
        >
          <div
            className="bg-white rounded-2xl p-8 md:p-12 shadow-xl relative"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
          >
            <Quote className="absolute top-8 left-8 h-16 w-16 text-gray-100" aria-hidden="true" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: isReducedMotion ? 0 : 0.3 }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${currentIndex + 1} of ${testimonials.length}`}
                >
                  <p className="text-xl md:text-2xl italic mb-8 text-gray-700 leading-relaxed">
                    {testimonials[currentIndex].content}
                  </p>

                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-primary">
                      <Image
                        src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{testimonials[currentIndex].author}</h3>
                      <p className="text-gray-600">{testimonials[currentIndex].position}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-2" role="tablist">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    index === currentIndex ? "bg-primary" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-selected={index === currentIndex}
                  role="tab"
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
