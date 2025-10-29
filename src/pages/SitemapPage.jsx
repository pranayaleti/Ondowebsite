import { generateSitemap } from '../utils/sitemapGenerator';
import { useEffect, useState } from 'react';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';

const SitemapPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const sitemap = generateSitemap();
    
    // Set content type to XML
    const headers = new Headers();
    headers.set('Content-Type', 'application/xml');
    
    // Create a blob and download it
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Sitemap Generated</h1>
        <p className="text-gray-600">Your sitemap.xml file has been downloaded.</p>
      </div>
      <ConsultationWidget />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SitemapPage;
