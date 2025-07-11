"use client"

import type React from "react"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <footer className="bg-gray-50 pt-16 pb-8" role="contentinfo" aria-labelledby="footer-heading">
      <div className="container mx-auto px-6">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/" className="inline-block mb-4 hover-scale">
              <span className="text-xl font-bold">
                <span className="text-black">On</span>Do
              </span>
            </Link>
            <p className="text-gray-700 mb-4 max-w-xs">
              We create stunning, high-performance websites and digital solutions that help businesses grow online.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-labelledby="company-heading">
            <h3 id="company-heading" className="font-medium text-lg mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Work", href: "/work" },
                { name: "Careers", href: "/careers" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-black transition-colors animated-underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="services-heading">
            <h3 id="services-heading" className="font-medium text-lg mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Web Design", href: "/services#web-design" },
                { name: "Web Development", href: "/services#web-development" },
                { name: "E-commerce", href: "/services#e-commerce" },
                { name: "UI/UX Design", href: "/services#ui-ux-design" },
                { name: "Digital Marketing", href: "/services#digital-marketing" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-700 hover:text-black transition-colors animated-underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-medium text-lg mb-4">Subscribe</h3>
            <p className="text-gray-700 mb-4">
              Subscribe to our newsletter to receive updates and insights on web design and development.
            </p>
            {isSubscribed ? (
              <div className="p-4 bg-green-50 text-green-800 rounded-md">
                Thank you for subscribing! We'll be in touch soon.
              </div>
            ) : (
              <form className="space-y-2" onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="Your email address"
                    className="bg-white rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-required="true"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-md bg-black hover:bg-black/90 text-white hover-glow"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} OnDo. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-black animated-underline">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-500 hover:text-black animated-underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
