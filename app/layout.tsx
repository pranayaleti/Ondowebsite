import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { A11yProvider } from "@/components/a11y/a11y-provider"
import { A11yControls } from "@/components/a11y/a11y-controls"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
})

// Enhanced metadata
export const metadata: Metadata = {
  title: {
    default: "OnDo | Professional Web Design Agency",
    template: "%s | OnDo",
  },
  description:
    "OnDo is a full-service web design agency specializing in creating stunning, high-performance websites and digital solutions for businesses of all sizes.",
  keywords: [
    "web design",
    "web development",
    "digital agency",
    "UI/UX design",
    "responsive websites",
    "e-commerce solutions",
  ],
  authors: [{ name: "OnDo Team" }],
  creator: "OnDo",
  publisher: "OnDo",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://OnDo.com",
    title: "OnDo | Professional Web Design Agency",
    description:
      "OnDo is a full-service web design agency specializing in creating stunning, high-performance websites and digital solutions for businesses of all sizes.",
    siteName: "OnDo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnDo - Professional Web Design Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnDo | Professional Web Design Agency",
    description:
      "OnDo is a full-service web design agency specializing in creating stunning, high-performance websites and digital solutions for businesses of all sizes.",
    images: ["/og-image.png"],
    creator: "@OnDo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://OnDo.com",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <A11yProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
            <A11yControls />
            <Toaster />
          </A11yProvider>
        </ThemeProvider>
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "OnDo",
              url: "https://OnDo.com",
              logo: "https://Ondo .com/logo.png",
              sameAs: [
                "https://facebook.com/OnDo",
                "https://twitter.com/OnDo",
                "https://instagram.com/OnDo",
                "https://linkedin.com/company/OnDo",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-234-567-890",
                contactType: "customer service",
                availableLanguage: ["English"],
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
