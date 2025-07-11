"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function CTA() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="cta-section p-10 md:p-16"
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want To Get Started?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris, nisi ut.
            </p>
            <Button className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-6">Get Started</Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
