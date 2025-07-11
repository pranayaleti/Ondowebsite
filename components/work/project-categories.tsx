"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { projects } from "@/data/projects"

export default function ProjectCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  // Extract unique categories from projects
  const categories = ["all", ...new Set(projects.map((project) => project.category.toLowerCase()))]

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category, index) => (
        <Button
          key={index}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => setActiveCategory(category)}
          className="capitalize"
        >
          {category === "all" ? "All Projects" : category}
        </Button>
      ))}
    </div>
  )
}
