import React from 'react';
import { SERVICE_AREAS } from '../utils/unifiedData';

// Comprehensive JSON-LD schema markup for Ondosoft
const SchemaMarkup = () => {
  // Organization and LocalBusiness schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "Ondosoft",
    "alternateName": "Ondosoft Software Development",
    "description": "Ondosoft is a nationwide software development company offering freelancing, full stack development, SaaS solutions, and enterprise applications. We serve clients across all 50 states with comprehensive software development services.",
    "url": "https://ondosoft.com",
    "logo": "https://ondosoft.com/logo2.png",
    "image": "https://ondosoft.com/logo2.png",
    "foundingDate": "2020",
    "founder": {
      "@type": "Person",
      "name": "Ondosoft Team"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service",
        "email": "contact@ondosoft.com",
        "availableLanguage": "English",
        "areaServed": "US"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "sales",
        "email": "sales@ondosoft.com",
        "availableLanguage": "English",
        "areaServed": "US"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2701 N Thanksgiving Way",
      "addressLocality": "Lehi",
      "addressRegion": "Utah",
      "postalCode": "84043",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States",
      "alternateName": "USA"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Full Stack Development",
            "description": "Complete full stack web and mobile application development using modern technologies like React, Node.js, Python, and cloud platforms.",
            "provider": {
              "@type": "Organization",
              "name": "Ondosoft"
            },
            "areaServed": "United States",
            "serviceType": "Software Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Freelancing / Contract Software Development",
            "description": "Flexible freelancing and contract software development services for projects of any size, from startups to enterprise companies.",
            "provider": {
              "@type": "Organization",
              "name": "Ondosoft"
            },
            "areaServed": "United States",
            "serviceType": "Freelancing Services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SaaS Application Design & Development",
            "description": "End-to-end SaaS application design, development, and scaling services for businesses looking to build and grow their software-as-a-service platforms.",
            "provider": {
              "@type": "Organization",
              "name": "Ondosoft"
            },
            "areaServed": "United States",
            "serviceType": "SaaS Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Website & Mobile App Development",
            "description": "Custom website and mobile application development services including responsive web design, native iOS/Android apps, and cross-platform solutions.",
            "provider": {
              "@type": "Organization",
              "name": "Ondosoft"
            },
            "areaServed": "United States",
            "serviceType": "Web Development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "End-to-End Cloud Deployment",
            "description": "Comprehensive cloud deployment and DevOps services including AWS, Google Cloud, Azure setup, CI/CD pipelines, and ongoing infrastructure management.",
            "provider": {
              "@type": "Organization",
              "name": "Ondosoft"
            },
            "areaServed": "United States",
            "serviceType": "Cloud Services"
          }
        }
      ]
    },
    "serviceArea": SERVICE_AREAS.getServiceAreaSchema(),
    "sameAs": [
      "https://facebook.com/ondosoft",
      "https://twitter.com/ondosoft",
      "https://instagram.com/ondosoft",
      "https://linkedin.com/company/ondosoft",
      "https://github.com/ondosoft"
    ],
    "keywords": [
      "software development",
      "freelancing",
      "full stack development",
      "SaaS development",
      "web development",
      "mobile app development",
      "cloud deployment",
      "contract development",
      "custom software",
      "enterprise applications",
      "React development",
      "Node.js development",
      "Python development",
      "AWS services",
      "Google Cloud",
      "Azure services"
    ],
    "knowsAbout": [
      "React",
      "Node.js",
      "Python",
      "JavaScript",
      "TypeScript",
      "AWS",
      "Google Cloud",
      "Azure",
      "Docker",
      "Kubernetes",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "GraphQL",
      "REST APIs",
      "Microservices",
      "DevOps",
      "CI/CD",
      "Mobile Development",
      "SaaS Architecture"
    ]
  };

  // Service schema for individual services
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Software Development Services",
    "description": "Comprehensive software development services including full stack development, freelancing, SaaS applications, web development, mobile apps, and cloud deployment across the United States.",
    "provider": {
      "@type": "Organization",
      "name": "Ondosoft",
      "url": "https://ondosoft.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": "Software Development",
    "category": "Technology Services",
    "offers": {
      "@type": "Offer",
      "description": "Professional software development services for businesses of all sizes",
      "priceRange": "$$",
      "availability": "https://schema.org/InStock"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Software Development Services Catalog",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Full Stack Development",
            "description": "Complete full stack web and mobile application development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Freelancing Services",
            "description": "Flexible contract software development services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SaaS Development",
            "description": "End-to-end SaaS application design and development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Custom website and web application development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Mobile App Development",
            "description": "Native and cross-platform mobile application development"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cloud Deployment",
            "description": "Comprehensive cloud deployment and DevOps services"
          }
        }
      ]
    }
  };

  // LocalBusiness schema for geographic targeting
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Ondosoft",
    "description": "Nationwide software development company providing freelancing, full stack development, and SaaS solutions across all 50 states.",
    "url": "https://ondosoft.com",
    "telephone": "+1-555-123-4567",
    "email": "contact@ondosoft.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2701 N Thanksgiving Way",
      "addressLocality": "Lehi",
      "addressRegion": "Utah",
      "postalCode": "84043",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.3916",
      "longitude": "-111.8508"
    },
    "areaServed": [
      {
        "@type": "Country",
        "name": "United States"
      },
      {
        "@type": "State",
        "name": "California"
      },
      {
        "@type": "State",
        "name": "New York"
      },
      {
        "@type": "State",
        "name": "Texas"
      },
      {
        "@type": "State",
        "name": "Florida"
      },
      {
        "@type": "State",
        "name": "Illinois"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "39.8283",
        "longitude": "-98.5795"
      },
      "geoRadius": "2000000"
    },
    "openingHours": "Mo-Fr 09:00-17:00",
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "currenciesAccepted": "USD"
  };

  return (
    <>
      {/* Organization and LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      
      {/* Services Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema)
        }}
      />
      
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
    </>
  );
};

export default SchemaMarkup;
