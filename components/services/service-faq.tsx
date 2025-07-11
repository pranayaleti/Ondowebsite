"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What types of businesses do you work with?",
    answer:
      "We work with businesses of all sizes across various industries, from startups to established enterprises. Our clients include e-commerce businesses, healthcare providers, educational institutions, professional services, and more. We tailor our approach to meet the specific needs and goals of each client.",
  },
  {
    question: "How long does it take to complete a website project?",
    answer:
      "The timeline for a website project depends on its complexity, scope, and your specific requirements. A simple website might take 4-6 weeks, while more complex projects with custom functionality could take 8-12 weeks or more. During our initial consultation, we'll provide a more accurate timeline based on your project specifications.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "We offer customized pricing based on the specific requirements of each project. Factors that influence pricing include the complexity of design, number of pages, custom functionality, and ongoing maintenance needs. We provide detailed proposals with transparent pricing after understanding your project needs during the initial consultation.",
  },
  {
    question: "Do you offer website maintenance services?",
    answer:
      "Yes, we offer comprehensive website maintenance services to ensure your site remains secure, up-to-date, and performing optimally. Our maintenance packages include regular updates, security monitoring, performance optimization, content updates, and technical support. We can tailor a maintenance plan to suit your specific needs and budget.",
  },
  {
    question: "Can you help with content creation for my website?",
    answer:
      "We offer professional content creation services including copywriting, photography, video production, and graphic design. Our content team works closely with you to develop compelling, SEO-friendly content that effectively communicates your brand message and engages your target audience.",
  },
  {
    question: "How do you ensure websites are secure?",
    answer:
      "Security is a top priority in all our web projects. We implement multiple layers of security measures including SSL certificates, secure hosting environments, regular security updates, malware scanning, firewall protection, and secure authentication systems. We also provide guidance on best practices for maintaining website security over time.",
  },
]

export default function ServiceFaq() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-24">
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our services and process
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
          className="max-w-3xl mx-auto divide-y"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              className="py-6"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <ChevronDown
                  className={`h-5 w-5 text-primary transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                className={`mt-2 text-muted-foreground ${openIndex === index ? "block" : "hidden"}`}
              >
                <p>{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
