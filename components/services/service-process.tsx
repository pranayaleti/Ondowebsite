"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Lightbulb, PenTool, CodeIcon, CheckCircle, MessageSquare, BarChart } from "lucide-react"

const processSteps = [
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Discovery",
    description:
      "We start by understanding your business goals, target audience, and project requirements to create a strategic plan.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Strategy",
    description:
      "Based on our findings, we develop a comprehensive strategy tailored to your specific needs and objectives.",
  },
  {
    icon: <PenTool className="h-8 w-8 text-primary" />,
    title: "Design",
    description:
      "Our designers create intuitive, visually appealing mockups that align with your brand identity and user expectations.",
  },
  {
    icon: <CodeIcon className="h-8 w-8 text-primary" />,
    title: "Development",
    description:
      "Our developers bring the designs to life using modern technologies and best practices for optimal performance.",
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Testing",
    description:
      "We thoroughly test all aspects of your project to ensure functionality, usability, and compatibility across devices.",
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: "Launch & Support",
    description:
      "After your approval, we launch your project and provide ongoing support to ensure its continued success.",
  },
]

export default function ServiceProcess() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Process</h2>
          <p className="text-xl text-muted-foreground">
            A streamlined approach to delivering exceptional results for every project
          </p>
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
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="relative bg-card rounded-lg p-6 shadow-sm border"
            >
              <div className="absolute -top-4 -left-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              </div>
              <div className="mb-4 mt-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
