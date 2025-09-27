import React from "react";
import SEOHead from "../components/SEOHead";
import Workflow from "../components/Workflow";
import Footer from "../components/Footer";

const WorkflowPage = () => {
  return (
    <>
      <SEOHead
        title="Software Development Process | Ondosoft Workflow & Methodology"
        description="Learn about Ondosoft's proven software development workflow. Our agile methodology ensures successful delivery of React, Node.js, Python, and SaaS projects for businesses across the USA."
        keywords="software development process, agile methodology, development workflow, project management, React development process, SaaS development workflow, freelancing process"
        canonicalUrl="https://ondosoft.com/workflow"
      />
      <div className="min-h-screen bg-black">
        <div className="mx-auto pt-20">
          <div id="workflow" className="scroll-mt-20">
            <Workflow />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default WorkflowPage;
