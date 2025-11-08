import { Helmet } from 'react-helmet-async';
import { SERVICE_AREAS } from '../utils/unifiedData';

const SEOHead = ({ 
  title = "Ondosoft | Full Stack Software Development, Freelancing & SaaS Solutions",
  description = "Ondosoft is your all-in-one partner for building websites, mobile apps, and full-scale SaaS platforms. We offer freelancing services, end-to-end software development, and cloud-native application expertise for businesses across the USA.",
  keywords = SERVICE_AREAS.getKeywordsString(),
  canonicalUrl = "https://ondosoft.com",
  ogImage = "https://ondosoft.com/logo.png",
  structuredData = null,
  noIndex = false
}) => {
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ondosoft.com/#organization",
        "name": "Ondosoft",
        "url": "https://ondosoft.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ondosoft.com/logo.png",
          "width": 200,
          "height": 60
        },
        "description": "Full stack software development, freelancing, and SaaS solutions company serving businesses across the USA",
        "foundingDate": "2024",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-555-0123",
          "contactType": "customer service",
          "availableLanguage": "English"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "2701 N Thanksgiving Way",
          "addressLocality": "Lehi",
          "addressRegion": "Utah",
          "postalCode": "84043",
          "addressCountry": "US"
        },
        "sameAs": [
          "https://linkedin.com/company/ondosoft",
          "https://github.com/ondosoft"
        ]
      },
      {
        "@type": "Service",
        "@id": "https://ondosoft.com/#services",
        "name": "Software Development Services",
        "description": "Full stack software development, web applications, mobile apps, and SaaS platform development",
        "provider": {
          "@id": "https://ondosoft.com/#organization"
        },
        "serviceType": "Software Development",
        "areaServed": {
          "@type": "Country",
          "name": "United States"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Software Development Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Full Stack Web Development",
                "description": "Complete web application development using React, Node.js, Python, and modern frameworks"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "SaaS Platform Development",
                "description": "End-to-end SaaS product design, development, and scaling solutions"
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
                "name": "Freelancing Services",
                "description": "Flexible software development and consulting services for businesses"
              }
            }
          ]
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://ondosoft.com/#localbusiness",
        "name": "Ondosoft",
        "description": "Nationwide software development and freelancing services",
        "url": "https://ondosoft.com",
        "telephone": "+1-555-0123",
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
          "name": "United States"
        },
        "serviceArea": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "39.8283",
            "longitude": "-98.5795"
          },
          "geoRadius": "2000000"
        }
      }
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Ondosoft - Full Stack Software Development, SaaS Solutions & Freelancing Services" />
      <meta property="og:site_name" content="Ondosoft" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ondosoft" />
      <meta name="twitter:creator" content="@ondosoft" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content="Ondosoft - Full Stack Software Development, SaaS Solutions & Freelancing Services" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Ondosoft" />
      <meta name="publisher" content="Ondosoft" />
      <meta name="copyright" content="Ondosoft" />
      <meta name="language" content="en-US" />
      <meta name="geo.region" content="US" />
      <meta name="geo.placename" content="United States" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Additional Social Media Tags */}
      <meta property="article:author" content="Ondosoft" />
      <meta property="article:publisher" content="https://ondosoft.com" />
      <meta property="article:section" content="Technology" />
      <meta property="article:tag" content="Software Development" />
      <meta property="article:tag" content="SaaS Development" />
      <meta property="article:tag" content="Freelancing" />
      
      {/* Business/Organization Tags */}
      <meta name="business:contact_data:street_address" content="2701 N Thanksgiving Way" />
      <meta name="business:contact_data:locality" content="Lehi" />
      <meta name="business:contact_data:region" content="Utah" />
      <meta name="business:contact_data:postal_code" content="84043" />
      <meta name="business:contact_data:country_name" content="United States" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), local-network=()" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Favicon - Multiple sizes for better browser support */}
      <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
      <link rel="shortcut icon" type="image/png" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/logo.png" />
      <link rel="apple-touch-icon" sizes="57x57" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
      
      {/* Bing Webmaster Tools */}
      <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
    </Helmet>
  );
};

export default SEOHead;