import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const SigninForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // ✅ CORRECTED ENDPOINT
      const response = await axios.post("/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", response.data.token);
      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };
  return <div className="p-8">
    <h1 className="text-5xl font-bold text-indigo-600">Welcome back!</h1>
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="relative mb-6">
        <input type="text" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600" />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Email Address
        </label>
      </div>
      <div className="relative mb-6">
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600" />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Password
        </label>
      </div>
      <button type="submit" className="w-full py-2 px-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition">
        Sign In
      </button>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Are you a doctor?
          <Link to="/doctor-login" className="ml-1 text-teal-600 hover:text-teal-700 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </form>
  </div>;
};
export default SigninForm;
