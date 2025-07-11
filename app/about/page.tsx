import type { Metadata } from "next"
import Image from "next/image"
import { CheckCircle2 } from "lucide-react"
import PageHeader from "@/components/page-header"
import TeamSection from "@/components/about/team-section"
import ValueSection from "@/components/about/value-section"
import HistorySection from "@/components/about/history-section"
import Cta from "@/components/home/cta"

export const metadata: Metadata = {
  title: "About Us | OnDo Studio",
  description:
    "Learn about OnDo Studio's journey, our team of experts, and our mission to deliver exceptional web solutions that drive business growth.",
}

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        title="About OnDo Studio"
        description="We're a team of passionate designers, developers, and digital strategists dedicated to creating exceptional web experiences."
      />

      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-6">
                Founded in 2015, OnDo Studio began with a simple mission: to help businesses succeed online through
                exceptional web design and development. What started as a small team of three passionate web enthusiasts
                has grown into a full-service digital agency with a proven track record of delivering results.
              </p>
              <p className="text-muted-foreground mb-6">
                Over the years, we've had the privilege of working with clients across various industries, from startups
                to established enterprises. Each project has contributed to our growth and expertise, allowing us to
                refine our processes and expand our service offerings.
              </p>
              <ul className="space-y-2">
                {[
                  "8+ years of industry experience",
                  "200+ successful projects delivered",
                  "95% client satisfaction rate",
                  "Award-winning designs and implementations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
              <Image
                src="/images/about/team-meeting.png"
                alt="OnDo Studio team meeting"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <ValueSection />
      <HistorySection />
      <TeamSection />
      <Cta />
    </main>
  )
}
