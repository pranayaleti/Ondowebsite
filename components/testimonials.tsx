"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    content: "Continually harness functional good competencies. Interactively pontificate prospective imperatives.",
    name: "Riyad Hasan",
    position: "Product Designer",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: 2,
    content: "Continually harness functional good competencies. Interactively pontificate prospective imperatives.",
    name: "Jannat Faria",
    position: "UI Designer",
    avatar: "/avatars/avatar-2.png",
  },
  {
    id: 3,
    content: "Their attention to detail and commitment to quality is unmatched. Highly recommended!",
    name: "Michael Chen",
    position: "CEO, TechStart",
    avatar: "/avatars/avatar-3.png",
  },
  {
    id: 4,
    content: "Working with this team transformed our online presence completely. Amazing results!",
    name: "Sarah Johnson",
    position: "Marketing Director",
    avatar: "/avatars/avatar-4.png",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(testimonials.length / 2))
  }

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2),
    )
  }

  const visibleTestimonials = testimonials.slice(currentIndex * 2, currentIndex * 2 + 2)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center mb-12"
        >
          <h3 className="text-secondary uppercase font-semibold tracking-wider mb-2">TESTIMONIAL</h3>
          <h2 className="text-3xl md:text-4xl font-bold">Our Client's Feedback</h2>
        </motion.div>

        <div className="relative">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="testimonial-card"
              >
                <Quote className="h-10 w-10 text-secondary mb-4" />
                <p className="text-gray-600 mb-6">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Next testimonials"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
