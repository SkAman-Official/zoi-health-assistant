import { createBrowserRouter } from "react-router-dom";
import MedicalDocuments from "../features/documents/MedicalDocuments";
import Main from "../Main/Main";
import Home1 from "../Pages/Home1/Home1";
import ErrorPage from "../Shared/ErrorPage/ErrorPage";
import Home2 from "../Pages/Home2/Home2";
import Main2 from "../Main/Main2";
import Main3 from "../Main/Main3";
import Home3 from "../Pages/Home3/Home3";
import AboutInner from "../Pages/InnerPage/AboutInner/AboutInner";
import ProjectDetails from "../Pages/InnerPage/ProjectDetails/ProjectDetails";
import ServiceInner from "../Pages/InnerPage/ServiceInner/ServiceInner";
import BlogDetails from "../Pages/InnerPage/BlogDetails/BlogDetails";
import ServiceDetails from "../Pages/InnerPage/ServiceDetails/ServiceDetails";
import ServiceDetails2 from "../Pages/InnerPage/ServiceDetails/ServiceDetails2";
import ServiceDetails3 from "../Pages/InnerPage/ServiceDetails/ServiceDetails3";
import ServiceDetails4 from "../Pages/InnerPage/ServiceDetails/ServiceDetails4";
import ServiceDetails5 from "../Pages/InnerPage/ServiceDetails/ServiceDetails5";
import BlogGrid from "../Pages/InnerPage/BlogGrid/BlogGrid";
import ContactInner from "../Pages/InnerPage/ContactInner/ContactInner";
import TeamInner from "../Pages/InnerPage/TeamInner/TeamInner";
import "../Pages/InnerPage/Appointment/AppointmentInner";
import ProjectInner from "../Pages/InnerPage/ProjectInner/ProjectInner";
import TestimonialInner from "../Pages/InnerPage/TestimonialInner/TestimonialInner";
import FaqInner from "../Pages/InnerPage/Faq/FaqInner";
import TeamDetails from "../Pages/InnerPage/TeamDetails/TeamDetails";
import BlogLeftSidebar from "../Pages/InnerPage/BlogLeftSidebar/BlogLeftSidebar";
import BlogRightSidebar from "../Pages/InnerPage/BlogRightSidebar/BlogRightSidebar";
import FrontPage from "../Component4/FrontPage";
import LogIn from "../Component4/LogIn";
import "../Component4/DoctorLoginForm";
import DoctorSignupForm from "../Component4/DoctorSignupForm";
import DoctorsHomePage from "../features/doctor/DoctorOverview";
import DoctorLogIn from "../Component4/DoctorLogIn";
import DoctorMain from "../Main/DoctorMain";
import AppointmentsPage from "../features/doctor/DoctorAppointments";
import PatientsPage from "../features/doctor/DoctorPatients";
import HealthLibraryPage from "../Component4/Health-Library/healthLibrary";
import HealthTopicDetails from "../Component4/Health-Library/healthTopicDetails";
import Appointment from "../Pages/InnerPage/Appointment/Appointment";

// Doctors Banner/Navbar Components :
import DoctorsProfile from "../features/doctor/DoctorProfile";
import PharmacyHome from "../ComponentPharmacy/PharmacyHome";
import PharmacyHomePage from "../ComponentPharmacy/Pages/Home";
import LabTestsPage from "../ComponentPharmacy/Pages/LabTests";
import DoctorAppointmentPage from "../ComponentPharmacy/Pages/DoctorAppointment";
import HealthInsurancePage from "../ComponentPharmacy/Pages/HealthInsurance";
import PharmacyCartPage from "../ComponentPharmacy/Pages/CartPage";
import EmergencyServices from "../ComponentEmergencyServices/EmergencyServices";
import AmbulanceServices from "../ComponentEmergencyServices/ServiceComponents/AmbulanceServices";
import HospitalBooking from "../ComponentEmergencyServices/ServiceComponents/HospitalBooking";
import BloodServices from "../ComponentEmergencyServices/ServiceComponents/BloodServices";
import PatientDetails from "../features/doctor/DoctorPatientDetails";

// Working Router.jsx :

const router = createBrowserRouter([
  {
    path: "/",
    // Standalone landing page
    element: <FrontPage /> // FrontPage renders for the root path
  },
  {
    path: "/login",
    // LogIn page
    element: <LogIn /> // Render the LogIn component
  },
  // Add doctor auth routes
  {
    path: "/doctor-login",
    element: <DoctorLogIn />
  },
  {
    path: "/doctor-signup",
    element: <DoctorSignupForm /> // Corrected: should be DoctorSignupForm
  },
  // Doctor portal routes
  {
    path: "/doctor-portal",
    element: <DoctorMain />,
    children: [{
      index: true,
      element: <DoctorsHomePage />
    }, {
      path: "dashboard",
      element: <DoctorsHomePage />
    }, {
      path: "appointments",
      element: <AppointmentsPage />
    }, {
      path: "patients",
      element: <PatientsPage />
    }, {
      path: "profile",
      element: <DoctorsProfile />
    }, {
      path: "profile/edit",
      element: <DoctorsProfile edit />
    }, {
      path: "patients/:patientId",
      element: <PatientDetails />
    } // 👈 New route added
    ]
  },
  // Health Library routes
  {
    path: "/health-library",
    // Health Library page
    element: <HealthLibraryPage /> // Render the Health Library page
  },
  {
    path: "/health-library/:id",
    // Dynamic route for Health Topic details
    element: <HealthTopicDetails /> // Render details for specific health topic
  },
  // Home layout with nested routes for various pages
  {
    path: "/home",
    // Main layout for Home1 and other pages
    element: <Main />,
    children: [{
      path: "",
      element: <Home1 />
    },
    // Default homepage
    {
      path: "health-library",
      element: <HealthLibraryPage />
    }, {
      path: "documents",
      element: <MedicalDocuments />
    }, {
      path: "about",
      element: <AboutInner />
    }, {
      path: "project_details",
      element: <ProjectDetails />
    }, {
      path: "service",
      element: <ServiceInner />
    }, {
      path: "/home/service_details",
      element: <ServiceDetails />
    }, {
      path: "service_details2",
      element: <ServiceDetails2 />
    }, {
      path: "service_details3",
      element: <ServiceDetails3 />
    }, {
      path: "service_details4",
      element: <ServiceDetails4 />
    }, {
      path: "service_details5",
      element: <ServiceDetails5 />
    }, {
      path: "project",
      element: <ProjectInner />
    }, {
      path: "testimonial",
      element: <TestimonialInner />
    }, {
      path: "team",
      element: <TeamInner />
    }, {
      path: "team_details",
      element: <TeamDetails />
    }, {
      path: "blog_grid",
      element: <BlogGrid />
    }, {
      path: "blog_left_sidebar",
      element: <BlogLeftSidebar />
    }, {
      path: "blog_right_sidebar",
      element: <BlogRightSidebar />
    }, {
      path: "blog_details",
      element: <BlogDetails />
    }, {
      path: "appointment",
      element: <Appointment />
    },
    // Appointment page
  
    // Pharmacy route nested under /home, to be accessed as /home/pharmacy
    // { path: "pharmacy/*", element: <PharmacyHome /> },
    {
      path: "pharmacy",
      element: <PharmacyHome />,
      children: [{
        path: "",
        element: <PharmacyHomePage />
      }, {
        path: "lab",
        element: <LabTestsPage />
      }, {
        path: "doctor",
        element: <DoctorAppointmentPage />
      }, {
        path: "insurance",
        element: <HealthInsurancePage />
      }, {
        path: "cart",
        element: <PharmacyCartPage />
      }]
    },
    // Add Emergency Services route
    {
      path: "emergency-services",
      element: <EmergencyServices />
    }, {
      path: "emergency-services/ambulance",
      element: <AmbulanceServices />
    }, {
      path: "emergency-services/hospital-booking",
      element: <HospitalBooking />
    }, {
      path: "emergency-services/blood",
      element: <BloodServices />
    }, {
      path: "faqs",
      element: <FaqInner />
    }, {
      path: "contact",
      element: <ContactInner />
    }]
  },
  // Other home pages
  {
    path: "/home2",
    element: <Main2 />,
    children: [{
      path: "",
      element: <Home2 />
    }]
  },
  {
    path: "/home3",
    element: <Main3 />,
    children: [{
      path: "",
      element: <Home3 />
    }]
  },
  // Catch-all for undefined routes
  {
    path: "*",
    errorElement: <ErrorPage />
  }
]);

export default router;
