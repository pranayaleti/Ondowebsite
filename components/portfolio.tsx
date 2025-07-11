"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from "lucide-react"
import ClientOnly from "./client-only"

const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    category: "E-commerce",
    image: "/blue-ecommerce-website.png",
    description: "A fully responsive e-commerce platform with secure payment integration and inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
  },
  {
    id: 2,
    title: "Healthcare Portal",
    category: "Web Application",
    image: "/healthcare-portal-dashboard-blue.png",
    description: "A secure patient management system with appointment scheduling and medical record tracking.",
    technologies: ["Vue.js", "Express", "PostgreSQL", "AWS"],
    link: "#",
  },
  {
    id: 3,
    title: "Educational Platform",
    category: "Web Application",
    image: "/educational-platform-blue.png",
    description: "An interactive learning platform with course management, quizzes, and progress tracking.",
    technologies: ["React", "Firebase", "Redux", "Material UI"],
    link: "#",
  },
  {
    id: 4,
    title: "Real Estate Website",
    category: "Website",
    image: "/real-estate-blue-theme.png",
    description: "A property listing website with advanced search filters and virtual tour integration.",
    technologies: ["Next.js", "Tailwind CSS", "Supabase", "Google Maps API"],
    link: "#",
  },
  {
    id: 5,
    title: "Restaurant Ordering System",
    category: "E-commerce",
    image: "/blue-restaurant-ordering-system.png",
    description: "An online ordering system for restaurants with menu management and delivery tracking.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "#",
  },
  {
    id: 6,
    title: "Fitness Tracking App",
    category: "Web Application",
    image: "/blue-fitness-app.png",
    description: "A fitness tracking application with workout plans, progress monitoring, and social features.",
    technologies: ["React Native", "GraphQL", "Apollo", "Firebase"],
    link: "#",
  },
]

function ProjectCard({ project, onClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="cursor-pointer group"
      onClick={() => onClick(project)}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          width={800}
          height={600}
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
          <div className="p-6 w-full">
            <h3 className="text-xl font-medium text-white mb-1">{project.title}</h3>
            <p className="text-sm text-gray-300">{project.category}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={800}
            height={600}
            className="w-full h-80 object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">{project.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{project.category}</p>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{project.description}</p>

          <div className="mb-8">
            <h4 className="text-lg font-medium text-black dark:text-white mb-4">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <Button className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full">
            View Project <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <ClientOnly>
      <section id="portfolio" className="py-24 bg-white dark:bg-black">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-black dark:text-white">Our Portfolio</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our recent projects and see how we've helped businesses transform their digital presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </AnimatePresence>
      </section>
    </ClientOnly>
  )
}
