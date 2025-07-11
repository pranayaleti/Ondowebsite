"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation, useInView } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { blogPosts } from "@/data/blog-posts"
import { formatDate } from "@/lib/utils"

export default function BlogGrid() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid gap-8"
    >
      {blogPosts.map((post, index) => (
        <motion.article
          key={post.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="group bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="md:flex">
            <div className="md:w-1/3 relative h-60 md:h-auto">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-3 gap-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-primary font-medium hover:underline"
              >
                Read More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.article>
      ))}
    </motion.div>
  )
}
