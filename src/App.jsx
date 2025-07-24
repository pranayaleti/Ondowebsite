import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Products from "./components/Products";

const ScrollToSection = ({ sectionId }) => {
  useEffect(() => {
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sectionId]);
  return null;
};

const MainContent = ({ sectionId }) => (
  <>
    <ScrollToSection sectionId={sectionId} />
    <div id="top" className="max-w-7xl mx-auto pt-20 px-6">
      <HeroSection />
      <div id="products" className="scroll-mt-20">
        <Products />
      </div>
      <div id="services" className="scroll-mt-20">
        <Services />
      </div>
      <div id="workflow" className="scroll-mt-20">
        <Workflow />
      </div>
      <div id="pricing" className="scroll-mt-20">
        <Pricing />
      </div>
      <div id="testimonials" className="scroll-mt-20">
        <Testimonials />
      </div>
      <div id="contact" className="scroll-mt-20">
        <Contact />
      </div>
      <Footer />
    </div>
  </>
);

const AppRoutes = () => {
  const location = useLocation();
  let sectionId = null;
  if (location.pathname === "/services") sectionId = "services";
  else if (location.pathname === "/workflow") sectionId = "workflow";
  else if (location.pathname === "/pricing") sectionId = "pricing";
  else if (location.pathname === "/testimonials") sectionId = "testimonials";
  else if (location.pathname === "/contact") sectionId = "contact";
  // else sectionId = null for home

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainContent sectionId={null} />} />
        <Route
          path="/products"
          element={<MainContent sectionId="products" />}
        />
        <Route
          path="/services"
          element={<MainContent sectionId="services" />}
        />
        <Route
          path="/workflow"
          element={<MainContent sectionId="workflow" />}
        />
        <Route path="/pricing" element={<MainContent sectionId="pricing" />} />
        <Route
          path="/testimonials"
          element={<MainContent sectionId="testimonials" />}
        />
        <Route path="/contact" element={<MainContent sectionId="contact" />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
