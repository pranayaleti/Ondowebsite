import { useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import NavigationLoader from "./components/NavigationLoader";
import SchemaMarkup from "./components/SchemaMarkup";
import PerformanceMonitor from "./components/PerformanceMonitor";
import ScriptOptimizer from "./components/ScriptOptimizer";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/LoadingSpinner";
import { AuthProvider } from "./contexts/AuthContext";
import { initPerformanceOptimizations } from "./utils/performance";
import analyticsTracker from "./utils/analytics";
import UnifiedChatWidget from "./components/UnifiedChatWidget";

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
const SitemapXMLPage = lazy(() => import("./pages/SitemapXMLPage"));
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
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const PortalLayout = lazy(() => import("./pages/portal/PortalLayout"));
const PortalDashboard = lazy(() => import("./pages/portal/PortalDashboard"));
const SubscriptionsPage = lazy(() => import("./pages/portal/SubscriptionsPage"));
const CampaignsPage = lazy(() => import("./pages/portal/CampaignsPage"));
const AssetsPage = lazy(() => import("./pages/portal/AssetsPage"));
const InvoicesPage = lazy(() => import("./pages/portal/InvoicesPage"));
const TicketsPage = lazy(() => import("./pages/portal/TicketsPage"));
const NotificationsPage = lazy(() => import("./pages/portal/NotificationsPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
const ClientsPage = lazy(() => import("./pages/admin/ClientsPage"));
const AdminCampaignsPage = lazy(() => import("./pages/admin/CampaignsPage"));
const AdminAssetsPage = lazy(() => import("./pages/admin/AssetsPage"));
const AdminTicketsPage = lazy(() => import("./pages/admin/TicketsPage"));
const AdminInvoicesPage = lazy(() => import("./pages/admin/InvoicesPage"));
const AdminNotificationsPage = lazy(() => import("./pages/admin/NotificationsPage"));
const ConsultationLeadsPage = lazy(() => import("./pages/admin/ConsultationLeadsPage"));
const AIConversationsPage = lazy(() => import("./pages/admin/AIConversationsPage"));
const EmailTemplatesPage = lazy(() => import("./pages/admin/EmailTemplatesPage"));

// Scroll to top component for route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Track navigation if pathname changed
    if (prevPathnameRef.current !== pathname) {
      analyticsTracker.trackNavigation(prevPathnameRef.current, pathname, 'programmatic');
      analyticsTracker.trackPageView(pathname);
      prevPathnameRef.current = pathname;
    }
    
    // Use requestAnimationFrame for smoother scroll
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const location = useLocation();
  
  // Initialize performance optimizations
  useEffect(() => {
    initPerformanceOptimizations();
    // Initialize analytics tracking
    analyticsTracker.init();
  }, []);

  // Prefetch likely next routes on idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const prefetchRoutes = () => {
        // Prefetch common routes
        const commonRoutes = [
          () => import('./pages/ServicesPage'),
          () => import('./pages/ContactPage'),
          () => import('./pages/AboutPage')
        ];
        
        commonRoutes.forEach((prefetchFn, index) => {
          setTimeout(() => {
            prefetchFn().catch(() => {});
          }, index * 100); // Stagger prefetch requests
        });
      };

      requestIdleCallback(prefetchRoutes, { timeout: 2000 });
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
        <PerformanceMonitor />
        <ScriptOptimizer />
        <SchemaMarkup />
        <Navbar />
        <NavigationLoader />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
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
          <Route path="/sitemap.xml" element={<SitemapXMLPage />} />
          <Route path="/robots.txt" element={<RobotsPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
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
            <Route path="notifications" element={<NotificationsPage />} />
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
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="consultation-leads" element={<ConsultationLeadsPage />} />
            <Route path="ai-conversations" element={<AIConversationsPage />} />
            <Route path="email-templates" element={<EmailTemplatesPage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        <UnifiedChatWidget />
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
