"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Globe, Smartphone, Search, Youtube, BarChart, CreditCard } from "lucide-react"

const services = [
  {
    icon: <Globe className="h-10 w-10 text-white" />,
    title: "Web Design",
    description:
      "Encompass the use of several systems processes to help clients to establish a strong, and site that will help them to achieve their goals.",
  },
  {
    icon: <Smartphone className="h-10 w-10 text-white" />,
    title: "App Development",
    description:
      "Encompass the use of several systems processes to help clients to establish a strong, and site that will help them to achieve their goals.",
  },
  {
    icon: <Search className="h-10 w-10 text-white" />,
    title: "SEO Optimization",
    description:
      "Encompass the use of several systems processes to help clients to establish a strong, and site that will help them to achieve their goals.",
  },
  {
    icon: <Youtube className="h-10 w-10 text-white" />,
    title: "Youtube Marketing",
    description:
      "Encompass the use of several systems processes to help clients to establish a strong, and site that will help them to achieve their goals.",
  },
  {
    icon: <BarChart className="h-10 w-10 text-white" />,
    title: "Data Analysis",
    description:
      "Encompass the use of several systems processes to help clients to establish a strong, and site that will help them to achieve their goals.",
  },
  {
    icon: <CreditCard className="h-10 w-10 text-white" />,
    title: "Payment Integration",
    description:
      "Encompass the use of several systems processes to help clients to establish a strong, and site that will help them to achieve their goals.",
  },
]

export default function DesignServices() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 md:py-24 bg-[#1e2761] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Top Design <span className="text-secondary">Services</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-[#2a3680] p-6 rounded-xl hover:bg-[#323e96] transition-colors duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-300 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
