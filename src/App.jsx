import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import SchemaMarkup from "./components/SchemaMarkup";
import AboutPage from "./pages/AboutPage";

// Import page components
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ServicesPage from "./pages/ServicesPage";
import WorkflowPage from "./pages/WorkflowPage";
import PricingPage from "./pages/PricingPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import SitemapPage from "./pages/SitemapPage";
import RobotsPage from "./pages/RobotsPage";
import FAQPage from "./pages/FAQPage";

const AppRoutes = () => {
  return (
    <>
      <SchemaMarkup />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/sitemap.xml" element={<SitemapPage />} />
        <Route path="/robots.txt" element={<RobotsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </Router>
    </HelmetProvider>
  );
}
