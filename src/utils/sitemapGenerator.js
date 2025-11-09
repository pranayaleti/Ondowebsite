import { generateAllCityServiceCombinations, US_CITIES, SERVICE_AREAS, US_STATES } from './unifiedData';
import { blogPosts } from '../data/blogData';
import { companyInfo } from '../constants/companyInfo';

// Generate XML sitemap for all city-service pages
export const generateSitemap = () => {
  const baseUrl = companyInfo.urls.website;
  const cityServiceCombinations = generateAllCityServiceCombinations();
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Add main pages with enhanced metadata
  const mainPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/services', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/portfolio', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { url: '/contact', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/testimonials', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/faq', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/blogs', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { url: '/legal', priority: '0.5', changefreq: 'yearly', lastmod: today },
    { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly', lastmod: today },
    { url: '/terms-of-use', priority: '0.5', changefreq: 'yearly', lastmod: today },
    { url: '/nda', priority: '0.5', changefreq: 'yearly', lastmod: today },
    { url: '/licensing', priority: '0.5', changefreq: 'yearly', lastmod: today },
    { url: '/accessibility', priority: '0.5', changefreq: 'yearly', lastmod: today },
    { url: '/capabilities-deck', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/sitemap', priority: '0.4', changefreq: 'monthly', lastmod: today }
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

  // Add all state pages for location-based SEO
  Object.entries(US_STATES).forEach(([code, data]) => {
    sitemap += `
  <url>
    <loc>${baseUrl}/services/${data.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add all city pages for location-based SEO
  US_CITIES.forEach(city => {
    const citySlug = city.city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    const stateSlug = city.state.toLowerCase();
    sitemap += `
  <url>
    <loc>${baseUrl}/services/${citySlug}-${stateSlug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add city-service pages
  cityServiceCombinations.forEach(combination => {
    sitemap += `
  <url>
    <loc>${baseUrl}${combination.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate blog sitemap separately for better organization
export const generateBlogSitemap = () => {
  const baseUrl = companyInfo.urls.website;
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  // Add blog listing page
  sitemap += `
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add individual blog posts
  blogPosts.forEach(post => {
    const lastmod = post.lastUpdated || post.publishDate || today;
    const publishDate = post.publishDate || today;
    
    sitemap += `
  <url>
    <loc>${baseUrl}/blogs/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.featured ? '0.9' : '0.7'}</priority>`;
    
    // Add image if available
    if (post.featuredImage || post.socialImage || post.image) {
      const imageUrl = post.featuredImage || post.socialImage || post.image;
      sitemap += `
    <image:image>
      <image:loc>${imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt || post.metaDescription || ''}</image:caption>
    </image:image>`;
    }
    
    // Add news tag if recent (within 2 days)
    const publishDateObj = new Date(publishDate);
    const daysSincePublish = (new Date() - publishDateObj) / (1000 * 60 * 60 * 24);
    if (daysSincePublish <= 2) {
      sitemap += `
    <news:news>
      <news:publication>
        <news:name>Ondosoft Blog</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${publishDate}T00:00:00+00:00</news:publication_date>
      <news:title>${post.title}</news:title>
    </news:news>`;
    }
    
    sitemap += `
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate robots.txt content (updated to match public/robots.txt)
export const generateRobotsTxt = () => {
  const baseUrl = companyInfo.urls.website;
  
  return `# Comprehensive robots.txt for Ondosoft.com
# Optimized for SEO and Search Engine Crawling
# Last Updated: ${new Date().toISOString().split('T')[0]}

# ============================================
# DEFAULT RULES - All Search Engines
# ============================================
User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /portal/
Disallow: /auth/
Disallow: /sign-in
Disallow: /sign-up
Disallow: /private/
Disallow: /_next/
Disallow: /api/
Disallow: /server/
Disallow: /node_modules/

# Disallow query parameters that don't add value
Disallow: /*?*utm_*
Disallow: /*?*ref=*
Disallow: /*?*fbclid=*
Disallow: /*?*gclid=*
Disallow: /*?*_ga=*

# Disallow file types that shouldn't be indexed
Disallow: /*.json$
Disallow: /*.xml$?*
Disallow: /*.txt$?*
Disallow: /sw.js
Disallow: /service-worker.js

# Allow important directories explicitly
Allow: /services/
Allow: /products/
Allow: /pricing/
Allow: /contact/
Allow: /about/
Allow: /testimonials/
Allow: /faq/
Allow: /blogs/
Allow: /blog/
Allow: /portfolio/
Allow: /legal/
Allow: /privacy-policy/
Allow: /terms-of-use/
Allow: /nda/
Allow: /licensing/
Allow: /accessibility/
Allow: /capabilities-deck/
Allow: /sitemap/
Allow: /sitemap.xml
Allow: /robots.txt

# ============================================
# GOOGLE SPECIFIC RULES
# ============================================
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /assets/
Allow: /assets/images/
Allow: /logo.png
Allow: /dist/assets/images/
Disallow: /admin/
Disallow: /portal/
Disallow: /auth/

User-agent: Googlebot-Mobile
Allow: /
Crawl-delay: 0

User-agent: Googlebot-News
Allow: /blogs/
Allow: /blog/
Disallow: /admin/
Disallow: /portal/

# ============================================
# BING SPECIFIC RULES
# ============================================
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: BingPreview
Allow: /
Crawl-delay: 1

# ============================================
# AI CRAWLERS
# ============================================
User-agent: GPTBot
Allow: /
Crawl-delay: 1

User-agent: ChatGPT-User
Allow: /
Crawl-delay: 1

User-agent: CCBot
Allow: /
Crawl-delay: 1

User-agent: anthropic-ai
Allow: /
Crawl-delay: 1

User-agent: Claude-Web
Allow: /
Crawl-delay: 1

User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

# ============================================
# SITEMAPS
# ============================================
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-blogs.xml`;
};

// Generate sitemap and save to public directory
export const generateAndSaveSitemap = () => {
  const sitemap = generateSitemap();
  const blogSitemap = generateBlogSitemap();
  const robotsTxt = generateRobotsTxt();
  
  // In a real application, you would save these to the public directory
  // For now, we'll return them for manual saving
  return {
    sitemap,
    blogSitemap,
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

// Generate sitemap index for better organization (useful when you have multiple sitemaps)
export const generateSitemapIndex = () => {
  const baseUrl = companyInfo.urls.website;
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blogs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
};
