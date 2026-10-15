import { Link } from "react-router-dom";
import { useDoctorPortal } from "../features/doctor/doctorContext";
import bannerThumb from "/images/hero-img.png";
import bannerHeart from "/images/banner-heart.png";
export default function DoctorsBanner() {
  const {
    doctor
  } = useDoctorPortal();
  const name = doctor?.fullName ? /^Dr\.?\s/i.test(doctor.fullName) ? doctor.fullName : `Dr. ${doctor.fullName}` : null;
  return <div className="bg-white px-2 lg:px-[30px]">
    <section className="bg-[url('/images/hero-bg.png')] bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px] lg:h-[500px] flex items-center rounded-t-2xl md:rounded-t-[30px] relative z-10 overflow-hidden">
      <div className="Container w-full relative z-10 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <h1 className="font-AlbertSans font-extrabold text-3xl sm:text-5xl md:text-[50px] text-white uppercase break-words leading-tight">{name ? `Welcome, ${name}` : "Welcome back"}</h1>
            <img src={bannerHeart} draggable="false" className="w-8 sm:w-10 shrink-0" alt="" />
          </div>
          <p className="text-base sm:text-lg text-white font-DMSans">Your appointments, patients and practice at a glance.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link to="/doctor-portal/appointments" className="inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-full bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">View appointments</Link>
            <Link to="/doctor-portal/patients" className="inline-flex items-center justify-center min-h-11 px-5 py-3 rounded-full border border-white text-white font-semibold text-sm hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">My patients</Link>
          </div>
        </div>
      </div>
      <img src={bannerThumb} draggable="false" className="hidden md:block absolute bottom-5 right-5 md:bottom-10 md:right-10 w-[140px] lg:w-[200px] pointer-events-none" alt="" />
    </section>
  </div>;
}
