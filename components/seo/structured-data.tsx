export interface WebPageStructuredData {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  imageUrl?: string
}

export function WebPageStructuredData({
  title,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
}: WebPageStructuredData) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(imageUrl && { image: imageUrl }),
    publisher: {
      "@type": "Organization",
      name: "Digi.com",
      logo: {
        "@type": "ImageObject",
        url: "https://digi.com/logo.png",
      },
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

export interface ServiceStructuredData {
  name: string
  description: string
  url: string
  imageUrl?: string
  provider?: string
}

export function ServiceStructuredData({
  name,
  description,
  url,
  imageUrl,
  provider = "Digi.com",
}: ServiceStructuredData) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: name,
    description: description,
    url: url,
    ...(imageUrl && { image: imageUrl }),
    provider: {
      "@type": "Organization",
      name: provider,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}

export interface FAQStructuredData {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQStructuredData({ questions }: FAQStructuredData) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
}
