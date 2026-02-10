import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import BlogCard from '../components/BlogCard';
import ShareButtons from '../components/ShareButtons';
import ConsultationWidget from '../components/ConsultationWidget';
import { companyInfo, getCanonicalUrl } from '../constants/companyInfo';
import { formatDateUserTimezone } from '../utils/dateFormat.js';
import { sanitizeHtml } from '../utils/security.js';

// Lazy load heavy components
const ConsultationModal = lazy(() => import('../components/ConsultationModal'));
const Footer = lazy(() => import('../components/Footer'));
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const slugRef = useRef(slug);
  useEffect(() => { slugRef.current = slug; }, [slug]);

  // Scroll to top when navigating to a blog post
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  // Lazy load blogData and resolve post for current slug (clear stale state when slug changes)
  useEffect(() => {
    const currentSlug = slug;
    slugRef.current = currentSlug;
    setPost(null);
    setRelatedPosts([]);
    setCategoryName(null);
    setPostLoading(true);

    import('../data/blogData').then(module => {
      const foundPost = module.getPostBySlug(currentSlug);
      // Only apply state if this effect is still for the current route (avoid stale update after nav)
      if (slugRef.current !== currentSlug) return;
      setBlogData({
        getPostBySlug: module.getPostBySlug,
        getRelatedPosts: module.getRelatedPosts,
        blogCategories: module.blogCategories
      });
      setPost(foundPost);
      if (foundPost) {
        setRelatedPosts(module.getRelatedPosts(foundPost, 3));
        const foundCategory = module.blogCategories.find(cat => cat.id === foundPost.category);
        setCategoryName(foundCategory?.name || null);
      } else {
        setRelatedPosts([]);
        setCategoryName(null);
      }
      setPostLoading(false);
    }).catch(() => {
      if (slugRef.current === currentSlug) setPostLoading(false);
    });
  }, [slug]);

  const structuredData = useMemo(() => {
    if (!post) return null;
    const canonical = getCanonicalUrl(`/blogs/${post.slug}`);
    const publisherLogo = `${companyInfo.urls.website}/logo.png`;
    const breadcrumbList = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": companyInfo.urls.website
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blogs",
          "item": getCanonicalUrl('/blogs')
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": canonical
        }
      ]
    };

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.metaDescription || post.excerpt,
      "image": post.socialImage || post.image || post.featuredImage,
      "mainEntityOfPage": canonical,
      "url": canonical,
      "keywords": Array.isArray(post.tags) ? post.tags : [],
      "inLanguage": "en-US",
      "articleSection": categoryName || undefined,
      "datePublished": post.publishDate,
      "dateModified": post.lastUpdated || post.updatedAt || post.publishDate,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "publisher": {
        "@type": "Organization",
        "name": companyInfo.name,
        "logo": {
          "@type": "ImageObject",
          "url": publisherLogo
        }
      },
      "isPartOf": {
        "@type": "Blog",
        "name": "Ondosoft Blog",
        "url": getCanonicalUrl('/blogs')
      },
      "breadcrumb": breadcrumbList
    };
  }, [post, categoryName]);

  // Show loading state while blogData is loading or post for current slug is resolving
  if (!blogData || postLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-gray-200 mb-8">The article you're looking for doesn't exist.</p>
          <Link 
            to="/blogs"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return formatDateUserTimezone(dateString, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    const lines = content.split('\n');
    const elements = [];
    let currentList = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="space-y-3 mb-6 ml-6 list-disc list-outside text-gray-200">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-2">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Handle headings - use h2 for main content headings (h1 is reserved for page title)
      if (trimmed.startsWith('# ')) {
        flushList();
        const text = trimmed.substring(2);
        const highlightedText = sanitizeHtml(text.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>'));
        elements.push(
          <h2 key={index} className="text-3xl font-bold text-white mt-12 mb-6 pt-8 border-t border-gray-700/50 first:mt-0 first:pt-0 first:border-t-0" dangerouslySetInnerHTML={{ __html: highlightedText }} />
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        const text = trimmed.substring(3);
        const highlightedText = sanitizeHtml(text.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>'));
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-white mt-10 mb-5 pt-6 border-t border-gray-700/30" dangerouslySetInnerHTML={{ __html: highlightedText }} />
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        const text = trimmed.substring(4);
        const highlightedText = sanitizeHtml(text.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>'));
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-white mt-8 mb-4" dangerouslySetInnerHTML={{ __html: highlightedText }} />
        );
      } 
      // Handle sub-headings (like "Key Principle:", "Implementation:")
      else if (trimmed.match(/^[A-Z][a-z\s]+:/) && trimmed.endsWith(':')) {
        flushList();
        const text = sanitizeHtml(trimmed.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>'));
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-orange-400 mt-6 mb-3" dangerouslySetInnerHTML={{ __html: text }} />
        );
      }
      // Handle list items
      else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = sanitizeHtml(trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>'));
        currentList.push(itemText);
      }
      // Handle bold paragraphs (standalone)
      else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
        flushList();
        elements.push(
          <p key={index} className="text-lg font-semibold text-orange-400 my-6 px-4 py-3 bg-orange-500/10 border-l-4 border-orange-500 rounded-r-lg">
            {trimmed.substring(2, trimmed.length - 2)}
          </p>
        );
      }
      // Handle empty lines
      else if (trimmed === '') {
        flushList();
        elements.push(<div key={index} className="h-4" />);
      }
      // Handle regular paragraphs
      else {
        flushList();
        const highlightedParagraph = sanitizeHtml(trimmed.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>'));
        elements.push(
          <p key={index} className="text-gray-300 leading-relaxed mb-5 text-base" dangerouslySetInnerHTML={{ __html: highlightedParagraph }} />
        );
      }
    });

    flushList(); // Flush any remaining list items
    return elements;
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | Ondosoft Blogs`}
        description={post.metaDescription}
        keywords={(post.tags ?? []).join(', ')}
        canonicalUrl={getCanonicalUrl(`/blogs/${post.slug}`)}
        ogImage={post.socialImage || post.image || post.featuredImage}
        structuredData={structuredData}
      />
      
      <div>
        {/* Back Button */}
        <div className="border-b border-gray-700/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link 
              to="/blogs"
              className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Link>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Category */}
          <div className="mb-4">
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium border border-orange-500/30">
              {blogData.blogCategories.find(cat => cat.id === post.category)?.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-200 mb-8">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-gray-400" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {formatDate(post.publishDate)}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              {post.readTime ?? post.readingTime ?? ''}
            </div>
          </div>

          {/* Excerpt/Subtitle */}
          {post.excerpt && (
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image ?? post.featuredImage ?? ''}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>

          {/* Content - Gestalt: Proximity, Continuity, Figure/Ground */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700/50">
              {formatContent(post.content)}
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mt-12">
            <ShareButtons 
              title={post.title}
              url={`/blogs/${post.slug}`}
              description={post.excerpt}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-white mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </article>

        <Suspense fallback={<div className="h-32" />}>
          <Footer />
        </Suspense>
        <ConsultationWidget />
        {isModalOpen && (
          <Suspense fallback={null}>
            <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default BlogPostPage;
