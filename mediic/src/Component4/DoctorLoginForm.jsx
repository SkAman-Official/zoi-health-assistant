import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
const DoctorLoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/doctor/login", {
        email: email.trim(),
        password
      });

      // Normalize id to _id
      const normalizedDoctor = {
        ...response.data.doctor,
        _id: response.data.doctor.id
      };
      localStorage.setItem("doctorToken", response.data.token);
      localStorage.setItem("doctorData", JSON.stringify(normalizedDoctor));
      localStorage.setItem("doctorName", response.data.doctor.fullName);
      toast.success("Login successful!"); // ✅ Toast success

      navigate("/doctor-portal");
    } catch (error) {
      toast.error("Login failed: " + (error.response?.data?.message || error.message)); // ✅ Toast error
    }
  };
  return <div className="p-8">
    <h1 className="text-5xl font-bold text-indigo-600">Doctor Login</h1>
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="relative mb-6">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600" placeholder="Email" />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Professional Email
        </label>
      </div>
      <div className="relative mb-6">
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600" placeholder="Password" />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Password
        </label>
      </div>
      <button type="submit" className="w-full py-2 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition">
        Access Medical Dashboard
      </button>
      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Not a doctor?{" "}
          <Link to="/login" className="ml-1 text-indigo-600 hover:text-indigo-700 font-medium">
            Go to Patient Login
          </Link>
        </p>
      </div>
    </form>
  </div>;
};
export default DoctorLoginForm;
