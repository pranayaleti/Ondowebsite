"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Navbar from "./navbar"

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-20 pb-10 overflow-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">Build</span> Your Dream
              <br />
              Website With
              <br />
              <span className="gradient-text">Design Agency</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Want to grow your business quickly & boost up your sale with our professional expert team.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-6">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-full px-6 py-6 border-gray-300">
                See Live Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src="/hero-image.png"
                alt="Professional designer working on a laptop"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
