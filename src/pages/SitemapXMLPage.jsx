import { useEffect, useState } from 'react';
import { generateSitemap } from '../utils/sitemapGenerator';

/**
 * Component that serves the XML sitemap for search engines
 * This component renders the XML sitemap as plain text
 */
const SitemapXMLPage = () => {
  const [xmlContent, setXmlContent] = useState('');

  useEffect(() => {
    // Generate the XML sitemap
    const sitemap = generateSitemap();
    setXmlContent(sitemap);
    
    // Set content type via meta tag
    const metaContentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (metaContentType) {
      metaContentType.setAttribute('content', 'application/xml; charset=utf-8');
    } else {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml; charset=utf-8';
      document.head.appendChild(meta);
    }
    
    // Set page title
    document.title = 'Sitemap';
  }, []);

  // Render XML as plain text in a pre tag
  // This ensures proper formatting and prevents React from escaping XML
  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      fontFamily: 'monospace',
      fontSize: '12px',
      margin: 0,
      padding: '20px',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      minHeight: '100vh'
    }}>
      {xmlContent}
    </pre>
  );
};

export default SitemapXMLPage;

