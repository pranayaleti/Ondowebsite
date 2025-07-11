import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BlogSidebar from "@/components/blog/blog-sidebar"
import ShareButtons from "@/components/blog/share-buttons"
import RelatedPosts from "@/components/blog/related-posts"
import { blogPosts } from "@/data/blog-posts"

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export const generateMetadata = ({ params }: { params: { slug: string } }): Metadata => {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return {
      title: "Post Not Found | OnDo Studio Blog",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | OnDo Studio Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((post) => post.slug === params.slug)

  if (!post) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <main>
      <div className="bg-muted py-12">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
            >
              ← Back to all posts
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-8">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-blue max-w-none">
              <p className="lead">{post.excerpt}</p>

              <h2>Introduction</h2>
              <p>
                In today's digital landscape, having a strong online presence is more important than ever. Businesses of
                all sizes are recognizing the need to invest in professional web design and development services to stay
                competitive and reach their target audience effectively.
              </p>

              <p>
                This article explores the key considerations for creating effective websites that not only look great
                but also drive business results. We'll cover essential aspects of modern web development, from
                responsive design to performance optimization and user experience.
              </p>

              <h2>The Importance of User-Centered Design</h2>
              <p>
                User-centered design puts the needs and preferences of your website visitors at the forefront of the
                design process. This approach ensures that your website is intuitive, accessible, and provides a
                positive experience for all users.
              </p>

              <p>Key principles of user-centered design include:</p>

              <ul>
                <li>Understanding your target audience through research and data analysis</li>
                <li>Creating intuitive navigation and information architecture</li>
                <li>Designing clear and compelling calls-to-action</li>
                <li>Ensuring accessibility for users with disabilities</li>
                <li>Testing designs with real users and iterating based on feedback</li>
              </ul>

              <h2>Performance Optimization</h2>
              <p>
                Website performance has a direct impact on user experience, conversion rates, and search engine
                rankings. A slow-loading website can lead to high bounce rates and lost opportunities.
              </p>

              <p>Modern performance optimization techniques include:</p>

              <ul>
                <li>Image optimization and lazy loading</li>
                <li>Minification of CSS, JavaScript, and HTML</li>
                <li>Leveraging browser caching</li>
                <li>Using content delivery networks (CDNs)</li>
                <li>Implementing server-side rendering or static site generation</li>
              </ul>

              <h2>Mobile-First Approach</h2>
              <p>
                With mobile devices accounting for more than half of all web traffic, designing for mobile users is no
                longer optional. A mobile-first approach ensures that your website provides an excellent experience
                across all devices.
              </p>

              <p>This approach involves:</p>

              <ul>
                <li>Designing for the smallest screen first, then scaling up</li>
                <li>Prioritizing content and features based on mobile user needs</li>
                <li>Ensuring touch-friendly interface elements</li>
                <li>Optimizing page load times for mobile networks</li>
              </ul>

              <h2>Conclusion</h2>
              <p>
                Creating an effective website requires a thoughtful approach that balances aesthetics, functionality,
                and business objectives. By focusing on user-centered design, performance optimization, and mobile
                responsiveness, you can create a website that not only looks great but also delivers tangible results
                for your business.
              </p>

              <p>
                At OnDo Studio, we specialize in creating websites that not only look stunning but also drive
                business growth through strategic design, optimal performance, and seamless user experiences. Our team
                of experts stays at the forefront of web development trends to ensure your digital presence remains
                competitive in today's fast-paced online environment.
              </p>
            </div>

            <div className="mt-10 pt-10 border-t">
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="flex items-center text-sm text-muted-foreground">
                  <Tag className="h-4 w-4 mr-1" /> Tags:
                </span>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm bg-muted px-3 py-1 rounded-full hover:bg-primary/10"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <ShareButtons title={post.title} />
              </div>
            </div>

            <RelatedPosts currentSlug={post.slug} />
          </div>

          <div>
            <BlogSidebar />
          </div>
        </div>
      </div>
    </main>
  )
}
