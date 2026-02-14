import { lazy, Suspense } from "react";
import SEOHead from "../components/SEOHead";
import Contact from "../components/Contact";

// Lazy load heavy components
const CalendlyEmbed = lazy(() => import("../components/CalendlyEmbed"));
const Footer = lazy(() => import("../components/Footer"));
import { companyInfo, getPostalAddressSchema, getContactPointSchema } from "../constants/companyInfo";

const ContactPage = () => {
  
  const canonical = `${companyInfo.urls.website}/contact`;
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": `${canonical}#contact-page`,
        "name": `Contact ${companyInfo.name}`,
        "url": canonical,
        "description": "Get in touch with Ondosoft for custom software, SaaS, and platform development support.",
        "mainEntity": {
          "@type": "Organization",
          "name": companyInfo.name,
          "contactPoint": { ...getContactPointSchema("customer service"), availableLanguage: "English" },
          "address": getPostalAddressSchema()
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": companyInfo.urls.website
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact",
            "item": canonical
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title={`Contact ${companyInfo.name} | Software Development & Platform Support`}
        description={`Contact ${companyInfo.name} for custom software, SaaS, and cloud development. Schedule a strategy call about your React, Node.js, Python, or platform project. Call ${companyInfo.phoneDisplay} or email us today.`}
        keywords="contact ondosoft, software development contact, SaaS development quote, platform engineering, React developers, Node.js developers, Python developers"
        canonicalUrl={canonical}
        structuredData={contactStructuredData}
      />
      <div>
        <div className="mx-auto pt-20">
          <div id="contact" className="scroll-mt-20">
            <Contact />
          </div>
        </div>
        <section id="book" className="mx-auto max-w-6xl px-4 mt-12">
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-lg shadow-orange-500/10">
            <div className="flex flex-col gap-3 mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                Book instantly
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                See live availability and lock a time without leaving this page.
              </h3>
              <p className="text-gray-300 max-w-3xl">
                We’ll meet for 30 minutes to map your goals, timeline, and budget. Choose any open
                slot below—your timezone is auto-detected by Calendly.
              </p>
            </div>
            <Suspense fallback={<div className="h-[720px] bg-neutral-800/60 rounded-xl animate-pulse" />}>
              <CalendlyEmbed
                utmParams={{
                  utm_source: "website",
                  utm_medium: "contact_page",
                  utm_campaign: "consultation",
                }}
                height={720}
                title="Schedule with Ondosoft"
                description="Pick a time that works for you—no redirects."
              />
            </Suspense>
          </div>
        </section>
        <Suspense fallback={<div className="h-32" />}>
          <Footer hideFeedbackCta />
        </Suspense>
      </div>
    </>
  );
};

export default ContactPage;
