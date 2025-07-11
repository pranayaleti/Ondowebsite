"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Lightbulb, BarChart2, Compass, TrendingUp } from "lucide-react"

const services = [
  {
    icon: <Lightbulb className="h-8 w-8 text-white" />,
    title: "Ideate",
    subtitle: "Brand Strategy",
    description: "We will make new strategy which will work the best.",
    bgColor: "bg-amber-500",
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-white" />,
    title: "Plan",
    subtitle: "Proper Approach",
    description: "We will make new strategy which will work the best.",
    bgColor: "bg-purple-500",
  },
  {
    icon: <Compass className="h-8 w-8 text-white" />,
    title: "Explore",
    subtitle: "Faster & Far",
    description: "We will make new strategy which will work the best.",
    bgColor: "bg-blue-500",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-white" />,
    title: "Grow",
    subtitle: "To The Peak",
    description: "We will make new strategy which will work the best.",
    bgColor: "bg-pink-500",
  },
]

export default function Services() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="service-card"
            >
              <div className={`service-card-icon ${service.bgColor}`}>{service.icon}</div>
              <h3 className="text-xl font-bold mb-1">{service.title}</h3>
              <h4 className="text-lg font-semibold mb-3">{service.subtitle}</h4>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
