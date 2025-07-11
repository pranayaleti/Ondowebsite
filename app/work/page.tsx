import type { Metadata } from "next"
import PageHeader from "@/components/page-header"
import ProjectsGrid from "@/components/work/projects-grid"
import ProjectCategories from "@/components/work/project-categories"
import Cta from "@/components/home/cta"

export const metadata: Metadata = {
  title: "Our Work | OnDo Studio",
  description: "Explore our portfolio of successful web design and development projects across various industries.",
}

export default function WorkPage() {
  return (
    <main>
      <PageHeader
        title="Our Work"
        description="Explore our portfolio of successful projects across various industries"
      />
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <ProjectCategories />
          <ProjectsGrid />
        </div>
      </section>
      <Cta />
    </main>
  )
}
