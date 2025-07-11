"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"

const clients = [
  { name: "Company 1", logo: "/images/clients/client-1.svg" },
  { name: "Company 2", logo: "/images/clients/client-2.svg" },
  { name: "Company 3", logo: "/images/clients/client-3.svg" },
  { name: "Company 4", logo: "/images/clients/client-4.svg" },
  { name: "Company 5", logo: "/images/clients/client-5.svg" },
  { name: "Company 6", logo: "/images/clients/client-6.svg" },
  { name: "Company 7", logo: "/images/clients/client-7.svg" },
  { name: "Company 8", logo: "/images/clients/client-8.png" },
]

export default function Clients() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-blue-50/50 dark:from-black/50 dark:to-gray-900/50"></div>
      <div className="absolute inset-0 bg-grid opacity-25"></div>

      <div className="container px-4 md:px-6 relative">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Trusted by Leading Companies</h2>
        </motion.div>

        <div className="glass-card rounded-xl p-8 border border-white/20 shadow-lg">
          <div className="marquee-container">
            <div className="marquee-content">
              {clients.map((client, index) => (
                <div key={index} className="inline-block mx-8">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
            <div className="marquee-content marquee-content-2">
              {clients.map((client, index) => (
                <div key={`duplicate-${index}`} className="inline-block mx-8">
                  <Image
                    src={client.logo || "/placeholder.svg"}
                    alt={client.name}
                    width={120}
                    height={60}
                    className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
