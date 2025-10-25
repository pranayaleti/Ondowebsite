import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "Workflow", href: "/workflow" },
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

export const testimonials = [
  {
    user: "Sarah Martinez",
    company: "Local Restaurant Owner",
    image: user1,
    text: "OndoSoft built us a beautiful website that actually brings in customers! Our online orders increased by 300% in the first month. The best investment we've made for our business.",
  },
  {
    user: "Mike Chen",
    company: "Tech Startup Founder",
    image: user2,
    text: "We needed a custom web app for our startup and OndoSoft delivered exactly what we needed. Professional, fast, and affordable. They understood our vision and brought it to life perfectly.",
  },
  {
    user: "Lisa Thompson",
    company: "Small Business Owner",
    image: user3,
    text: "As a small business owner, I was worried about the cost of getting a professional website. OndoSoft worked within my budget and created something I'm proud to show customers. Highly recommended!",
  },
  {
    user: "James Rodriguez",
    company: "E-commerce Entrepreneur",
    image: user4,
    text: "OndoSoft built our entire e-commerce platform from scratch. The attention to detail and user experience is outstanding. Our sales have tripled since launching the new site.",
  },
  {
    user: "Amanda Foster",
    company: "Service Business Owner",
    image: user5,
    text: "The team at OndoSoft made the entire process so easy. They listened to our needs, provided great suggestions, and delivered a website that perfectly represents our brand. Excellent service!",
  },
  {
    user: "David Kim",
    company: "SaaS Startup CEO",
    image: user6,
    text: "We needed a complex SaaS platform and OndoSoft delivered beyond our expectations. The architecture is solid, the code is clean, and the support has been fantastic. They're our go-to development partner.",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Small Business Websites",
    description:
      "Professional, responsive websites that establish your online presence. Perfect for local businesses, restaurants, and service providers who need a clean, modern website to attract customers.",
    stack: "🛠 Tools: React, Next.js, Tailwind CSS, WordPress, SEO Optimization",
    alt: "Small business website development services with React and modern web technologies",
  },
  {
    icon: <PlugZap />,
    text: "Custom Web Applications",
    description:
      "Tailored web applications built to your specific business requirements. From internal tools to customer portals, we create solutions that streamline your operations and boost productivity.",
    stack: "🛠 Stack: React, Node.js, PostgreSQL, REST APIs, Authentication",
    alt: "Custom web application development with React, Node.js, and modern backend technologies",
  },
  {
    icon: <ShieldHalf />,
    text: "E-commerce Solutions",
    description:
      "Complete online stores with payment processing, inventory management, and customer accounts. From simple product catalogs to complex multi-vendor marketplaces.",
    stack: "🛠 Stack: Shopify, Stripe, WooCommerce, Custom Solutions",
    alt: "E-commerce website development with payment processing and inventory management",
  },
  {
    icon: <GlobeLock />,
    text: "SaaS Platform Development",
    description:
      "End-to-end SaaS products from concept to scale. We handle architecture, development, deployment, and ongoing maintenance to help you build a sustainable software business.",
    stack: "🛠 Stack: React, Node.js, AWS, PostgreSQL, Stripe, Analytics",
    alt: "SaaS platform development and cloud deployment services for scalable software solutions",
  },
  {
    icon: <Fingerprint />,
    text: "Business Process Automation",
    description:
      "Streamline your workflows with custom automation tools. Reduce manual work, eliminate errors, and scale your operations with intelligent software solutions.",
    stack: "🛠 Stack: Python, Node.js, APIs, Database Integration, Workflow Automation",
    alt: "Business process automation and workflow optimization software development",
  },
  {
    icon: <BatteryCharging />,
    text: "Mobile App Development",
    description:
      "Native and cross-platform mobile apps that extend your business reach. From simple utility apps to complex business applications with offline capabilities.",
    stack: "🛠 Stack: React Native, Flutter, iOS, Android, App Store Deployment",
    alt: "Mobile app development services for iOS and Android with React Native and Flutter",
  },
];

export const checklistItems = [
  {
    title: "Small Business Websites",
    description:
      "Professional websites for local businesses, restaurants, and service providers. Mobile-responsive designs with SEO optimization to help you attract and convert customers online.",
  },
  {
    title: "Custom Web Applications",
    description:
      "Tailored software solutions for specific business needs. From customer portals to internal management tools, we build applications that streamline your operations and boost productivity.",
  },
  {
    title: "SaaS Platform Development",
    description:
      "Complete software-as-a-service solutions from concept to scale. We handle everything from initial architecture to deployment, helping you build a sustainable software business.",
  },
];

export const workflowItems = [
  {
    title: "📋 Discovery & Planning",
    description:
      "We start with a detailed consultation to understand your business goals, target audience, and technical requirements. This ensures we build exactly what you need.",
  },
  {
    title: "🎨 Design & Prototyping",
    description:
      "Create wireframes and prototypes to visualize your project before development begins. This saves time and ensures we're aligned on the final product.",
  },
  {
    title: "⚡ Development & Testing",
    description:
      "Agile development with regular updates and testing. We build your solution using modern technologies and best practices, ensuring quality and performance.",
  },
  {
    title: "🚀 Launch & Support",
    description:
      "Deploy your project with proper hosting, security, and monitoring. We provide ongoing support and maintenance to keep your solution running smoothly.",
  },
];




// export const checklistItems = [
//   {
//     title: "Property Manager",
//     description:
//       "Oversees all properties, owners, and tenants. Can manage tenant applications, lease agreements, maintenance requests, and payment records, with full access to platform analytics and reports.",
//   },
//   {
//     title: "Property Owner",
//     description:
//       "Lists and monitors their properties on the platform. Delegates management tasks to the property manager, tracks verified tenants, and views detailed earnings reports and property performance.",
//   },
//   {
//     title: "Tenant",
//     description:
//       "Easily searches and applies for properties. Submits maintenance requests, communicates with the property manager, and accesses lease details and payment history with responsive support.",
//   },
// ];

export const pricingOptions = [
  {
    title: "Starter Website",
    price: "$1,200",
    features: [
      "Professional Website (3-5 pages)",
      "Mobile-Responsive Design",
      "Basic SEO Optimization",
      "Contact Forms",
      "1 Month Support Included",
      "Perfect for small businesses"
    ],
  },
  {
    title: "Business Website",
    price: "$2,500",
    features: [
      "Professional Website (5-10 pages)",
      "Mobile-Responsive Design",
      "Advanced SEO Optimization",
      "Contact Forms & Analytics",
      "Content Management System",
      "3 Months Support Included"
    ],
  },
  {
    title: "Custom Web App",
    price: "$4,500",
    features: [
      "Custom Web Application",
      "User Authentication",
      "Admin Dashboard",
      "Database Integration",
      "API Development",
      "6 Months Support Included"
    ],
  },
  {
    title: "SaaS Platform",
    price: "$8,500",
    features: [
      "Complete SaaS Solution",
      "Multi-tenant Architecture",
      "Payment Processing",
      "User Management & Billing",
      "Cloud Infrastructure",
      "12 Months Support Included"
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
