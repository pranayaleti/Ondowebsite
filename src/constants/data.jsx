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
  { label: "Workflow", href: "/workflow" },
  { label: "Pricing", href: "/pricing" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "About", href: "/about" },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "I am extremely satisfied with the services provided. The team was responsive, professional, and delivered results beyond my expectations.",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "Working with the team at XYZ Company was a game-changer for our project. Their attention to detail and innovative solutions helped us achieve our goals faster than we thought possible. We are grateful for their expertise and professionalism!",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creations",
    image: user5,
    text: "I am amazed by the level of professionalism and dedication shown by the team. They were able to exceed our expectations and deliver outstanding results.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "The team went above and beyond to ensure our project was a success. Their expertise and dedication are unmatched. I look forward to working with them again in the future.",
  },
];

export const features = [
  {
    icon: <BotMessageSquare />, // You can change icons as needed
    text: "UI/UX Design",
    description:
      "Design pixel-perfect interfaces with user-tested workflows that increase product adoption and reduce churn.",
    stack: "🛠 Tools: Figma, Adobe XD, React, Tailwind, Storybook",
  },
  {
    icon: <PlugZap />,
    text: "API Integration & Handling",
    description:
      "Build secure, scalable integrations with REST, GraphQL, and third-party APIs for seamless backend extensibility.",
    stack: "🛠 Stack: Postman, Swagger, Node.js, Express, OAuth2",
  },
  {
    icon: <ShieldHalf />,
    text: "Ecommerce Platforms",
    description:
      "Launch full-fledged ecommerce platforms with blazing-fast storefronts, real-time inventory, and integrated payment gateways.",
    stack: "🛠 Stack: Shopify, Stripe, Razorpay, Next.js, Sanity CMS",
  },
  {
    icon: <GlobeLock />,
    text: "Analytics Dashboards",
    description:
      "Build real-time dashboards powered by custom KPIs, charts, and drill-down analytics for data-backed decisions.",
    stack: "🛠 Stack: React, D3.js, Chart.js, Supabase, PostgreSQL",
  },
  {
    icon: <Fingerprint />,
    text: "CRM Solutions",
    description:
      "Custom CRM systems tailored to your workflows — manage contacts, automate lead nurturing, and scale your pipeline.",
    stack: "🛠 Stack: Node.js, PostgreSQL, React, Prisma, JWT Auth",
  },
  {
    icon: <BatteryCharging />,
    text: "Mobile App Development",
    description:
      "Build cross-platform apps using Flutter or React Native with a native performance edge.",
  },
];

export const checklistItems = [
  {
    title: "Property Manager Dashboard",
    description:
      "Effortlessly oversee multiple properties, manage owners and tenants, and streamline day-to-day operations with advanced tools.",
  },
  {
    title: "Property Owner Insights",
    description:
      "Easily list and track properties, monitor earnings, and rely on verified tenants and professional management for hassle-free ownership.",
  },
  {
    title: "Tenant Experience",
    description:
      "Quickly find properties, submit service requests, and enjoy responsive support for a seamless renting experience.",
  },
];

export const workflowItems = [
  // {
  //   title: "Faster Product Launch",
  //   description:
  //     "Ship MVPs in weeks, not months with agile sprints and ready-to-deploy architecture.",
  // },
  // {
  //   title: "Secure & Scalable Codebase",
  //   description:
  //     "Build future-proof apps with industry standards in auth, testing, and CI/CD.",
  // },
  // {
  //   title: "Cross-Platform Development",
  //   description:
  //     "From web to mobile, we deliver consistent user experiences across all platforms.",
  // },
  {
    title: "🚀 Accelerated Product Launch",
    description:
      "Launch production-ready MVPs in weeks—powered by agile sprints and pre-configured, reliable architecture.",
  },
  {
    title: "🔒 Secure & Future-Proof Architecture",
    description:
      "Industry-grade authentication, automated testing, and CI/CD pipelines ensure your software is scalable, maintainable, and ready for growth.",
  },
  {
    title: "🌐 Unified Cross-Platform Experience",
    description:
      "Consistent, high-performing applications across web, mobile, and desktop—engineered for seamless user experiences.",
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
    title: "Base",
    price: "$50",
    features: [
      "Complete Web App (Frontend + Backend)",
      "your own infrastructure for API&DB setup",
      "GitHub Repo + Hosting Configured",
      "Fully Responsive + Tested",
      "Handover with Documentation"
    ],
  },
  {
    title: "Pro",
    price: "$100",
    features: [
      "We manage Server & DB setup for you",
      "CI/CD Monitoring & Fixes",
      "Performance Tuning",
      "Domain & SSL Management",
      "Backups, Logs & Alerts",
      "Uptime Monitoring & Reports"
    ],
  },
  {
    title: "Enterprise",
    price: "$250",
    features: [
      "Feature Enhancements",
      "Bug Fixes & Emergency Patches",
      "Tech Stack Migration Support",
      "Design Tweaks / UI Adjustments",
      "API Integration with New Services",
      "Response SLA"
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
