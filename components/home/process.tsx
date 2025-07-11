"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Lightbulb, PenTool, Code, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <Lightbulb className="h-6 w-6 text-white" />,
    title: "Discovery",
    description:
      "We start by understanding your business goals, target audience, and project requirements to create a strategic plan.",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
  },
  {
    icon: <PenTool className="h-6 w-6 text-white" />,
    title: "Design",
    description:
      "Our designers create intuitive, visually appealing mockups that align with your brand identity and user expectations.",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
  },
  {
    icon: <Code className="h-6 w-6 text-white" />,
    title: "Development",
    description:
      "Our developers bring the designs to life using modern technologies and best practices for optimal performance.",
    color: "bg-gradient-to-br from-pink-500 to-pink-600",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-white" />,
    title: "Delivery",
    description:
      "After thorough testing and your approval, we launch your project and provide ongoing support to ensure its success.",
    color: "bg-gradient-to-br from-green-500 to-green-600",
  },
]

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Process</h2>
          <p className="text-lg text-gray-600">A streamlined approach to delivering exceptional results</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 z-10 relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-20 bg-primary">
                  {index + 1}
                </div>
                <div className={`mb-6 p-4 rounded-lg w-fit ${step.color}`}>{step.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gray-200 z-0 -translate-y-1/2 -ml-4">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
