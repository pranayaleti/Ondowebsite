import { companyInfo, getPostalAddressSchema, getContactPointSchema, getOpeningHoursSchema } from '../constants/companyInfo';

// Lightweight, accurate JSON-LD injected on every page
const SchemaMarkup = () => {
  const openingHours = getOpeningHoursSchema() || [];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${companyInfo.urls.website}/#organization`,
        "name": companyInfo.name,
        "url": companyInfo.urls.website,
        "logo": `${companyInfo.urls.website}/logo.png`,
        "description": "Ondosoft is a US-based product team building custom software, AI-enabled products, and scalable platforms.",
        "foundingDate": companyInfo.foundingDate,
        "contactPoint": [
          getContactPointSchema("customer service"),
          { ...getContactPointSchema("sales"), email: companyInfo.salesEmail }
        ],
        "address": getPostalAddressSchema(),
        "sameAs": [
          companyInfo.urls.linkedin,
          companyInfo.urls.github
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${companyInfo.urls.website}/#website`,
        "url": companyInfo.urls.website,
        "name": companyInfo.name,
        "description": "Full stack software development, AI products, and platform engineering for modern teams.",
        "publisher": {
          "@id": `${companyInfo.urls.website}/#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${companyInfo.urls.website}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Service",
        "@id": `${companyInfo.urls.website}/#services`,
        "name": "Software Development Services",
        "description": "Full-stack web, mobile, AI, and cloud development delivered by a senior product team.",
        "provider": {
          "@id": `${companyInfo.urls.website}/#organization`
        },
        "serviceType": "Software Development",
        "areaServed": {
          "@type": "Country",
          "name": companyInfo.location.country
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Core Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom Web Applications",
                "description": "Modern web apps with React, Node.js, and scalable cloud infrastructure."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "SaaS & Platform Builds",
                "description": "End-to-end product development, including architecture, billing, and observability."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Mobile & Cross-Platform",
                "description": "iOS, Android, and cross-platform apps that integrate with your stack."
              }
            }
          ]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${companyInfo.urls.website}/#localbusiness`,
        "name": `${companyInfo.name} Software Development`,
        "description": "US-based software development studio delivering secure, scalable products.",
        "url": companyInfo.urls.website,
        "image": `${companyInfo.urls.website}/logo.png`,
        "telephone": companyInfo.phoneE164,
        "email": companyInfo.email,
        "address": getPostalAddressSchema(),
        "priceRange": "$$",
        ...(openingHours.length ? { "openingHours": openingHours } : {}),
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": companyInfo.coordinates.latitude,
          "longitude": companyInfo.coordinates.longitude
        },
        "areaServed": {
          "@type": "Country",
          "name": companyInfo.location.country
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": companyInfo.ratings.value,
          "reviewCount": companyInfo.ratings.reviewCountAlt,
          "bestRating": companyInfo.ratings.bestRating,
          "worstRating": companyInfo.ratings.worstRating
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
};

export default SchemaMarkup;
