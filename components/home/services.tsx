"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Code, ShoppingCart, Palette, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: <Code className="h-6 w-6 text-white" />,
    title: "Web Development",
    description: "Custom websites built with modern technologies for optimal performance and scalability.",
    href: "/services#web-development",
    color: "bg-gradient-to-br from-black to-gray-800",
  },
  {
    icon: <ShoppingCart className="h-6 w-6 text-white" />,
    title: "E-commerce Solutions",
    description: "Secure, user-friendly online stores that drive sales and enhance customer experience.",
    href: "/services#e-commerce",
    color: "bg-gradient-to-br from-black to-gray-800",
  },
  {
    icon: <Palette className="h-6 w-6 text-white" />,
    title: "UI/UX Design",
    description: "Intuitive, visually appealing designs that enhance user engagement and satisfaction.",
    href: "/services#ui-ux-design",
    color: "bg-gradient-to-br from-black to-gray-800",
  },
  {
    icon: <BarChart className="h-6 w-6 text-white" />,
    title: "Digital Marketing",
    description: "Strategic marketing solutions to increase your online visibility and drive targeted traffic.",
    href: "/services#digital-marketing",
    color: "bg-gradient-to-br from-black to-gray-800",
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2, triggerOnce: true })

  return (
    <section className="py-24 bg-gray-50" id="services" aria-labelledby="services-heading">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 id="services-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-800">Comprehensive web solutions tailored to your business needs</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover-lift group"
              style={{ willChange: "transform, box-shadow" }}
            >
              <div className={`mb-6 p-4 rounded-lg w-fit ${service.color}`} aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-black transition-colors">{service.title}</h3>
              <p className="text-gray-700 mb-4">{service.description}</p>
              <Link
                href={service.href}
                className="inline-flex items-center text-black font-medium hover:underline group"
                aria-label={`Learn more about ${service.title}`}
              >
                Learn more
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="rounded-full px-8 py-6 bg-black hover:bg-black/90 hover-glow">
            <Link href="/services">View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
