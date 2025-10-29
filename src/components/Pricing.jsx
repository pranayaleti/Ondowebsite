import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../constants/data";

const Pricing = () => {
  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        <span className="text-white">Service</span>
        <br />
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
          Packages
        </span>
      </h2>
      <p className="text-center text-neutral-200 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
        Choose the package that best fits your business needs. All packages include 
        professional development, testing, and deployment.
      </p>
      <div className="flex flex-wrap">
        {pricingOptions.map((option, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
            <div className="p-10 border border-neutral-700 rounded-xl bg-neutral-900/50 backdrop-blur-sm">
              <p className="text-4xl mb-8 text-white">
                {option.title}
                {option.title === "Full Stack Development" && (
                  <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text text-xl mb-4 ml-2 font-semibold">
                    (Popular)
                  </span>
                )}
              </p>
              <p className="mb-8">
                <span className="text-5xl mt-6 mr-2 text-white font-bold">{option.price}</span>
                <span className="text-neutral-300 tracking-tight">Starting Price</span>
              </p>
              <ul>
                {option.features.map((feature, index) => (
                  <li key={index} className="mt-8 flex items-center">
                    <CheckCircle2 className="text-orange-400 flex-shrink-0" />
                    <span className="ml-2 text-neutral-200">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`/contact?package=${encodeURIComponent(option.title)}&price=${encodeURIComponent(option.price)}`}
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
