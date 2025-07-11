"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useA11y } from "@/components/a11y/a11y-provider"

export default function Cta() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { isReducedMotion } = useA11y()

  // Optimized animations based on reduced motion preference
  const animations = isReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.1 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }

  return (
    <section className="py-24 relative overflow-hidden" aria-labelledby="cta-heading">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>

      <div
        className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"
        aria-hidden="true"
        style={{ willChange: "transform, opacity" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"
        aria-hidden="true"
        style={{ willChange: "transform, opacity" }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          initial={animations.initial}
          animate={isInView ? animations.animate : animations.initial}
          transition={animations.transition}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let's work together to create a stunning, high-performance website that helps your business grow online.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 py-6 bg-white text-primary hover:bg-white/90 hover-glow"
            >
              <Link href="/contact" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 border-white text-white hover:bg-white/10"
            >
              <Link href="/work">View Our Work</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
