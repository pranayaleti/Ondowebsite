"use client"

import Link from "next/link"
import { blogPosts } from "@/data/blog-posts"
import { formatDate } from "@/lib/utils"

export default function BlogSidebar() {
  // Get recent posts (excluding the current one)
  const recentPosts = blogPosts.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/blog/${post.slug}`} className="group">
                <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(post.date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {["Web Design", "Development", "UI/UX", "SEO", "Marketing"].map((category, index) => (
            <Link
              key={index}
              href={`/blog/category/${category.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm bg-muted px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
        <p className="text-sm text-muted-foreground mb-4">Get the latest posts delivered straight to your inbox.</p>
        <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 text-sm border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}
