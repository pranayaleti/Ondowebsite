import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import PMT from "../assets/PMT_optimized.webm";
import { checklistItems } from "../constants/data";

const Products = () => {
  const videoRef = useRef(null);

  const toggleFullScreen = () => {
    const videoElement = videoRef.current;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen(); // Firefox
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen(); // Chrome, Safari
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen(); // IE/Edge
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="mt-16">
      <div className="text-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide pb-4">
          Our
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            Portfolio
          </span>
        </h2>
        <span className="bg-neutral-900 text-orange-500 rounded-full h-6 text-sm font-medium px-2 py-1">
          Real projects delivered for real businesses
        </span>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center">
        <div className="p-2 w-full lg:w-1/2">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            onClick={toggleFullScreen}
            className="rounded-lg w-full border border-orange-700 shadow-sm shadow-orange-400 mx-auto my-4 cursor-pointer"
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
