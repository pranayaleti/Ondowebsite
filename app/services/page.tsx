import type { Metadata } from "next"
import PageHeader from "@/components/page-header"
import ServicesList from "@/components/services/services-list"
import ServiceProcess from "@/components/services/service-process"
import ServiceFaq from "@/components/services/service-faq"
import Cta from "@/components/home/cta"

export const metadata: Metadata = {
  title: "Services | OnDo Studio",
  description:
    "Explore our comprehensive web development, design, and digital marketing services tailored to help your business grow online.",
}

export default function ServicesPage() {
  return (
    <main>
      <PageHeader title="Our Services" description="Comprehensive web solutions tailored to your business needs" />
      <ServicesList />
      <ServiceProcess />
      <ServiceFaq />
      <Cta />
    </main>
  )
}
