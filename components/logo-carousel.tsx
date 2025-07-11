"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import Image from "next/image"

const logos = [
  { src: "/logos/adobe.png", alt: "Adobe" },
  { src: "/logos/nike.png", alt: "Nike" },
  { src: "/logos/fedex.png", alt: "FedEx" },
  { src: "/logos/bbc.png", alt: "BBC" },
  { src: "/logos/samsung.png", alt: "Samsung" },
  { src: "/logos/google.png", alt: "Google" },
]

export default function LogoCarousel() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className="py-12 md:py-16"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="logo-carousel">
          <div className="logo-carousel-track">
            {logos.map((logo, index) => (
              <div key={index} className="inline-block mx-8">
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
          <div className="logo-carousel-track" aria-hidden="true">
            {logos.map((logo, index) => (
              <div key={`duplicate-${index}`} className="inline-block mx-8">
                <Image
                  src={logo.src || "/placeholder.svg"}
                  alt={logo.alt}
                  width={120}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
