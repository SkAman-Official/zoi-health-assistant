import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const DoctorSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    licenseNumber: "",
    specialization: "",
    password: "",
    hospital: ""
  });
  const specializations = ["General Practice", "Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "Neurology", "Oncology", "Gastroenterology"];
  const hospitals = ["Apollo Hospital", "Fortis Hospital", "Max Healthcare", "Narayana Multi-Speciality Hospital", "AIIMS"];

  // DoctorSignupForm.jsx - Updated handleSubmit
  const handleSubmit = async e => {
    e.preventDefault();

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      // Create a copy of formData WITHOUT confirmPassword
      const {
        confirmPassword,
        ...dataToSend
      } = formData;

      // Send only necessary data to backend
      await axios.post("/api/auth/doctor/signup", dataToSend);

      // Success handling
      alert("Registration successful! You can now log in.");

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        licenseNumber: "",
        specialization: "",
        password: "",
        confirmPassword: "",
        hospital: ""
      });

      // Redirect to login
      setTimeout(() => navigate("/doctor-login"), 3000);
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message || "Registration failed. Please try again.";
      alert(`Registration failed: ${errorMessage}`);
      console.error("Signup Error Details:", {
        error: error.response?.data,
        request: error.config
      });
    }
  };
  return <div className="p-8">
    <h1 className="text-5xl font-bold text-indigo-600">
      Doctor Registration
    </h1>
    <form onSubmit={handleSubmit} className="mt-8">
      {/* Full Name */}
      <div className="relative mb-6">
        <input
          type="text"
          value={formData.fullName}
          onChange={e => setFormData({
          ...formData,
          fullName: e.target.value
        })}
          placeholder="Full Name"
          className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
          required
        />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Full Name
        </label>
      </div>

      {/* Email */}
      <div className="relative mb-6">
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({
          ...formData,
          email: e.target.value
        })}
          placeholder="Email"
          className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
          required
        />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Professional Email
        </label>
      </div>

      {/* License Number */}
      <div className="relative mb-6">
        <input
          type="text"
          value={formData.licenseNumber}
          onChange={e => setFormData({
          ...formData,
          licenseNumber: e.target.value
        })}
          placeholder="License Number"
          className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
          required
        />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Medical License Number
        </label>
      </div>


      {/* HOSPITAL */}
      <div className="relative mb-6">
        <select
          value={formData.hospital}
          onChange={e => setFormData({
          ...formData,
          hospital: e.target.value
        })}
          className="peer h-10 w-full border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 appearance-none"
          required
        >
          <option value="">Select Hospital</option>
          {hospitals.map(hospital => <option key={hospital} value={hospital} className="py-2">
            {hospital}
          </option>)}
        </select>
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Hospital
        </label>
        <div className="absolute right-0 top-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>


      {/* Specialization Dropdown */}
      <div className="relative mb-6">
        <select
          value={formData.specialization}
          onChange={e => setFormData({
          ...formData,
          specialization: e.target.value
        })}
          className="peer h-10 w-full border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-indigo-600 appearance-none"
          required
        >
          <option value="">Select Specialization</option>
          {specializations.map(spec => <option key={spec} value={spec} className="py-2">
            {spec}
          </option>)}
        </select>
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Specialization
        </label>
        <div className="absolute right-0 top-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Password */}
      <div className="relative mb-6">
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({
          ...formData,
          password: e.target.value
        })}
          placeholder="Password"
          className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
          required
        />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Password
        </label>
      </div>

      {/* Confirm Password */}
      <div className="relative mb-6">
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData({
          ...formData,
          confirmPassword: e.target.value
        })}
          placeholder="Confirm Password"
          className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600"
          required
        />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Confirm Password
        </label>
      </div>

      <button type="submit" className="w-full py-2 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition">
        Create Account
      </button>

      {/* Patient redirection */}
      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Not a doctor?{" "}
          <Link to="/login" className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium">
            Patient Login/Signup
          </Link>
        </p>
      </div>
    </form>
  </div>;
};
export default DoctorSignupForm;
