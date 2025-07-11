"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Check, X } from "lucide-react"

const features = [
  {
    name: "Responsive Design",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Number of Pages",
    basic: "Up to 5",
    professional: "Up to 10",
    enterprise: "Unlimited",
  },
  {
    name: "Content Management System",
    basic: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "E-commerce Functionality",
    basic: false,
    professional: true,
    enterprise: true,
  },
  {
    name: "Custom Domain",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "SSL Certificate",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "SEO Optimization",
    basic: "Basic",
    professional: "Standard",
    enterprise: "Advanced",
  },
  {
    name: "Contact Form",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Social Media Integration",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Google Analytics",
    basic: true,
    professional: true,
    enterprise: true,
  },
  {
    name: "Custom Animations",
    basic: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Mobile App Integration",
    basic: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Multilingual Support",
    basic: false,
    professional: false,
    enterprise: true,
  },
  {
    name: "Maintenance & Support",
    basic: "30 days",
    professional: "90 days",
    enterprise: "1 year",
  },
]

export default function PricingComparison() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Plan Comparison</h2>
          <p className="text-xl text-muted-foreground">Compare our plans to find the perfect fit for your business</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
          }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 bg-card">Features</th>
                <th className="p-4 bg-card text-center">Basic</th>
                <th className="p-4 bg-primary/10 text-center">Professional</th>
                <th className="p-4 bg-card text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 text-center">
                    {typeof feature.basic === "boolean" ? (
                      feature.basic ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )
                    ) : (
                      <span>{feature.basic}</span>
                    )}
                  </td>
                  <td className="p-4 text-center bg-primary/10">
                    {typeof feature.professional === "boolean" ? (
                      feature.professional ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )
                    ) : (
                      <span>{feature.professional}</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {typeof feature.enterprise === "boolean" ? (
                      feature.enterprise ? (
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground mx-auto" />
                      )
                    ) : (
                      <span>{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
