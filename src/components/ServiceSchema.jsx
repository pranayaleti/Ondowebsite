import React from 'react';

// Service-specific schema markup for individual service pages
const ServiceSchema = ({ serviceName, serviceDescription, serviceType, pageUrl }) => {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": serviceDescription,
    "provider": {
      "@type": "Organization",
      "name": "Ondosoft",
      "url": "https://ondosoft.com",
      "logo": "https://ondosoft.com/logo2.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service",
        "email": "contact@ondosoft.com"
      }
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": serviceType,
    "category": "Software Development",
    "url": pageUrl,
    "offers": {
      "@type": "Offer",
      "description": serviceDescription,
      "priceRange": "$$",
      "availability": "https://schema.org/InStock",
      "validFrom": "2024-01-01"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serviceName} Services`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": serviceName,
            "description": serviceDescription
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(serviceSchema)
      }}
    />
  );
};

// LocalBusiness schema for city-specific pages
const CityServiceSchema = ({ city, state, serviceName, serviceDescription }) => {
  const cityServiceSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Ondosoft - ${serviceName} in ${city}, ${state}`,
    "description": `${serviceDescription} services in ${city}, ${state}. Professional software development, freelancing, and SaaS solutions.`,
    "url": `https://ondosoft.com/services/${serviceName.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`,
    "telephone": "+1-555-123-4567",
    "email": "contact@ondosoft.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": state,
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "City",
      "name": city,
      "containedInPlace": {
        "@type": "State",
        "name": state
      }
    },
    "serviceArea": {
      "@type": "City",
      "name": city,
      "containedInPlace": {
        "@type": "State",
        "name": state
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serviceName} Services in ${city}, ${state}`,
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": serviceName,
            "description": serviceDescription
          }
        }
      ]
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Ondosoft",
      "url": "https://ondosoft.com"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(cityServiceSchema)
      }}
    />
  );
};

// SoftwareApplication schema for SaaS and app development
const SoftwareApplicationSchema = ({ appName, appDescription, category }) => {
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": appName,
    "description": appDescription,
    "applicationCategory": category,
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "Ondosoft",
      "url": "https://ondosoft.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ondosoft",
      "url": "https://ondosoft.com"
    },
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": "2024-01-01"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(softwareAppSchema)
      }}
    />
  );
};

export { ServiceSchema, CityServiceSchema, SoftwareApplicationSchema };
export default ServiceSchema;
