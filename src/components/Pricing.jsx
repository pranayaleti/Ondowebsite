import React from "react";
import { CheckCircle2 } from "lucide-react";
import { pricingOptions } from "../constants/data";

const Pricing = ({ onConsult }) => {
  const cards = pricingOptions; // show all three options
  const [selectedIndex, setSelectedIndex] = React.useState(1); // preselect right card ("Most Popular")

  return (
    <div className="mt-20">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center my-8 tracking-wide">
        <span className="text-white">Service</span>
        <br />
        <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
          Packages
        </span>
      </h2>
      <p className="text-center text-neutral-200 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
        Choose the package that best fits your business needs. All packages include
        professional development, testing, and deployment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
        {cards.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={option.title}
              className={`relative rounded-2xl p-8 md:p-10 border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-orange-400/60 bg-[radial-gradient(ellipse_at_center_top,rgba(255,122,0,0.15),rgba(0,0,0,0.6))] shadow-[0_0_0_1px_rgba(251,146,60,0.2),0_20px_60px_-20px_rgba(251,146,60,0.5)]"
                  : "border-neutral-700 bg-neutral-900/40 hover:border-neutral-500"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-baseline justify-between">
                <p className="text-3xl md:text-4xl mb-6 text-white font-semibold">
                  {option.title}
                </p>
                <div
                  className={`h-3 w-3 rounded-full ${
                    isSelected ? "bg-orange-500" : "bg-neutral-600"
                  }`}
                  aria-hidden
                />
              </div>

              <p className="mb-8">
                <span className="text-5xl mr-2 text-white font-bold">{option.price}</span>
                <span className="text-neutral-300 tracking-tight">Starting Price</span>
              </p>

              <ul>
                {option.features.map((feature) => (
                  <li key={feature} className="mt-5 flex items-center">
                    <CheckCircle2 className="text-green-400 flex-shrink-0" />
                    <span className="ml-2 text-neutral-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onConsult?.({ name: option.title, price: option.price, cadence: "Starting Price" });
                }}
                className={`inline-flex justify-center items-center text-center w-full h-12 px-5 mt-12 tracking-tight text-lg rounded-md transition duration-200 ${
                  isSelected
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-neutral-800 text-white hover:bg-neutral-700"
                }`}
              >
                Get Started
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pricing;
