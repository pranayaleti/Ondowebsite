import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Copy, Check } from 'lucide-react';

const ShareButtons = ({ title, url, description }) => {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const openShareWindow = (url) => {
    window.open(url, 'share', 'width=600,height=400');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h4>
      <div className="flex flex-wrap gap-3">
        {/* Facebook */}
        <button
          onClick={() => openShareWindow(shareLinks.facebook)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </button>

        {/* Twitter */}
        <button
          onClick={() => openShareWindow(shareLinks.twitter)}
          className="flex items-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => openShareWindow(shareLinks.linkedin)}
          className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
        >
          <Linkedin className="h-4 w-4 mr-2" />
          LinkedIn
        </button>

        {/* Copy Link */}
        <button
          onClick={copyToClipboard}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
