import { generateAllCityServiceCombinations, US_CITIES, SERVICE_AREAS } from './unifiedData';

// Generate XML sitemap for all city-service pages
export const generateSitemap = () => {
  const baseUrl = 'https://ondosoft.com'; // Update with your actual domain
  const cityServiceCombinations = generateAllCityServiceCombinations();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  // Add main pages with enhanced metadata
  const mainPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/services', priority: '0.9', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/products', priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/portfolio', priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/contact', priority: '0.7', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/workflow', priority: '0.6', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/testimonials', priority: '0.6', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/faq', priority: '0.6', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/legal', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/privacy-policy', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/terms-of-use', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/nda', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/licensing', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/accessibility', priority: '0.5', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/capabilities-deck', priority: '0.6', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] },
    { url: '/sitemap', priority: '0.4', changefreq: 'monthly', lastmod: new Date().toISOString().split('T')[0] }
  ];

  mainPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <image:image>
      <image:loc>${baseUrl}/logo.png</image:loc>
      <image:title>Ondosoft - Full Stack Software Development</image:title>
      <image:caption>Ondosoft logo for software development services</image:caption>
    </image:image>
  </url>`;
  });

  // Add service area pages (states and cities)
  SERVICE_AREAS.getServiceAreaUrls().forEach(area => {
    sitemap += `
  <url>
    <loc>${baseUrl}${area.url}</loc>
    <lastmod>${area.lastmod}</lastmod>
    <changefreq>${area.changefreq}</changefreq>
    <priority>${area.priority}</priority>
  </url>`;
  });

  // Add city-service pages
  cityServiceCombinations.forEach(combination => {
    sitemap += `
  <url>
    <loc>${baseUrl}${combination.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = 'https://ondosoft.com'; // Update with your actual domain
  
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas (if any)
Disallow: /admin/
Disallow: /private/
Disallow: /_next/
Disallow: /api/

# Allow all important pages
Allow: /services/
Allow: /products/
Allow: /pricing/
Allow: /contact/
Allow: /about/
Allow: /workflow/
Allow: /testimonials/
Allow: /faq/
Allow: /legal/
Allow: /privacy-policy/
Allow: /terms-of-use/
Allow: /nda/
Allow: /licensing/
Allow: /accessibility/
Allow: /sitemap/

# Crawl delay for better server performance
Crawl-delay: 1

# Host directive
Host: ${baseUrl}`;
};

// Generate sitemap and save to public directory
export const generateAndSaveSitemap = () => {
  const sitemap = generateSitemap();
  const robotsTxt = generateRobotsTxt();
  
  // In a real application, you would save these to the public directory
  // For now, we'll return them for manual saving
  return {
    sitemap,
    robotsTxt
  };
};

// Get all city-service URLs for internal linking
export const getAllCityServiceUrls = () => {
  return generateAllCityServiceCombinations();
};

// Get cities by state for state-specific pages
export const getCitiesByStateForSitemap = () => {
  const stateGroups = {};
  US_CITIES.forEach(city => {
    if (!stateGroups[city.state]) {
      stateGroups[city.state] = [];
    }
    stateGroups[city.state].push(city);
  });
  return stateGroups;
};
