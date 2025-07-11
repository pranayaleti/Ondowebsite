"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useAnimation, useInView } from "framer-motion"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Basic",
    price: "$999",
    description: "Perfect for small businesses and personal websites",
    features: [
      { included: true, text: "Responsive website design" },
      { included: true, text: "Up to 5 pages" },
      { included: true, text: "Contact form" },
      { included: true, text: "Basic SEO setup" },
      { included: false, text: "Content management system" },
      { included: false, text: "E-commerce functionality" },
      { included: false, text: "Custom animations" },
      { included: false, text: "Advanced SEO optimization" },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$2,499",
    description: "Ideal for growing businesses and online stores",
    features: [
      { included: true, text: "Responsive website design" },
      { included: true, text: "Up to 10 pages" },
      { included: true, text: "Contact form" },
      { included: true, text: "Basic SEO setup" },
      { included: true, text: "Content management system" },
      { included: true, text: "E-commerce functionality" },
      { included: false, text: "Custom animations" },
      { included: false, text: "Advanced SEO optimization" },
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$4,999",
    description: "Comprehensive solution for established businesses",
    features: [
      { included: true, text: "Responsive website design" },
      { included: true, text: "Unlimited pages" },
      { included: true, text: "Contact form" },
      { included: true, text: "Basic SEO setup" },
      { included: true, text: "Content management system" },
      { included: true, text: "E-commerce functionality" },
      { included: true, text: "Custom animations" },
      { included: true, text: "Advanced SEO optimization" },
    ],
    cta: "Get Started",
    popular: false,
  },
]

export default function PricingPlans() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-12">
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Transparent Pricing Plans</h2>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your business needs with no hidden fees
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
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className={`relative bg-card rounded-lg p-8 shadow-sm border ${
                plan.popular ? "border-primary" : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl md:text-4xl font-bold mb-2">{plan.price}</div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`w-full ${plan.popular ? "" : "bg-secondary hover:bg-secondary/90"}`}
                size="lg"
              >
                <Link href="/contact">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? Contact us for a personalized quote tailored to your specific requirements.
          </p>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
