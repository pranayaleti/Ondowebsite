import { features, workflowItems } from "../constants/data";
import { CheckCircle2 } from "lucide-react";
import OptimizedImage from "./OptimizedImage";

const Services = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px]">
      <div className="text-center">   
        <h1 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide pb-4">
          <span className="text-white">Full Stack</span>
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
            Development
          </span>
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-lg">
            & SaaS Solutions
          </span>
        </h1>
        <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
        Hire developers for React, Node.js, Python, Java, and cloud-native applications
        </span>
      </div>
      <div className="flex flex-wrap mt-10 lg:mt-20">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3">
            <div className="flex">
              <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-orange-700 justify-center items-center rounded-full">
                {feature.icon}
              </div>
              <div>
                <h2 className="mt-1 mb-6 text-xl text-white font-semibold">{feature.text}</h2>
                <p className="text-md p-2 mb-6 text-neutral-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Development Process Section */}
      <section className="mt-20" aria-labelledby="workflow-heading">
        <h2 id="workflow-heading" className="text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide">
          <span className="text-white">Our Development</span>
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
            Process
          </span>
        </h2>
        <p className="text-center text-neutral-200 text-lg mt-4 max-w-3xl mx-auto leading-relaxed">
          From initial consultation to final deployment, we follow a proven process 
          that ensures your project is delivered on time, on budget, and exceeds expectations.
        </p>
        
        <div className="flex flex-wrap justify-center mt-12">
          <div className="p-2 w-full lg:w-1/2">
            <OptimizedImage 
              src="/assets/code.jpg"
              alt="Software development workflow showing code on screen with modern development tools and technologies"
              width={600}
              height={400}
              className="rounded-lg shadow-lg w-full h-auto"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          </div>
          <div className="pt-12 w-full lg:w-1/2">
            <div className="space-y-8" role="list" aria-label="Development process steps">
              {workflowItems.map((item, index) => (
                <div key={index} className="flex items-start" role="listitem">
                  <div className="text-orange-400 mr-6 bg-orange-500/20 p-3 rounded-full flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-neutral-300 leading-relaxed mb-4">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
