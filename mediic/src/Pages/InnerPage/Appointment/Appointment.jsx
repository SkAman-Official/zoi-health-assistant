import { useState, useEffect } from "react";
import useRegisteredDoctors, { retainDoctorSelection } from "../../../features/appointments/useRegisteredDoctors";
import { FaUser, FaCalendarAlt, FaClock, FaCreditCard, FaHospital, FaNotesMedical } from "react-icons/fa";
import { GoArrowRight, GoArrowLeft } from "react-icons/go";
import { HiOutlineMailOpen } from "react-icons/hi";
import { MdCall, MdLocalHospital } from "react-icons/md";
import Heart from "/images/banner-heart.png";
import circleShape from "/images/crcle-bg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { EffectCreative } from "swiper/modules";
import TestimonialCard from "./TestimonialCard";
import testiProfile from "/images/people.png";
import testiQuote from "/images/quote.png";
const TestiData = [{
  id: 1,
  testiQuote: testiQuote,
  testiDesc: `"Zoi has completely changed how I manage my health appointments. The interface is clean, modern, and incredibly easy to navigate—even for someone like me who's not very tech-savvy. From booking an appointment to checking my reports, everything flows so naturally. I never feel lost or overwhelmed, which is rare with healthcare apps. The workflow is smooth and intuitive, and I especially love how quickly I can access my records and chat with doctors. It really feels like the app was designed with patients in mind."`,
  testiName: "Sk Zeshan",
  testiDesignation: "Satisfied Patient",
  testiProfile: testiProfile
}, {
  id: 2,
  testiQuote: testiQuote,
  testiDesc: `"Honestly, Zoi is the most user-friendly health app I’ve ever used. The UI is clean, minimalistic, and fast, and the UX is just spot on—every action feels like second nature. I didn’t have to dig through menus to find what I needed. The appointments, prescriptions, and medical history are all just a few taps away, which saves me so much time. The app gives off a sense of calm and clarity, which I think is exactly what you want in a health app. Really well done!"`,
  testiName: "Imran Khan",
  testiDesignation: "Satisfied Patient",
  testiProfile: testiProfile
}];
const Appoinment = () => {
  // Form state
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const {
    doctors,
    hospitals
  } = useRegisteredDoctors();
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Doctors for selected hospital

  // Filter doctors when hospital changes
  useEffect(() => {
    if (hospital) {
      const hospitalDoctors = doctors.filter(doc => doc.hospital === hospital);
      setFilteredDoctors(hospitalDoctors);
      setDoctor(current => retainDoctorSelection(current, hospitalDoctors));
    } else {
      setFilteredDoctors([]);
    }
  }, [hospital, doctors]);

  // Fetch doctors and hospitals from backend on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetch("/api/appointments/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => response.ok ? response.json() : null).then(profile => {
      if (profile) {
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone);
      }
    }).catch(() => console.warn("Appointment profile is unavailable."));
  }, []);

  // Step navigation
  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1 && (!name || !email || !phone)) {
      alert("Please fill in all required personal information");
      return;
    }
    if (step === 2 && (!hospital || !doctor || !date || !time)) {
      alert("Please fill in all required appointment details");
      return;
    }
    if (step === 3 && paymentMethod === "card" && (!cardNumber || !expiry || !cvv)) {
      alert("Please fill in all required payment information");
      return;
    }
    setStep(step + 1);
  };
  const prevStep = () => {
    setStep(step - 1);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const appointmentData = {
      name,
      email,
      phone,
      hospital,
      doctor,
      date,
      time,
      reason,
      paymentMethod,
      cardNumber: paymentMethod === "card" ? cardNumber : undefined,
      isFirstVisit
    };
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // remove this line if you're not using auth
        },
        body: JSON.stringify(appointmentData)
      });
      const data = await response.json();
      if (response.ok) {
        alert("Appointment booked successfully!");
        console.log("✅ Backend Response:", data);

        // reset form state
        setPhone("");
        setHospital("");
        setDoctor("");
        setDate("");
        setTime("");
        setReason("");
        setPaymentMethod("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setIsFirstVisit(true);
        setStep(1);
      } else {
        alert("Failed to book appointment. Reason: " + data.message);
        console.error("❌ Error:", data);
      }
    } catch (error) {
      console.error("🚨 Exception:", error);
      alert("Something went wrong. Check console.");
    }
  };

  // Render step progress
  const renderStepIndicator = () => <div className="flex justify-center mb-6">
    {[1, 2, 3, 4].map(s => <div key={s} className="flex items-center">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${step === s ? "bg-PrimaryColor-0 text-white" : step > s ? "bg-green-500 text-white" : "bg-gray-300"}`}>
        {s}
      </div>
      {s < 4 && <div className={`w-12 h-1 ${step > s ? "bg-green-500" : "bg-gray-300"}`}></div>}
    </div>)}
  </div>;
  const settings = {
    loop: true,
    initialSlide: 1,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    effect: "creative",
    grabCursor: true,
    creativeEffect: {
      slideShadows: false,
      prev: {
        shadow: true,
        translate: [0, 0, -400]
      },
      next: {
        translate: ["100%", 0, 0]
      }
    },
    breakpoints: {
      320: {
        slidesPerView: 1
      },
      768: {
        slidesPerView: 1
      },
      992: {
        slidesPerView: 1
      },
      1400: {
        slidesPerView: 1
      }
    }
  };
  return <section className="px-5 2xl:px-20 bg-BodyBg-0 pt-[106px] pb-[120px] relative z-10 overflow-hidden">
    <div className="absolute -z-10 -top-1/2 left-1/2 -translate-x-1/2">
      <img src={circleShape} draggable="false" className="max-w-[inherit] w-[inherit]" />
    </div>
    <div className="text-center mb-12">
      <h1 className="font-AlbertSans font-bold uppercase text-HeadingColor-0 text-xl leading-[30px] sm:text-3xl sm:leading-[40px] md:text-[40px] md:leading-[50px] lg:text-[50px] lg:leading-[60px] xl:text-[52px] xl:leading-[62px] 2xl:text-[60px] 2xl:leading-[70px]">
        Make Appointment
      </h1>
    </div>
    <div className="bg-white bg-opacity-20 border-2 border-white border-opacity-80 rounded-[30px] py-[120px]">
      <div className="Container">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center relative z-10">
          <div className="lg:mr-10 xl:mr-16 2xl:mr-[130px]" data-aos="fade-up" data-aos-duration="1000">
            <Swiper {...settings} modules={[EffectCreative]}>
              {TestiData.map(({
                id,
                testiQuote,
                testiName,
                testiProfile,
                testiDesignation,
                testiDesc
              }) => {
                return <SwiperSlide key={id}>
                  <TestimonialCard testiQuote={testiQuote} testiName={testiName} testiDesignation={testiDesignation} testiProfile={testiProfile} testiDesc={testiDesc} />
                </SwiperSlide>;
              })}
            </Swiper>
          </div>
          <div className="relative z-10 pt-10 lg:pt-0" data-aos="fade-up" data-aos-duration="1000">
            <div className="absolute -top-2 -right-[190px] xl:-right-40 2xl:-right-40">
              <img src={Heart} draggable="false" className="animate-rotateX" />
            </div>
            <h5 className="font-AlbertSans font-medium text-sm sm:text-base text-PrimaryColor-0 uppercase mb-4">
              MEDICAL APPOINTMENT
            </h5>
            <h1 className="font-AlbertSans font-bold text-HeadingColor-0 text-[16px] leading-[23px] sm:text-[22px] sm:leading-[35px] md:text-[30px] md:leading-[35px] lg:text-[28px] lg:leading-[35px] xl:text-[32px] xl:leading-[39px] 2xl:text-[32px] 2xl:leading-[39px]">
              Make an Online Appointment <br /> Booking For Treatment Patients
            </h1>
              
            {/* Step Indicator */}
            {renderStepIndicator()}
              
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 mt-9">
              {/* Step 1: Personal Information */}
              {step === 1 && <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative inline-block">
                    <input type="text" name="name" id="name" placeholder="Full Name*" required value={name} readOnly title="Your signed-in profile name" className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                    <FaUser size={"14"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5" />
                  </div>
                  <div className="relative inline-block">
                    <input type="email" name="email" id="email" placeholder="Email Address*" required value={email} readOnly title="Your signed-in account email" className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                    <HiOutlineMailOpen size={"16"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5" />
                  </div>
                </div>
                <div className="relative inline-block">
                  <input type="tel" name="phone" id="phone" placeholder="Phone Number*" required value={phone} onChange={e => setPhone(e.target.value)} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                  <MdCall size={"16"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5" />
                </div>
                    
                {/* First Visit Question */}
                <div className="bg-blue-50 bg-opacity-30 p-4 rounded-xl border border-blue-200">
                  <p className="font-medium text-HeadingColor-0 mb-3">Is this your first visit?</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="firstVisit" checked={isFirstVisit} onChange={() => setIsFirstVisit(true)} className="h-4 w-4 text-PrimaryColor-0 focus:ring-PrimaryColor-0" />
                      <span>Yes, this is my first visit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="firstVisit" checked={!isFirstVisit} onChange={() => setIsFirstVisit(false)} className="h-4 w-4 text-PrimaryColor-0 focus:ring-PrimaryColor-0" />
                      <span>No, I have visited before</span>
                    </label>
                  </div>
                  {!isFirstVisit && <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-amber-700 flex items-start gap-2">
                      <FaNotesMedical className="mt-1 flex-shrink-0" />
                      Please remember to bring your previous prescription to the appointment.
                      </p>
                    </div>}
                </div>
              </div>}

              {/* Step 2: Appointment Details */}
              {step === 2 && <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      
                  {/* Hospital Dropdown */}
                  <div className="relative inline-block">
                    <select
                      name="hospital"
                      id="hospital"
                      required
                      value={hospital}
                      onChange={e => {
                      setHospital(e.target.value);
                      setDoctor("");
                    }}
                      className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0 appearance-none"
                    >
                      <option value="">Select Hospital*</option>
                      {hospitals.map((hospitalName, index) => <option key={index} value={hospitalName}>
                          {hospitalName}
                        </option>)}
                    </select>

                    <FaHospital size={"14"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5 pointer-events-none" />
                  </div>

                  {/* Doctor Dropdown */}
                  <div className="relative inline-block">
                    <select name="doctor" id="doctor" required value={doctor} onChange={e => setDoctor(e.target.value)} disabled={!hospital} className={`font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0 appearance-none ${!hospital ? "opacity-70" : ""}`}>
                      <option value="">Select Doctor*</option>
                      {filteredDoctors.map(doc => <option key={doc._id} value={doc.fullName}>
                          {doc.fullName} ({doc.specialization})
                        </option>)}
                    </select>

                    <FaUser size={"14"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5 pointer-events-none" />
                  </div>
                </div>

                  {/* Appointment Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative inline-block">
                    <input type="date" name="date" id="date" placeholder="Appointment Date*" required value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                    <FaCalendarAlt size={"14"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5 pointer-events-none" />
                  </div>

                  <div className="relative inline-block">
                    <select name="time" id="time" required value={time} onChange={e => setTime(e.target.value)} className="font-AlbertSans text-HeadingColor-0 bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0">
                      <option value="">Select Time Slot*</option>
                      {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "14:00", "14:30", "15:00", "15:30"].map(slot => <option key={slot} value={slot}>{slot}</option>)}
                    </select>
                    <FaClock size={"14"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5 pointer-events-none" />
                  </div>
                </div>


                  {/* Insurance Input */}
                <div className="grid grid-cols-1 gap-5">
                  <div className="relative inline-block">
                    <input type="text" name="insurance" id="insurance" placeholder="Insurance Provider (Optional)" className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                    <MdLocalHospital size={"16"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5 pointer-events-none" />
                  </div>
                </div>
                </div>}


              {/* Step 3: Payment Information */}
              {step === 3 && <div className="space-y-5">
                <select name="payment_method" id="payment_method" required value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0 appearance-none">
                  <option value="">Select Payment Method*</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="insurance">Insurance</option>
                  <option value="cash">Pay at Clinic</option>
                </select>

                {paymentMethod === "card" && <div className="space-y-5">
                  <div className="relative inline-block">
                    <input type="text" name="card_number" id="card_number" placeholder="Card Number*" required value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                    <FaCreditCard size={"14"} className="absolute text-PrimaryColor-0 top-1/2 -translate-y-1/2 right-5 pointer-events-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <input type="text" name="expiry" id="expiry" placeholder="MM/YY*" required value={expiry} onChange={e => setExpiry(e.target.value)} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                    <input type="text" name="cvv" id="cvv" placeholder="CVV*" required value={cvv} onChange={e => setCvv(e.target.value)} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-xl py-2 px-6 h-[60px] w-full focus:outline-PrimaryColor-0" />
                  </div>
                </div>}

                {paymentMethod === "insurance" && <div className="p-4 bg-blue-50 bg-opacity-50 rounded-lg border border-blue-200">
                  <p className="text-PrimaryColor-0 text-center">
                    Your insurance information will be verified at the clinic. 
                    Please bring your insurance card to your appointment.
                  </p>
                </div>}

                {paymentMethod === "cash" && <div className="p-4 bg-blue-50 bg-opacity-50 rounded-lg border border-blue-200">
                  <p className="text-PrimaryColor-0 text-center">
                    Payment will be collected at the clinic during your visit.
                  </p>
                </div>}
              </div>}

              {/* Step 4: Reason and Review */}
              {step === 4 && <div className="space-y-5">
                <div className="bg-blue-50 bg-opacity-30 p-4 rounded-xl border border-blue-200">
                  <h3 className="font-bold text-lg mb-3 text-HeadingColor-0">Appointment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {name}</p>
                    <p><span className="font-medium">Email:</span> {email}</p>
                    <p><span className="font-medium">Phone:</span> {phone}</p>
                    <p><span className="font-medium">Hospital:</span> {hospitals.find(h => h.id === hospital)?.name || hospital}</p>
                    <p><span className="font-medium">Doctor:</span> {doctor}</p>
                    <p><span className="font-medium">Date:</span> {date}</p>
                    <p><span className="font-medium">Time:</span> {time}</p>
                    <p><span className="font-medium">Payment:</span> {paymentMethod === "card" ? "Credit Card" : paymentMethod === "insurance" ? "Insurance" : "Pay at Clinic"}</p>
                    <p><span className="font-medium">First Visit:</span> {isFirstVisit ? "Yes" : "No"}</p>
                    {!isFirstVisit && <p className="text-amber-700 bg-yellow-50 p-2 rounded mt-2">
                      <FaNotesMedical className="inline mr-2" />
                      Please bring your previous prescription
                      </p>}
                  </div>
                </div>
                    
                <textarea name="reason" id="reason" placeholder="Describe your health issues in detail*" required value={reason} onChange={e => setReason(e.target.value)} className="font-AlbertSans text-HeadingColor-0 placeholder:text-HeadingColor-0 font-light bg-transparent border border-Secondarycolor-0 border-opacity-45 rounded-2xl py-2 px-6 h-[150px] w-full focus:outline-PrimaryColor-0 resize-none"></textarea>
              </div>}

              {/* Navigation Buttons */}
              <div className="flex flex-wrap gap-3 mt-5">
                {step > 1 && <button type="button" onClick={prevStep} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-PrimaryColor-0 text-PrimaryColor-0 hover:bg-PrimaryColor-0 hover:text-white transition-colors duration-300">
                  <GoArrowLeft size={18} />
                  Previous
                </button>}
                  
                {step < 4 ? <button type="button" onClick={nextStep} className="primary-btn flex items-center justify-center gap-2">
                  Next Step
                  <GoArrowRight size={22} className="-rotate-45" />
                </button> : <button type="submit" className="primary-btn flex items-center justify-center gap-2">
                  Confirm Appointment
                  <GoArrowRight size={22} className="-rotate-45" />
                </button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>;
};
export default Appoinment;
