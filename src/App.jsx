import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import SchemaMarkup from "./components/SchemaMarkup";
import PerformanceMonitor from "./components/PerformanceMonitor";
import ScriptOptimizer from "./components/ScriptOptimizer";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { initPerformanceOptimizations } from "./utils/performance";

// Lazy load page components for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const RobotsPage = lazy(() => import("./pages/RobotsPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfUsePage = lazy(() => import("./pages/TermsOfUsePage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const NDAPage = lazy(() => import("./pages/NDAPage"));
const LicensingPage = lazy(() => import("./pages/LicensingPage"));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage"));
const CapabilitiesDeckPage = lazy(() => import("./pages/CapabilitiesDeckPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const PortalLayout = lazy(() => import("./pages/portal/PortalLayout"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const SubscriptionsPage = lazy(() => import("./pages/portal/SubscriptionsPage"));
const CampaignsPage = lazy(() => import("./pages/portal/CampaignsPage"));
const AssetsPage = lazy(() => import("./pages/portal/AssetsPage"));
const InvoicesPage = lazy(() => import("./pages/portal/InvoicesPage"));
const TicketsPage = lazy(() => import("./pages/portal/TicketsPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
const ClientsPage = lazy(() => import("./pages/admin/ClientsPage"));
const AdminCampaignsPage = lazy(() => import("./pages/admin/CampaignsPage"));
const AdminAssetsPage = lazy(() => import("./pages/admin/AssetsPage"));
const AdminTicketsPage = lazy(() => import("./pages/admin/TicketsPage"));
const AdminInvoicesPage = lazy(() => import("./pages/admin/InvoicesPage"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
      <p className="text-white">Loading...</p>
    </div>
  </div>
);

const AppRoutes = () => {
  // Initialize performance optimizations
  useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <PerformanceMonitor />
        <ScriptOptimizer />
        <SchemaMarkup />
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<PortfolioPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/workflow" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/nda" element={<NDAPage />} />
          <Route path="/licensing" element={<LicensingPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/capabilities-deck" element={<CapabilitiesDeckPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/sitemap.xml" element={<SitemapPage />} />
          <Route path="/robots.txt" element={<RobotsPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          
          {/* Portal Routes */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <PortalLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PortalDashboard />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="tickets" element={<TicketsPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="campaigns" element={<AdminCampaignsPage />} />
            <Route path="assets" element={<AdminAssetsPage />} />
            <Route path="tickets" element={<AdminTicketsPage />} />
            <Route path="invoices" element={<AdminInvoicesPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}
