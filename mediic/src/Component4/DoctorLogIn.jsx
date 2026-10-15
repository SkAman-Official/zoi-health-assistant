import { useState } from "react";
import DoctorLeftOverlayContent from "./DoctorLeftOverlayContent";
import DoctorRightOverlayContent from "./DoctorRightOverlayContent";
import DoctorLoginForm from "./DoctorLoginForm";
import DoctorSignupForm from "./DoctorSignupForm";
import "../Component5/DoctorsHomePage";
const DoctorLogin = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const overlayBg = "bg-gradient-to-r from-teal-700 via-emerald-700 to-green-700";
  return <div className="h-screen flex items-center justify-center bg-gray-100">
    <div className="h-[80vh] w-[70vw] bg-white relative overflow-hidden rounded-lg shadow-xl">
      {/* Doctor Login Form */}
      <div className={`absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out z-20 ${isAnimated ? "translate-x-full opacity-0" : ""}`}>
        <DoctorLoginForm />
      </div>

      {/* Doctor Signup Form */}
      <div className={`absolute top-0 left-0 h-full w-1/2 flex justify-center items-center transition-all duration-700 ease-in-out ${isAnimated ? "translate-x-full opacity-100 z-50 animate-show" : "opacity-0 z-10"}`}>
        <DoctorSignupForm />
      </div>

      {/* Overlay Container */}
      <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out ${isAnimated ? "-translate-x-full" : ""}`}>
        <div className={`${overlayBg} relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${isAnimated ? "translate-x-1/2" : "translate-x-0"}`}>
          {/* Left Overlay */}
          <div className={`w-1/2 h-full absolute flex justify-center items-center top-0 transform -translate-x-[20%] transition-transform duration-700 ease-in-out ${isAnimated ? "translate-x-0" : "-translate-x-[20%]"}`}>
            <DoctorLeftOverlayContent isAnimated={isAnimated} setIsAnimated={setIsAnimated} />
          </div>

          {/* Right Overlay */}
          <div className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 transform transition-transform duration-700 ease-in-out ${isAnimated ? "translate-x-[20%]" : "translate-x-0"}`}>
            <DoctorRightOverlayContent isAnimated={isAnimated} setIsAnimated={setIsAnimated} />
          </div>
        </div>
      </div>
    </div>
  </div>;
};
export default DoctorLogin;
