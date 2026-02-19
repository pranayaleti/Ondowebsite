import { features, workflowItems } from "../constants/data";
import { CheckCircle2 } from "lucide-react";

const steps = [
  { id: "01", label: "Discovery & Planning", short: "Discover" },
  { id: "02", label: "Design & Prototyping", short: "Design" },
  { id: "03", label: "Development & Testing", short: "Build" },
  { id: "04", label: "Launch & Support", short: "Launch" },
];

function AgileProcessDiagram() {
  return (
    <svg
      viewBox="0 0 560 320"
      className="w-full max-w-[600px] h-auto rounded-lg shadow-lg"
      role="img"
      aria-label="Agile development process: Discovery, Design, Development, Launch"
    >
      <defs>
        <linearGradient id="ondoOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
      {/* Connector line (horizontal) */}
      <path
        d="M 80 160 L 480 160"
        stroke="url(#ondoOrange)"
        strokeWidth="2"
        strokeDasharray="8 6"
        fill="none"
        opacity="0.7"
      />
      {steps.map((step, i) => {
        const x = 80 + (400 / (steps.length - 1)) * i;
        const y = 160;
        return (
          <g key={step.id}>
            {/* Node circle */}
            <circle
              cx={x}
              cy={y}
              r="36"
              fill="rgb(38 38 38)"
              stroke="url(#ondoOrange)"
              strokeWidth="2.5"
              filter="url(#shadow)"
            />
            <text
              x={x}
              y={y - 4}
              textAnchor="middle"
              className="text-sm font-bold"
              fill="#f97316"
              style={{ fontFamily: "system-ui, sans-serif", fontSize: "14px", fontWeight: "700" }}
            >
              {step.id}
            </text>
            {/* Label below */}
            <text
              x={x}
              y={y + 88}
              textAnchor="middle"
              fill="#e5e5e5"
              style={{ fontFamily: "system-ui, sans-serif", fontSize: "11px", fontWeight: "600" }}
            >
              {step.label.split(" ").slice(0, 2).join(" ")}
            </text>
            <text
              x={x}
              y={y + 102}
              textAnchor="middle"
              fill="#a3a3a3"
              style={{ fontFamily: "system-ui, sans-serif", fontSize: "10px" }}
            >
              {step.label.split(" ").slice(2).join(" ")}
            </text>
          </g>
        );
      })}
      {/* Arrowheads on the dashed line */}
      <polygon
        points="472,155 482,160 472,165"
        fill="#f97316"
        opacity="0.9"
      />
    </svg>
  );
}

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
        Product teams for React, Node.js, Python, and cloud-native builds
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
          From first workshop to launch, we follow a transparent, proven process so your release lands on time, on budget, and ready for scale.
        </p>
        
        <div className="flex flex-wrap justify-center mt-12">
          <div className="p-2 w-full lg:w-1/2 flex items-center justify-center">
            <AgileProcessDiagram />
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
