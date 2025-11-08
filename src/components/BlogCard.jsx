import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const BlogCard = ({ post, featured = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className={`group ${featured ? 'lg:col-span-2' : ''}`}>
      <Link 
        to={`/blogs/${post.slug}`}
        className="block h-full bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden border border-gray-700 hover:border-orange-500/30"
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'} bg-gray-700`}>
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center ${post.image ? 'hidden' : 'flex'}`}
          >
            <div className="text-gray-500 text-4xl font-bold">
              {post.title.charAt(0)}
            </div>
          </div>
          {post.featured && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
              Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="flex items-center mb-3">
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm font-medium border border-orange-500/30">
              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-white group-hover:text-orange-400 transition-colors mb-3 ${
            featured ? 'text-2xl' : 'text-xl'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-300 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.publishDate)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </div>
            </div>
            <div className="flex items-center text-orange-400 font-semibold group-hover:text-orange-300">
              Read More
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default BlogCard;
