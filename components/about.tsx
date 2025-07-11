"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function About() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
            }}
          >
            <span className="text-primary font-semibold uppercase tracking-wider">ABOUT US</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Grow Your Business
              <br />
              With Our Agency
            </h2>
            <p className="text-gray-600 mb-6">
              Team has over 100 architects and dedicated employees working for more than 50 partners.We stand for all
              inclusive digital experience with a focus long term vision.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
              More Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
            }}
            className="relative"
          >
            <div className="relative h-[400px]">
              <Image src="/about-image.png" alt="Business growth chart" fill className="object-contain" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
