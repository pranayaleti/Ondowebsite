// Centralized pricing data
export const pricingPlans = [
  {
    id: "ui-ux-master-suite",
    title: "UI/UX Master Suite",
    price: 1200,
    priceDisplay: "$1,200",
    currency: "USD",
    features: [
      "Professional Website Design (5-8 Pages)",
      "Mobile-First Responsive Design",
      "Advanced UI/UX Design System",
      "Custom Brand Identity Integration",
      "SEO-Optimized Content Structure",
      "Interactive Contact Forms",
      "Social Media Integration",
      "Google Analytics & Search Console Setup",
      "Basic Security Implementation",
      "1 Month Post-Launch Support"
    ],
    description: "Professional website with 5-8 pages, mobile-responsive design, and basic SEO optimization"
  },
  {
    id: "full-stack-development",
    title: "Full Stack Development",
    price: 3000,
    priceDisplay: "$3,000",
    currency: "USD",
    features: [
      "Comprehensive Website (12-20 Pages)",
      "Custom Web Application Development",
      "User Authentication & Authorization",
      "Advanced SEO & Performance Optimization",
      "Admin Dashboard & Management Panel",
      "Database Design & Integration",
      "Content Management System (CMS)",
      "API Development & Integration",
      "Security & Data Protection",
      "3 Months Technical Support"
    ],
    description: "Professional website with custom web application features, user authentication, admin dashboard, and database integration"
  },
  {
    id: "complete-saas-ecosystem",
    title: "Complete SaaS Ecosystem",
    price: 8500,
    priceDisplay: "$8,500",
    currency: "USD",
    features: [
      "Enterprise-Grade SaaS Platform",
      "Multi-Tenant Architecture",
      "Payment Processing & Billing System",
      "User Management & Role-Based Access",
      "Cloud Infrastructure & Scalability",
      "RESTful API Development",
      "Advanced Security & Compliance",
      "Analytics & Business Intelligence",
      "Third-Party Integrations",
      "6 Months Comprehensive Support"
    ],
    description: "Complete SaaS solution with multi-tenant architecture and payment processing"
  },
  {
    id: "upfront-subscription",
    title: "Upfront & Subscription",
    price: null,
    priceDisplay: "Custom",
    currency: "USD",
    features: [
      "Constant Contact Updates & Upgrades",
      "Subscription Model Implementation",
      "Continuous Maintenance & Support",
      "Regular Feature Enhancements & Upgrades",
      "Constant Security Updates & Patches",
      "Ongoing Performance Optimization",
      "Regular Content Updates & Upgrades",
      "Frequent Technical Support",
      "Flexible Pricing Plans",
      "Scalable Subscription Tiers"
    ],
    description: "Custom pricing based on your specific needs"
  }
];

// Legacy export for backward compatibility
export const pricingOptions = pricingPlans.map(plan => ({
  title: plan.title,
  price: plan.priceDisplay,
  features: plan.features
}));

