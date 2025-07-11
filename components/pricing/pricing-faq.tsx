"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Do your pricing plans include hosting fees?",
    answer:
      "Yes, all our pricing plans include the first year of hosting on our secure, high-performance servers. After the first year, hosting can be renewed at our standard rates, or we can help you transition to another hosting provider if you prefer.",
  },
  {
    question: "Can I upgrade my plan later if my business needs change?",
    answer:
      "We understand that businesses evolve, and you can upgrade your plan at any time. We'll simply charge the difference between your current plan and the upgraded plan. Contact our support team when you're ready to upgrade, and we'll guide you through the process.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes, we offer flexible payment options for all our plans. Typically, we require a 50% deposit to begin work, with the remaining balance due upon project completion. For larger projects, we can arrange milestone-based payments. Please contact us to discuss the payment schedule that works best for your business.",
  },
  {
    question: "What's included in the maintenance and support period?",
    answer:
      "Our maintenance and support includes regular software updates, security patches, bug fixes, and technical support via email and phone during business hours. It does not include adding new features or pages, which would be billed separately. Extended maintenance plans are available for purchase after the included support period ends.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "We're confident in the quality of our work and want you to be completely satisfied. If you're not happy with the direction of your project within the first 14 days after our initial design presentation, we'll refund your deposit minus a small fee for work completed. Please note that once development begins, refunds are provided on a pro-rated basis for work not yet completed.",
  },
  {
    question: "Do I need to provide my own content?",
    answer:
      "While you can provide your own content, we also offer professional copywriting and content creation services for an additional fee. Many clients choose to provide rough content that our copywriters then refine, or you can have our team create content from scratch based on your input and industry research.",
  },
]

export default function PricingFaq() {
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
          <p className="text-xl text-muted-foreground">Find answers to common questions about our pricing and plans</p>
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
