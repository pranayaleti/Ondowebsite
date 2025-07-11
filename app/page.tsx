import type { Metadata } from "next"
import Hero from "@/components/home/hero"
import Services from "@/components/home/services"
import FeaturedProjects from "@/components/home/featured-projects"
import Process from "@/components/home/process"
import Cta from "@/components/home/cta"
import ScrollingTestimonials from "@/components/home/scrolling-testimonials"
import { WebPageStructuredData, ServiceStructuredData } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  title: "OnDo | Professional Web Design Agency",
  description:
    "OnDo is a full-service web design agency specializing in creating stunning, high-performance websites and digital solutions for businesses of all sizes.",
  keywords: ["web design", "web development", "digital agency", "UI/UX design", "responsive websites"],
  alternates: {
    canonical: "https://OnDo.com",
  },
}

export default function Home() {
  return (
    <>
      {/* Structured data for SEO */}
      <WebPageStructuredData
        title="OnDo | Professional Web Design Agency"
        description="OnDo is a full-service web design agency specializing in creating stunning, high-performance websites and digital solutions for businesses of all sizes."
        url="https://OnDo.com"
        datePublished="2023-01-01"
        dateModified="2023-05-15"
        imageUrl="https://OnDo.com/og-image.png"
      />
      <ServiceStructuredData
        name="Web Design and Development Services"
        description="Professional web design and development services including responsive websites, e-commerce solutions, and UI/UX design."
        url="https://OnDo.com/services"
        imageUrl="https://OnDo.com/services-image.png"
      />

      <main>
        <Hero />
        <ScrollingTestimonials />
        <Services />
        <Process />
        <FeaturedProjects />
        <Cta />
      </main>
    </>
  )
}
