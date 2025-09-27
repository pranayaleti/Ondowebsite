import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../constants/data";

const Pricing = () => {
  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        Service
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          {" "}Packages
        </span>
      </h2>
      <p className="text-center text-neutral-400 text-lg mb-8 max-w-3xl mx-auto">
        Choose the package that best fits your business needs. All packages include 
        professional development, testing, and deployment.
      </p>
      <div className="flex flex-wrap">
        {pricingOptions.map((option, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
            <div className="p-10 border border-neutral-700 rounded-xl">
              <p className="text-4xl mb-8">
                {option.title}
                {option.title === "Custom Web App" && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-400 text-transparent bg-clip-text text-xl mb-4 ml-2">
                    (Most Popular)
                  </span>
                )}
              </p>
              <p className="mb-8">
                <span className="text-5xl mt-6 mr-2">{option.price}</span>
                <span className="text-neutral-400 tracking-tight">Starting Price</span>
              </p>
              <ul>
                {option.features.map((feature, index) => (
                  <li key={index} className="mt-8 flex items-center">
                    <CheckCircle2 />
                    <span className="ml-2">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/contact"
                className="inline-flex justify-center items-center text-center w-full h-12 p-5 mt-20 tracking-tight text-xl bg-gradient-to-r from-orange-500 to-orange-800 text-white rounded-md transition duration-200 hover:from-orange-600 hover:to-orange-900"
              >
                Get Quote
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
