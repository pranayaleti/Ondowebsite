import React, { useState, useMemo, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import BlogCard from '../components/BlogCard';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import Footer from '../components/Footer';
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

  // Show loading state while blogData is loading
  if (!blogData) {
    return (
      <>
        <SEOHead
          title="Business Technology Blogs | Ondosoft"
          description="Get expert insights on small business technology, automation, SaaS solutions, and web development. Learn how to grow your business with smart software."
          keywords="small business technology, business automation, SaaS solutions, web development, business software, technology tips"
          canonicalUrl="https://ondosoft.com/blogs"
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
        canonicalUrl="https://ondosoft.com/blogs"
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

        {/* Search and Filter Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                className="px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="mb-8">
              <p className="text-gray-300">
                Showing {sortedPosts.length} of {blogData.blogPosts.length} articles
                {selectedCategory !== 'all' && ` in ${blogData.blogCategories.find(c => c.id === selectedCategory)?.name}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-1 w-12 bg-orange-500"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Featured Articles</h2>
                <div className="flex-1 h-1 bg-gray-700"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map(post => (
                  <BlogCard key={post.id} post={post} featured={true} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-orange-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                {selectedCategory === 'all' ? 'All Articles' : `${blogCategories.find(c => c.id === selectedCategory)?.name} Articles`}
              </h2>
              <div className="flex-1 h-1 bg-gray-700"></div>
            </div>
            
            {sortedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="h-20 w-20 mx-auto opacity-50" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No articles found</h3>
                <p className="text-gray-400 text-lg">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            )}
          </div>
        </section>

        <Footer />
        <ConsultationWidget />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default BlogPage;
