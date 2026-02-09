import { blogPosts } from '../data/blogData';
import { companyInfo } from '../constants/companyInfo';

const today = new Date().toISOString().split('T')[0];

export const generateSitemap = () => {
  const baseUrl = companyInfo.urls.website;

  const mainPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { url: '/services', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { url: '/testimonials', priority: '0.6', changefreq: 'monthly', lastmod: today },
    { url: '/portfolio', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { url: '/contact', priority: '0.7', changefreq: 'monthly', lastmod: today },
    { url: '/about', priority: '0.6', changefreq: 'monthly', lastmod: today },
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

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

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

  sitemap += `
</urlset>`;

  return sitemap;
};

export const generateBlogSitemap = () => {
  const baseUrl = companyInfo.urls.website;

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

  sitemap += `
  <url>
    <loc>${baseUrl}/blogs</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  blogPosts.forEach(post => {
    const lastmod = post.lastUpdated || post.publishDate || today;
    const publishDate = post.publishDate || today;

    sitemap += `
  <url>
    <loc>${baseUrl}/blogs/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.featured ? '0.9' : '0.7'}</priority>`;

    if (post.featuredImage || post.socialImage || post.image) {
      const imageUrl = post.featuredImage || post.socialImage || post.image;
      sitemap += `
    <image:image>
      <image:loc>${imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`}</image:loc>
      <image:title>${post.title}</image:title>
      <image:caption>${post.excerpt || post.metaDescription || ''}</image:caption>
    </image:image>`;
    }

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

export const generateRobotsTxt = () => {
  const baseUrl = companyInfo.urls.website;

  return `# robots.txt for Ondosoft
# Simplified to keep important routes indexable

User-agent: *
Allow: /

Disallow: /admin/
Disallow: /dashboard/
Disallow: /portal/
Disallow: /auth/
Disallow: /sign-in
Disallow: /sign-up
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

Allow: /sitemap.xml
Allow: /sitemap-blogs.xml

Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-blogs.xml`;
};

export const generateAndSaveSitemap = () => {
  const sitemap = generateSitemap();
  const blogSitemap = generateBlogSitemap();
  const robotsTxt = generateRobotsTxt();

  return {
    sitemap,
    blogSitemap,
    robotsTxt
  };
};

export const generateSitemapIndex = () => {
  const baseUrl = companyInfo.urls.website;

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
