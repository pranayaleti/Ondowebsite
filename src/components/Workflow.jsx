import { CheckCircle2 } from "lucide-react";
import codeImg from "../assets/code.jpg";
import { workflowItems } from "../constants/data";

const Workflow = () => {
  return (
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
          <img 
            src={codeImg} 
            alt="Software development workflow showing code on screen with modern development tools and technologies" 
            loading="lazy"
            className="rounded-lg shadow-lg w-full h-auto"
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
                  <p className="text-neutral-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
