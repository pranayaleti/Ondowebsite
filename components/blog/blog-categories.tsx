import Link from "next/link"
import { blogPosts } from "@/data/blog-posts"

export default function BlogCategories() {
  // Extract all unique tags from blog posts
  const allTags = blogPosts.flatMap((post) => post.tags)
  const uniqueTags = [...new Set(allTags)]

  // Count posts per tag
  const tagCounts = uniqueTags.map((tag) => ({
    name: tag,
    count: allTags.filter((t) => t === tag).length,
  }))

  // Sort by count (descending)
  tagCounts.sort((a, b) => b.count - a.count)

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        {tagCounts.map((tag, index) => (
          <li key={index}>
            <Link
              href={`/blog/tag/${tag.name.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center justify-between group"
            >
              <span className="text-muted-foreground group-hover:text-primary transition-colors">{tag.name}</span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">{tag.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
