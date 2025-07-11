"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { CheckCircle } from "lucide-react"

const services = [
  {
    id: "web-design",
    title: "Web Design",
    description:
      "We create visually stunning, user-friendly websites that captivate your audience and reflect your brand identity.",
    image: "/images/services/web-design.png",
    features: [
      "Custom design tailored to your brand",
      "Responsive layouts for all devices",
      "Intuitive user interface and navigation",
      "Accessibility compliance",
      "Visual hierarchy optimization",
      "Brand consistency across all pages",
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "Our development team builds robust, scalable websites and web applications using the latest technologies and best practices.",
    image: "/images/services/web-development.png",
    features: [
      "Custom website development",
      "Content management systems (CMS)",
      "E-commerce solutions",
      "Progressive Web Apps (PWAs)",
      "API development and integration",
      "Performance optimization",
    ],
  },
  {
    id: "e-commerce",
    title: "E-commerce Solutions",
    description:
      "Transform your business with our comprehensive e-commerce solutions designed to drive sales and enhance customer experience.",
    image: "/images/services/e-commerce.png",
    features: [
      "Custom online store development",
      "Secure payment gateway integration",
      "Inventory management systems",
      "Order processing automation",
      "Customer account management",
      "Mobile-optimized shopping experience",
    ],
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "We create intuitive, engaging user experiences that keep visitors on your site longer and improve conversion rates.",
    image: "/images/services/ui-ux-design.png",
    features: [
      "User research and persona development",
      "Information architecture",
      "Wireframing and prototyping",
      "Usability testing",
      "Interaction design",
      "User journey mapping",
    ],
  },
  {
    id: "seo",
    title: "SEO Optimization",
    description:
      "Improve your search engine rankings and drive organic traffic to your website with our comprehensive SEO services.",
    image: "/images/services/seo.png",
    features: [
      "Keyword research and strategy",
      "On-page SEO optimization",
      "Technical SEO audits",
      "Content strategy development",
      "Local SEO for businesses",
      "Performance monitoring and reporting",
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Reach your target audience and grow your business with our strategic digital marketing services.",
    image: "/images/services/digital-marketing.png",
    features: [
      "Social media marketing",
      "Email marketing campaigns",
      "Content marketing",
      "Pay-per-click (PPC) advertising",
      "Conversion rate optimization",
      "Analytics and performance tracking",
    ],
  },
]

export default function ServicesList() {
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
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="space-y-24"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className={`grid gap-8 lg:grid-cols-2 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
            >
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <h2 className="text-3xl font-bold tracking-tight mb-4">{service.title}</h2>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? "lg:col-start-1" : ""}>
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                  <Image src={service.image || "/placeholder.svg"} alt={service.title} fill className="object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
