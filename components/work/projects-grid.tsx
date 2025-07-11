"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/data/projects"

export default function ProjectsGrid() {
  const [filter, setFilter] = useState("all")
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Filter projects based on selected category
  const filteredProjects =
    filter === "all" ? projects : projects.filter((project) => project.category.toLowerCase() === filter.toLowerCase())

  return (
    <motion.div
      ref={ref}
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
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-8"
    >
      {filteredProjects.map((project) => (
        <motion.div
          key={project.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <Link href={`/work/${project.slug}`} className="block">
            <div className="relative h-60 overflow-hidden">
              <Image
                src={project.images[0] || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <Badge variant="secondary">{project.category}</Badge>
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech, i) => (
                  <Badge key={i} variant="outline">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && <Badge variant="outline">+{project.technologies.length - 3}</Badge>}
              </div>
              <div className="flex items-center text-primary font-medium">
                View Project <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
