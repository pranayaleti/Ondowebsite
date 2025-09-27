import { features } from "../constants/data";

const Services = () => {
  return (
    <div className="relative mt-20 border-b border-neutral-800 min-h-[800px]">
      <div className="text-center">   
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide pb-4">
          <span className="text-white">Full Stack</span>
          <br />
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text drop-shadow-lg">
            Development
          </span>
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-lg">
            & SaaS Solutions
          </span>
        </h2>
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
                <h5 className="mt-1 mb-6 text-xl text-white font-semibold">{feature.text}</h5>
                <p className="text-md p-2 mb-20 text-neutral-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
