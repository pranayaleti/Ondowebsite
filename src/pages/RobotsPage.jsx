import { generateRobotsTxt } from '../utils/sitemapGenerator';
import { useEffect } from 'react';

const RobotsPage = () => {
  useEffect(() => {
    const robotsTxt = generateRobotsTxt();
    
    // Set content type to text/plain
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    
    // Create a blob and download it
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Robots.txt Generated</h1>
        <p className="text-gray-600">Your robots.txt file has been downloaded.</p>
      </div>
    </div>
  );
};

export default RobotsPage;
