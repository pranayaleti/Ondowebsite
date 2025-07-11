"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative py:32 lg:py-20 overflow-hidden bg-white">
      {/* Abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[5%] w-64 h-64 rounded-full bg-gray-100 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-[10%] w-72 h-72 rounded-full bg-gray-100 blur-3xl"></div>
        <motion.div
          className="absolute top-[3.5rem] right-[195px] w-24 h-24 rounded-full border border-yellow-400 bg-yellow-100/20"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        ></motion.div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="col-span-1 lg:col-span-12 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight mb-6 leading-tight">
              Elevate Your <span className="text-black">Digital Presence</span> With Expert Solutions
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
              We craft high-performance, visually stunning websites and applications that drive business growth and
              deliver exceptional user experiences.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start justify-center">
                <CheckCircle className="h-5 w-5 text-black mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-700">Custom web development tailored to your business needs</p>
              </div>
              <div className="flex items-start justify-center">
                <CheckCircle className="h-5 w-5 text-black mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-700">Responsive designs that work perfectly on all devices</p>
              </div>
              <div className="flex items-start justify-center">
                <CheckCircle className="h-5 w-5 text-black mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-700">SEO optimization to improve your online visibility</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-md px-8 py-6 bg-black hover:bg-black/90 text-white group shadow-lg shadow-black/20 hover:shadow-black/30 transition-all"
              >
                <Link href="/contact" className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-md px-8 py-6 border-gray-300 hover:bg-gray-50 group transition-all"
              >
                <Link href="/work" className="flex items-center">
                  View Portfolio
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Trusted by section */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
        </motion.div>
      </div>
    </section>
  )
}
