import React from "react";
import SEOHead from "../components/SEOHead";
import Products from "../components/Products";
import Footer from "../components/Footer";

const ProductsPage = () => {
  return (
    <>
      <SEOHead
        title="Software Development Products | Ondosoft Solutions & Technologies"
        description="Explore Ondosoft's software development products and solutions. From React web applications to SaaS platforms, we build scalable software products for businesses across the USA."
        keywords="software development products, React applications, SaaS products, web applications, mobile apps, software solutions, development technologies"
        canonicalUrl="https://ondosoft.com/products"
      />
      <div className="min-h-screen bg-black">
        <div className="mx-auto pt-20">
          <div id="products" className="scroll-mt-20">
            <Products />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;
