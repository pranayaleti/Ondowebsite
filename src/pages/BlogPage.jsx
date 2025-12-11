import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import SEOHead from '../components/SEOHead';
import BlogCard from '../components/BlogCard';
import ConsultationWidget from '../components/ConsultationWidget';
import { companyInfo, getCanonicalUrl } from '../constants/companyInfo';

// Lazy load heavy components
const ConsultationModal = lazy(() => import('../components/ConsultationModal'));
const Footer = lazy(() => import('../components/Footer'));
import { Search, Filter } from 'lucide-react';

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogData, setBlogData] = useState(null);

  // Lazy load blogData
  useEffect(() => {
    import('../data/blogData').then(module => {
      setBlogData({
        blogPosts: module.blogPosts,
        blogCategories: module.blogCategories,
        getFeaturedPosts: module.getFeaturedPosts,
        getRecentPosts: module.getRecentPosts
      });
    });
  }, []);

  const featuredPosts = useMemo(() => {
    return blogData ? blogData.getFeaturedPosts() : [];
  }, [blogData]);

  const recentPosts = useMemo(() => {
    return blogData ? blogData.getRecentPosts(6) : [];
  }, [blogData]);

  const filteredPosts = useMemo(() => {
    if (!blogData) return [];
    return blogData.blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, blogData]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishDate) - new Date(a.publishDate);
      } else if (sortBy === 'oldest') {
        return new Date(a.publishDate) - new Date(b.publishDate);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [filteredPosts, sortBy]);

  const structuredData = useMemo(() => {
    if (!blogData) return null;
    const canonical = getCanonicalUrl('/blogs');
    const publisherLogo = `${companyInfo.urls.website}/logo.png`;
    const items = blogData.blogPosts.slice(0, 50).map((post, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": getCanonicalUrl(`/blogs/${post.slug}`),
      "name": post.title
    }));

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Blog",
          "@id": `${canonical}#blog`,
          "name": "Ondosoft Blog",
          "url": canonical,
          "description": "Business technology, SaaS, automation, and software development insights from Ondosoft.",
          "publisher": {
            "@type": "Organization",
            "name": companyInfo.name,
            "logo": {
              "@type": "ImageObject",
              "url": publisherLogo
            }
          }
        },
        {
          "@type": "ItemList",
          "@id": `${canonical}#list`,
          "name": "Ondosoft Blog Posts",
          "itemListOrder": "Descending",
          "itemListElement": items
        }
      ]
    };
  }, [blogData]);

  // Show loading state while blogData is loading
  if (!blogData) {
    return (
      <>
        <SEOHead
          title="Business Technology Blogs | Ondosoft"
          description="Get expert insights on small business technology, automation, SaaS solutions, and web development. Learn how to grow your business with smart software."
          keywords="small business technology, business automation, SaaS solutions, web development, business software, technology tips"
          canonicalUrl={getCanonicalUrl('/blogs')}
          structuredData={structuredData}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Business Technology Blogs | Ondosoft"
        description="Get expert insights on small business technology, automation, SaaS solutions, and web development. Learn how to grow your business with smart software."
        keywords="small business technology, business automation, SaaS solutions, web development, business software, technology tips"
        canonicalUrl={getCanonicalUrl('/blogs')}
        structuredData={structuredData}
      />
      
      <div>
        {/* Hero Section */}
        <section className="py-20 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Business <span className="text-orange-500">Technology</span> Blogs
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Get expert insights on automation, SaaS solutions, and web development. 
                Learn how to grow your business with smart software.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section - Gestalt: Common region, proximity */}
        <section className="py-12 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4">
            {/* Search and Filters - Gestalt: Similarity, grouping */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-600/50 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3.5 border border-gray-600/50 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all min-w-[180px]"
                >
                  <option value="all">All Categories</option>
                  {blogData.blogCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3.5 border border-gray-600/50 bg-gray-900/50 text-white rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all min-w-[160px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>

            {/* Results Count - Gestalt: Proximity, clear information */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm font-medium">
                Showing <span className="text-white font-semibold">{sortedPosts.length}</span> of <span className="text-white font-semibold">{blogData.blogPosts.length}</span> articles
                {selectedCategory !== 'all' && (
                  <> in <span className="text-orange-400 font-semibold">{blogData.blogCategories.find(c => c.id === selectedCategory)?.name}</span></>
                )}
                {searchTerm && (
                  <> matching "<span className="text-orange-400 font-semibold">{searchTerm}</span>"</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts - Gestalt: Common region, closure */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              {/* Section Header - Gestalt: Continuity, figure/ground */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Articles</h2>
                </div>
                <p className="text-gray-400 text-sm ml-20">Handpicked articles worth reading</p>
              </div>
              {/* Cards Grid - Gestalt: Similarity, proximity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {featuredPosts.map(post => (
                  <BlogCard key={post.id} post={post} featured={true} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts - Gestalt: Common region, closure */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* Section Header - Gestalt: Continuity, figure/ground */}
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-1 w-16 bg-orange-500 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {selectedCategory === 'all' ? 'All Articles' : `${blogData.blogCategories.find(c => c.id === selectedCategory)?.name} Articles`}
                </h2>
              </div>
              <p className="text-gray-400 text-sm ml-20">
                {selectedCategory === 'all' ? 'Browse all our articles' : `Articles in ${blogData.blogCategories.find(c => c.id === selectedCategory)?.name}`}
              </p>
            </div>
            
            {/* Cards Grid - Gestalt: Similarity, proximity, uniform spacing */}
            {sortedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {sortedPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="text-gray-400 mb-6">
                  <Search className="h-16 w-16 mx-auto opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No articles found</h3>
                <p className="text-gray-400 text-base">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            )}
          </div>
        </section>

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

export default BlogPage;
