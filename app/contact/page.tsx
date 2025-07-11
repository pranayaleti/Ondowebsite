import type { Metadata } from "next"
import PageHeader from "@/components/page-header"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactMap from "@/components/contact/contact-map"

export const metadata: Metadata = {
  title: "Contact Us | OnDo Studio",
  description:
    "Get in touch with OnDo Studio for your web development, design, and digital marketing needs. We're here to help your business grow online.",
}

export default function ContactPage() {
  return (
    <main>
      <PageHeader title="Contact Us" description="Get in touch with our team to discuss your project" />
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
      <ContactMap />
    </main>
  )
}
