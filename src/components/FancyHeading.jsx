import { memo } from "react";

/**
 * FancyHeading Component
 * Creates a fancy split-text heading style inspired by connectivewebdesign.com
 * First word in orange, second word in dark grey
 */
const FancyHeading = ({ firstWord, secondWord, className = "", textSize = "text-5xl sm:text-6xl md:text-6xl lg:text-7xl" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <h2 className={`${textSize} font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.1] tracking-tight w-full`}>
        <span className="text-orange-500 block w-full drop-shadow-[0_2px_8px_rgba(249,115,22,0.3)] transition-all duration-300 hover:drop-shadow-[0_4px_12px_rgba(249,115,22,0.5)] break-words">
          {firstWord}
        </span>
        <span className="text-gray-200 block w-full mt-2 sm:mt-2.5 md:mt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] font-semibold break-words">
          {secondWord}
        </span>
      </h2>
    </div>
  );
};

export default memo(FancyHeading);
