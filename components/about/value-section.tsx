"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Heart, Zap, Shield, Users, Target, Award } from "lucide-react"

const values = [
  {
    icon: <Heart className="h-8 w-8 text-primary" />,
    title: "Passion",
    description: "We're passionate about creating exceptional web experiences that help our clients succeed online.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Innovation",
    description: "We stay at the forefront of web technologies to deliver cutting-edge solutions for our clients.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Integrity",
    description: "We operate with honesty, transparency, and ethical practices in all our client relationships.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Collaboration",
    description: "We work closely with our clients, treating their goals as our own to achieve shared success.",
  },
  {
    icon: <Target className="h-8 w-8 text-primary" />,
    title: "Excellence",
    description: "We strive for excellence in every project, paying meticulous attention to detail and quality.",
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Results-Driven",
    description: "We focus on delivering measurable results that drive business growth for our clients.",
  },
]

export default function ValueSection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Core Values</h2>
          <p className="text-xl text-muted-foreground">
            These principles guide our work and define our company culture
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
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="bg-card rounded-lg p-6 shadow-sm border"
            >
              <div className="bg-primary/10 p-3 inline-flex rounded-lg mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
