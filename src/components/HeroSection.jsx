// import video1 from "../assets/video1.mp4";
// import video2 from "../assets/video2.mp4";

import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Full Stack Software
        <span className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text">
          {" "}
          Development
        </span>
        <br />
        <span className="text-3xl sm:text-4xl lg:text-5xl text-neutral-400">
          & SaaS Solutions
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        <strong className="text-orange-500">Hire a developer today</strong> - Ondosoft delivers end-to-end software development, 
        freelancing services, and SaaS platform solutions for businesses across the USA. 
        From React and Node.js web apps to cloud-native applications, we build scalable technology that drives growth.
      </p>
      <div className="flex justify-center my-10">
        <Link
          to="/contact"
          className="bg-gradient-to-r from-orange-500 to-orange-800 py-3 px-6 mx-3 rounded-md text-lg font-semibold hover:from-orange-600 hover:to-orange-900 transition-all duration-300"
        >
          Launch Your SaaS with Ondosoft
        </Link>
        <Link
          to="/services"
          className="bg-transparent border-2 border-orange-500 text-orange-500 py-3 px-6 mx-3 rounded-md text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
        >
          Freelance & Enterprise Solutions
        </Link>
      </div>
      {/* <div className="flex mt-10 justify-center">
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video> 
         
      </div> */}
    </div>
  );
};

export default HeroSection;
