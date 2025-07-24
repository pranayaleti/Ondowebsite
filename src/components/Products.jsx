import { CheckCircle2 } from "lucide-react";
//import video1 from "../assets/video1.mp4";
import PMT from "../assets/PMT_optimized.webm";
import { checklistItems } from "../constants/data";

const Products = () => {
  return (
    <div className="mt-16">
      {/* <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center tracking-wide">
        Our
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          Products
        </span>
        
      </h2> */}
      <div className="text-center">   
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide pb-4">
          Our
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            Products
          </span>
        </h2>
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-2 py-1 ">
        Property Management Saas Application
        </span>
      </div>
       
      <div className="flex flex-col lg:flex-row justify-center items-center">
        <div className="p-2 w-full lg:w-1/2">
          <video
            autoPlay
            loop
            muted
            className="rounded-lg w-full border border-orange-700 shadow-sm shadow-orange-400 mx-auto my-4"
          >
            <source src={PMT} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="pt-12 w-full lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex mb-12">
              <div className="text-green-400 mx-6 bg-neutral-900 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                <p className="text-md text-neutral-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
