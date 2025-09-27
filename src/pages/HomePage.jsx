import React from "react";
import SEOHead from "../components/SEOHead";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";
import { SERVICE_AREAS } from "../utils/unifiedData";

const HomePage = () => {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ondosoft.com/#organization",
        "name": "Ondosoft",
        "url": "https://ondosoft.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ondosoft.com/logo2.png",
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
          "addressCountry": "US"
        },
        "sameAs": [
          "https://linkedin.com/company/ondosoft",
          "https://github.com/ondosoft"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://ondosoft.com/#website",
        "url": "https://ondosoft.com",
        "name": "Ondosoft",
        "description": "Full Stack Software Development, Freelancing & SaaS Solutions",
        "publisher": {
          "@id": "https://ondosoft.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://ondosoft.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
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
        "areaServed": [
          {
            "@type": "Country",
            "name": "United States"
          },
          {
            "@type": "City",
            "name": "Los Angeles",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "New York",
            "containedInPlace": {
              "@type": "State",
              "name": "New York"
            }
          },
          {
            "@type": "City",
            "name": "Chicago",
            "containedInPlace": {
              "@type": "State",
              "name": "Illinois"
            }
          },
          {
            "@type": "City",
            "name": "Houston",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Phoenix",
            "containedInPlace": {
              "@type": "State",
              "name": "Arizona"
            }
          },
          {
            "@type": "City",
            "name": "Philadelphia",
            "containedInPlace": {
              "@type": "State",
              "name": "Pennsylvania"
            }
          },
          {
            "@type": "City",
            "name": "San Antonio",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "San Diego",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "Dallas",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "San Jose",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "Austin",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Jacksonville",
            "containedInPlace": {
              "@type": "State",
              "name": "Florida"
            }
          },
          {
            "@type": "City",
            "name": "Fort Worth",
            "containedInPlace": {
              "@type": "State",
              "name": "Texas"
            }
          },
          {
            "@type": "City",
            "name": "Columbus",
            "containedInPlace": {
              "@type": "State",
              "name": "Ohio"
            }
          },
          {
            "@type": "City",
            "name": "Charlotte",
            "containedInPlace": {
              "@type": "State",
              "name": "North Carolina"
            }
          },
          {
            "@type": "City",
            "name": "San Francisco",
            "containedInPlace": {
              "@type": "State",
              "name": "California"
            }
          },
          {
            "@type": "City",
            "name": "Indianapolis",
            "containedInPlace": {
              "@type": "State",
              "name": "Indiana"
            }
          },
          {
            "@type": "City",
            "name": "Seattle",
            "containedInPlace": {
              "@type": "State",
              "name": "Washington"
            }
          },
          {
            "@type": "City",
            "name": "Denver",
            "containedInPlace": {
              "@type": "State",
              "name": "Colorado"
            }
          },
          {
            "@type": "City",
            "name": "Washington",
            "containedInPlace": {
              "@type": "State",
              "name": "District of Columbia"
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Ondosoft | Full Stack Software Development, Freelancing & SaaS Solutions"
        description="Ondosoft is your all-in-one partner for building websites, mobile apps, and full-scale SaaS platforms. We offer freelancing services, end-to-end software development, and cloud-native application expertise for businesses across the USA. Hire software developers near you in major US cities including Los Angeles, New York, Chicago, Houston, and more."
        keywords="software development, freelancing, full stack, SaaS, web apps, mobile apps, Ondosoft, US software company, hire developers, React, Node.js, Python, Java, cloud deployment, custom software, software development companies near me, hire software developers, best software development companies, software development in Los Angeles, software development in New York, software development in Chicago, software development in Houston, software development in Phoenix, software development in Philadelphia, software development in San Antonio, software development in San Diego, software development in Dallas, software development in San Jose, software development in Austin, software development in Jacksonville, software development in Fort Worth, software development in Columbus, software development in Charlotte, software development in San Francisco, software development in Indianapolis, software development in Seattle, software development in Denver, software development in Washington DC"
        structuredData={homeStructuredData}
      />
      <div className="min-h-screen bg-black">
        <div id="top" className="mx-auto pt-20">
          <HeroSection />
        </div>
        <Footer />
        
        {/* Hidden SEO Section - Service Areas for Search Engines */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <h1>Software Development Services by State</h1>
          <p>Ondosoft provides freelancing, full stack development, and SaaS solutions across all 50 states including:</p>
          <ul>
            {SERVICE_AREAS.getHiddenSEOContent().states.map(state => (
              <li key={state.slug}>
                <a href={state.url}>
                  {state.linkText}
                </a>
              </li>
            ))}
          </ul>
          
          <h2>Top Cities for Software Development</h2>
          <p>Leading software development company serving major metropolitan areas:</p>
          <ul>
            {SERVICE_AREAS.getHiddenSEOContent().cities.map(city => (
              <li key={city.slug}>
                <a href={city.url}>
                  {city.linkText}
                </a>
              </li>
            ))}
          </ul>
          
          <h2>Best Software Development Companies Near Me</h2>
          <p>Find the best freelancing and full stack development services in your area. Ondosoft offers:</p>
          <ul>
            <li>Freelancing services for small businesses and startups</li>
            <li>Full stack development with React, Node.js, Python, and Java</li>
            <li>SaaS application design and development</li>
            <li>Custom web and mobile app development</li>
            <li>Cloud deployment and DevOps services</li>
          </ul>

          <h2>Software Development Services by City</h2>
          <p>Professional software development services available in major US cities including:</p>
          <ul>
            <li>Software development in Los Angeles, California</li>
            <li>Software development in New York, New York</li>
            <li>Software development in Chicago, Illinois</li>
            <li>Software development in Houston, Texas</li>
            <li>Software development in Phoenix, Arizona</li>
            <li>Software development in Philadelphia, Pennsylvania</li>
            <li>Software development in San Antonio, Texas</li>
            <li>Software development in San Diego, California</li>
            <li>Software development in Dallas, Texas</li>
            <li>Software development in San Jose, California</li>
            <li>Software development in Austin, Texas</li>
            <li>Software development in Jacksonville, Florida</li>
            <li>Software development in Fort Worth, Texas</li>
            <li>Software development in Columbus, Ohio</li>
            <li>Software development in Charlotte, North Carolina</li>
            <li>Software development in San Francisco, California</li>
            <li>Software development in Indianapolis, Indiana</li>
            <li>Software development in Seattle, Washington</li>
            <li>Software development in Denver, Colorado</li>
            <li>Software development in Washington, DC</li>
          </ul>

          <h2>Hire Software Developers Near Me</h2>
          <p>Looking for experienced software developers in your city? Ondosoft provides:</p>
          <ul>
            <li>Full stack developers for hire in major US cities</li>
            <li>React developers available for freelance projects</li>
            <li>Node.js developers for web application development</li>
            <li>Python developers for backend services and APIs</li>
            <li>Java developers for enterprise applications</li>
            <li>Mobile app developers for iOS and Android</li>
            <li>SaaS developers for platform development</li>
            <li>Cloud developers for AWS, Azure, and Google Cloud</li>
          </ul>

          <h2>Software Development Companies in Major Cities</h2>
          <p>Ondosoft is recognized as one of the top software development companies serving businesses across the United States. Our services include:</p>
          <ul>
            <li>Custom software development for startups and enterprises</li>
            <li>Web application development with modern frameworks</li>
            <li>Mobile app development for iOS and Android platforms</li>
            <li>SaaS platform design and development</li>
            <li>API development and integration services</li>
            <li>Database design and optimization</li>
            <li>Cloud migration and deployment services</li>
            <li>DevOps and CI/CD pipeline setup</li>
            <li>Software maintenance and support</li>
            <li>Technical consulting and architecture planning</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;
