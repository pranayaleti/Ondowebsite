"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

const milestones = [
  {
    year: "2015",
    title: "Company Founded",
    description:
      "OnDo Studio was founded with a mission to help businesses succeed online through exceptional web design and development.",
  },
  {
    year: "2016",
    title: "First Major Client",
    description:
      "Secured our first major client and delivered a successful e-commerce platform that exceeded expectations.",
  },
  {
    year: "2017",
    title: "Team Expansion",
    description:
      "Expanded our team to include specialists in UI/UX design, backend development, and digital marketing.",
  },
  {
    year: "2018",
    title: "Office Relocation",
    description: "Moved to a larger office space to accommodate our growing team and client base.",
  },
  {
    year: "2019",
    title: "Service Expansion",
    description: "Added new service offerings including SEO, content marketing, and mobile app development.",
  },
  {
    year: "2020",
    title: "Remote Work Transition",
    description:
      "Successfully transitioned to a remote-first work model while maintaining high productivity and client satisfaction.",
  },
  {
    year: "2021",
    title: "100th Project Milestone",
    description: "Celebrated the completion of our 100th successful project and continued growth in client base.",
  },
  {
    year: "2022",
    title: "Industry Recognition",
    description: "Received multiple industry awards for our innovative web solutions and client success stories.",
  },
  {
    year: "2023",
    title: "International Expansion",
    description: "Expanded our client base to include international businesses and opened our first overseas office.",
  },
]

export default function HistorySection() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section className="py-16 md:py-24 overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Journey</h2>
          <p className="text-xl text-muted-foreground">
            From humble beginnings to industry leadership - the story of OnDo Studio
          </p>
        </motion.div>

        {/* Mobile Timeline (vertical) */}
        <div className="md:hidden relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20"></div>

          <motion.div
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
            className="relative z-10"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="flex items-start mb-8 pl-12 relative"
              >
                {/* Year bubble */}
                <div className="absolute left-0 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">
                    {milestone.year}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-card rounded-lg p-4 shadow-sm border w-full">
                  <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground text-sm">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Timeline (horizontal alternating) */}
        <div className="hidden md:block relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20"></div>

          <motion.div
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
            className="relative z-10"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                  <div className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-md">
                    {milestone.year}
                  </div>
                </div>

                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
