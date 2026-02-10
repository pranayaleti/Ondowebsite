import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDateUserTimezone } from '../utils/dateFormat.js';

const BlogCard = memo(({ post, featured = false }) => {
  const formattedDate = useMemo(() => {
    return formatDateUserTimezone(post.publishDate, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [post.publishDate]);

  return (
    <article className={`group ${featured ? 'lg:col-span-2' : ''}`}>
      <Link 
        to={`/blogs/${post.slug}`}
        className="block h-full bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300 overflow-hidden border border-gray-700/50 hover:border-orange-500/50"
      >
        {/* Image - Gestalt: Figure/Ground separation */}
        <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-56'} bg-gray-700/50`}>
          {(post.image ?? post.featuredImage) ? (
            <img
              src={post.image ?? post.featuredImage}
              alt={post.title}
              width={featured ? 768 : 384}
              height={featured ? 256 : 224}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextElementSibling;
                if (fallback && fallback.style) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${(post.image ?? post.featuredImage) ? 'hidden' : 'flex'}`}
          >
            <div className="text-gray-500 text-5xl font-bold">
              {post.title.charAt(0)}
            </div>
          </div>
          {post.featured && (
            <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 uppercase tracking-wide">
              Featured
            </div>
          )}
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        </div>

        {/* Content - Gestalt: Proximity grouping, clear hierarchy */}
        <div className={`p-6 ${featured ? 'p-8' : ''} flex flex-col h-full`}>
          {/* Category - Gestalt: Common region */}
          <div className="mb-4">
            <span className="inline-block bg-orange-500/15 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-orange-500/30 uppercase tracking-wide">
              {(post.category ?? '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          {/* Title - Gestalt: Figure prominence */}
          <h3 className={`font-bold text-white group-hover:text-orange-400 transition-colors mb-4 leading-tight ${
            featured ? 'text-2xl mb-5' : 'text-xl'
          }`}>
            {post.title}
          </h3>

          {/* Excerpt - Gestalt: Continuity, readable spacing */}
          <p className={`text-gray-300 mb-6 line-clamp-3 leading-relaxed flex-grow ${
            featured ? 'text-base mb-8' : 'text-sm'
          }`}>
            {post.excerpt}
          </p>

          {/* Meta - Gestalt: Similarity, proximity grouping */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium">{post.readTime ?? post.readingTime ?? ''}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-orange-400 font-semibold text-sm group-hover:text-orange-300 transition-colors">
              <span>Read</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;
