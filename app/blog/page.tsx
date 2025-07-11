// This file is temporarily commented out
/*
import type { Metadata } from "next"
import PageHeader from "@/components/page-header"
import BlogGrid from "@/components/blog/blog-grid"
import BlogCategories from "@/components/blog/blog-categories"
import BlogSearch from "@/components/blog/blog-search"
import Cta from "@/components/home/cta"

export const metadata: Metadata = {
  title: "Blog | OnDo Studio",
  description:
    "Stay updated with the latest web design trends, development tips, and digital marketing strategies on the OnDo Studio blog.",
}

export default function BlogPage() {
  return (
    <main>
      <PageHeader
        title="Our Blog"
        description="Insights, tips, and trends in web design, development, and digital marketing"
      />
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3">
              <BlogGrid />
            </div>
            <div className="space-y-8">
              <BlogSearch />
              <BlogCategories />
            </div>
          </div>
        </div>
      </section>
      <Cta />
    </main>
  )
}
*/

export default function BlogPage() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
      <p className="mb-8">Our blog is currently under development. Please check back later.</p>
    </div>
  )
}
