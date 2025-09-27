import { generateAllCityServiceCombinations, US_CITIES, SERVICE_AREAS } from './unifiedData';

// Generate XML sitemap for all city-service pages
export const generateSitemap = () => {
  const baseUrl = 'https://ondosoft.com'; // Update with your actual domain
  const cityServiceCombinations = generateAllCityServiceCombinations();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add main pages
  const mainPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/services', priority: '0.9', changefreq: 'weekly' },
    { url: '/products', priority: '0.8', changefreq: 'monthly' },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/workflow', priority: '0.6', changefreq: 'monthly' },
    { url: '/testimonials', priority: '0.6', changefreq: 'monthly' },
    { url: '/faq', priority: '0.6', changefreq: 'monthly' }
  ];

  mainPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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

# Allow all city-service pages
Allow: /services/*`;
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
