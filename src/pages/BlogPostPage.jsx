import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import BlogCard from '../components/BlogCard';
import ShareButtons from '../components/ShareButtons';
import ConsultationWidget from '../components/ConsultationWidget';
import ConsultationModal from '../components/ConsultationModal';
import Footer from '../components/Footer';
import { Calendar, Clock, ArrowLeft, User } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogData, setBlogData] = useState(null);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Lazy load blogData
  useEffect(() => {
    import('../data/blogData').then(module => {
      setBlogData({
        getPostBySlug: module.getPostBySlug,
        getRelatedPosts: module.getRelatedPosts,
        blogCategories: module.blogCategories
      });
      const foundPost = module.getPostBySlug(slug);
      setPost(foundPost);
      if (foundPost) {
        setRelatedPosts(module.getRelatedPosts(foundPost, 3));
      }
    });
  }, [slug]);

  // Show loading state while blogData is loading
  if (!blogData) {
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
          <p className="text-gray-300 mb-8">The article you're looking for doesn't exist.</p>
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('# ')) {
        const text = paragraph.substring(2);
        // Highlight important words/phrases in orange
        const highlightedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>');
        return (
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4" dangerouslySetInnerHTML={{ __html: highlightedText }} />
        );
      } else if (paragraph.startsWith('## ')) {
        const text = paragraph.substring(3);
        const highlightedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>');
        return (
          <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3" dangerouslySetInnerHTML={{ __html: highlightedText }} />
        );
      } else if (paragraph.startsWith('### ')) {
        const text = paragraph.substring(4);
        const highlightedText = text.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>');
        return (
          <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2" dangerouslySetInnerHTML={{ __html: highlightedText }} />
        );
      } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <p key={index} className="text-lg font-semibold text-orange-400 my-4">
            {paragraph.substring(2, paragraph.length - 2)}
          </p>
        );
      } else if (paragraph.trim() === '') {
        return <br key={index} />;
      } else {
        // Only highlight bold text (**text**) in orange, nothing else
        const highlightedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<span class="text-orange-400 font-semibold">$1</span>');
        return (
          <p key={index} className="text-gray-300 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: highlightedParagraph }} />
        );
      }
    });
  };

  return (
    <>
      <SEOHead
        title={`${post.title} | Ondosoft Blogs`}
        description={post.metaDescription}
        keywords={post.tags.join(', ')}
        canonicalUrl={`https://ondosoft.com/blogs/${post.slug}`}
        ogImage={post.socialImage}
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
          <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-8">
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
              {post.readTime}
            </div>
          </div>

          {/* Excerpt/Subtitle */}
          {post.excerpt && (
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {formatContent(post.content)}
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

        <Footer />
        <ConsultationWidget />
        <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

export default BlogPostPage;
