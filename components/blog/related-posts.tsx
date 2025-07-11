import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { blogPosts } from "@/data/blog-posts"

interface RelatedPostsProps {
  currentSlug: string
}

export default function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const currentPost = blogPosts.find((post) => post.slug === currentSlug)

  if (!currentPost) return null

  // Find posts with similar tags
  const relatedPosts = blogPosts
    .filter((post) => post.slug !== currentSlug) // Exclude current post
    .map((post) => {
      // Count matching tags
      const matchingTags = post.tags.filter((tag) => currentPost.tags.includes(tag))
      return { ...post, matchCount: matchingTags.length }
    })
    .filter((post) => post.matchCount > 0) // Only include posts with at least one matching tag
    .sort((a, b) => b.matchCount - a.matchCount) // Sort by number of matching tags
    .slice(0, 3) // Take top 3

  if (relatedPosts.length === 0) return null

  return (
    <div className="mt-16 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
      <div className="grid gap-8 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center text-primary font-medium">
                Read More <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
