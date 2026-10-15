// Working design :

// src/ComponentEmergencyServices/EmergencyServices.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAmbulance, FaHospital, FaTint, FaHeartbeat, FaPhoneAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
const EmergencyServices = () => {
  useEffect(() => {
    // Add emergency animation styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.03); }
        100% { transform: scale(1); }
      }
      .emergency-pulse {
        animation: pulse 2s infinite;
      }
      .card-hover {
        transition: all 0.3s ease;
      }
      .card-hover:hover {
        transform: translateY(-8px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      .emergency-flash {
        animation: flash 1.5s infinite;
      }
      @keyframes flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-12 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      {/* Hero Section with Emergency Alert */}
      <motion.div
        className="text-center mb-16"
        initial={{
        opacity: 0,
        y: -20
      }}
        animate={{
        opacity: 1,
        y: 0
      }}
        transition={{
        duration: 0.5
      }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          initial={{
          scale: 0.95
        }}
          animate={{
          scale: 1
        }}
          transition={{
          duration: 0.3,
          delay: 0.2
        }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            Emergency Medical Services
          </span>
        </motion.h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Immediate access to critical care services when every second counts
        </p>
          
        <motion.div
          className="mt-8 bg-red-600 text-white p-4 rounded-xl inline-block emergency-pulse shadow-lg"
          initial={{
          scale: 0.9
        }}
          animate={{
          scale: 1
        }}
          transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
          delay: 0.4
        }}
        >
          <div className="flex items-center justify-center gap-3">
            <FaPhoneAlt className="text-xl" />
            <p className="font-bold text-xl">Emergency Helpline: +91 700 369 7337</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Service Cards with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Ambulance Services Card */}
        <ServiceCard icon={<FaAmbulance className="text-white" />} title="Emergency Ambulance Services" description="Immediate ambulance dispatch with paramedics and life-saving equipment" buttonText="Request Ambulance" color="red" path="/home/emergency-services/ambulance" delay={0.1} />
          
        {/* Hospital Booking Card */}
        <ServiceCard icon={<FaHospital className="text-white" />} title="Emergency Hospital Booking" description="Instant hospital bed reservation and priority admission" buttonText="Find Hospital" color="blue" path="/home/emergency-services/hospital-booking" delay={0.2} />
          
        {/* Blood Services Card */}
        <ServiceCard icon={<FaTint className="text-white" />} title="Emergency Blood Services" description="Urgent blood requests and donor matching" buttonText="Request Blood" color="purple" path="/home/emergency-services/blood" delay={0.3} />
      </div>

      {/* Critical Warning Section */}
      <motion.div
        className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-6 mb-12 shadow-xl"
        initial={{
        opacity: 0
      }}
        animate={{
        opacity: 1
      }}
        transition={{
        delay: 0.6
      }}
      >
        <div className="flex items-center gap-4 mb-4">
          <FaExclamationTriangle className="text-3xl" />
          <h2 className="text-2xl font-bold">Critical Warning Signs</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {["Chest Pain", "Breathing Difficulty", "Severe Bleeding", "Unconsciousness", "Stroke Symptoms", "Severe Burns"].map((item, index) => <motion.div
            key={index}
            className="bg-red-400/20 backdrop-blur-sm p-3 rounded-lg text-center emergency-flash"
            initial={{
            scale: 0.8
          }}
            animate={{
            scale: 1
          }}
            transition={{
            type: "spring",
            delay: 0.7 + index * 0.05
          }}
          >
            {item}
          </motion.div>)}
        </div>
      </motion.div>

      {/* Additional Emergency Resources */}
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100"
        initial={{
        opacity: 0,
        y: 20
      }}
        animate={{
        opacity: 1,
        y: 0
      }}
        transition={{
        delay: 0.8
      }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Emergency Resources</h2>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ResourceSection title="First Aid Instructions" items={["CPR: 30 chest compressions + 2 breaths", "Choking: Perform Heimlich maneuver", "Bleeding: Apply direct pressure", "Burns: Cool with running water", "Fractures: Immobilize the injury", "Poisoning: Call poison control immediately"]} icon={<FaHeartbeat className="text-red-500 text-2xl" />} />
            
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaHospital className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nearest Hospitals</h3>
            </div>
            <div className="space-y-4">
              {[{
                name: "Apollo Hospital",
                distance: "2.5 km",
                phone: "+91 33 2320 3040"
              }, {
                name: "AMRI Hospital",
                distance: "3.8 km",
                phone: "+91 33 6680 0000"
              }, {
                name: "Fortis Hospital",
                distance: "5.2 km",
                phone: "+91 33 6628 4444"
              }].map((hospital, index) => <div key={index} className="flex justify-between items-center pb-3 border-b border-blue-100">
                <div>
                  <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                  <p className="text-sm text-gray-600">{hospital.distance} away</p>
                </div>
                <a href={`tel:${hospital.phone}`} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                  Call
                </a>
              </div>)}
            </div>
            <Link to="/home/contact" className="mt-4 inline-block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              View All Hospitals
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Emergency Contact Banner */}
      <motion.div
        className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-8 text-center shadow-xl"
        initial={{
        opacity: 0
      }}
        animate={{
        opacity: 1
      }}
        transition={{
        delay: 1
      }}
      >
        <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="tel:+917003697337" className="bg-white text-red-600 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <FaPhoneAlt /> Call Emergency: +91 700 369 7337
            </div>
          </a>
          <Link to="/home/contact" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-700/50 transition-all transform hover:scale-105">
            Contact Nearby Hospitals
          </Link>
        </div>
      </motion.div>
    </div>
  </div>;
};

// Service Card Component with animations
const ServiceCard = ({
  icon,
  title,
  description,
  buttonText,
  color,
  path,
  delay = 0
}) => {
  const colorClasses = {
    red: "bg-gradient-to-br from-red-500 to-red-700",
    blue: "bg-gradient-to-br from-blue-500 to-blue-700",
    purple: "bg-gradient-to-br from-purple-500 to-purple-700"
  };
  const buttonClasses = {
    red: "bg-white text-red-600 hover:bg-red-50",
    blue: "bg-white text-blue-600 hover:bg-blue-50",
    purple: "bg-white text-purple-600 hover:bg-purple-50"
  };
  return <motion.div
    initial={{
    opacity: 0,
    y: 30
  }}
    animate={{
    opacity: 1,
    y: 0
  }}
    transition={{
    delay,
    duration: 0.5
  }}
    className={`card-hover rounded-2xl overflow-hidden shadow-xl h-full flex flex-col ${colorClasses[color]}`}
  >
    <div className="p-6 text-white flex flex-col h-full">
      <div className="mb-4">
        <div className="bg-white/20 p-4 rounded-full inline-flex items-center justify-center">
          <div className="text-3xl">{icon}</div>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="mb-6 flex-grow opacity-90">{description}</p>
      <Link to={path} className={`mt-auto inline-block w-full text-center py-3 rounded-lg font-bold transition-all transform hover:scale-105 shadow-md ${buttonClasses[color]}`}>
        {buttonText}
      </Link>
    </div>
      
    {/* Animated waves at bottom */}
    <div className="relative h-4 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-8 bg-white/10">
        {[...Array(5)].map((_, i) => <div
          key={i}
          className="absolute bottom-0"
          style={{
          left: `${i * 20}%`,
          width: '40px',
          height: '20px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          animation: `wave 12s infinite linear`,
          animationDelay: `${i * 0.5}s`
        }}
        ></div>)}
      </div>
    </div>
  </motion.div>;
};

// Resource Section Component
const ResourceSection = ({
  title,
  items,
  icon
}) => <motion.div
  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100"
  whileHover={{
  y: -5
}}
>
  <div className="flex items-center gap-3 mb-4">
    {icon}
    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
  </div>
  <ul className="space-y-3">
    {items.map((item, index) => <motion.li
      key={index}
      className="flex items-start bg-white/70 p-3 rounded-lg border border-red-100"
      whileHover={{
      x: 5
    }}
      transition={{
      type: "spring",
      stiffness: 300
    }}
    >
      <span className="text-red-600 mr-2 font-bold">•</span>
      <span className="text-gray-700">{item}</span>
    </motion.li>)}
  </ul>
</motion.div>;
export default EmergencyServices;
