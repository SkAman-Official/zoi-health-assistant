import { Outlet, Navigate } from "react-router-dom";
import DoctorsNavbar from "../Shared/DoctorsNavbar/DoctorsNavbar";
import Footer from "../Shared/Footer/Footer";
import Cursor from "../Shared/Cursor/Cursor";
import AOS from "aos";
import "aos/dist/aos.css";
import HelmetChanger from "../Shared/Helmet/Helmet";
import { useEffect } from "react";
import BackToTop from "../Shared/BackToTop/BackToTop";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DoctorsBanner from "../Component5/DoctorsBanner";
import DoctorPortalProvider from "../features/doctor/DoctorPortalProvider";
const DoctorsMain = () => {
  const doctorToken = localStorage.getItem("doctorToken");
  useEffect(() => {
    if (!doctorToken) return;
    AOS.init({
      duration: 1000,
      once: true,
      offset: 120
    });
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      AOS.refresh();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [doctorToken]);
  if (!doctorToken) return <Navigate to="/doctor-login" />;
  return <DoctorPortalProvider>
    <HelmetChanger title={"Doctor's Dashboard"} />
    <DoctorsNavbar />
    <DoctorsBanner />
    <Cursor />
    <BackToTop />

    {/* Outlet for dashboard content */}
    <div className="doctor-workspace min-h-[60vh] bg-gray-50">
      <Outlet />
    </div>

    <Footer />
  </DoctorPortalProvider>;
};
export default DoctorsMain;
