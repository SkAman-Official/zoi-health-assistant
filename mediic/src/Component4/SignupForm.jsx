import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password
      });
      alert("Signup successful! Please log in.");
    } catch (error) {
      console.error("Signup request failed:", error.response?.status || error.code);
      alert("Signup failed: " + (typeof error.response?.data === "string" ? error.response.data : error.response?.data?.message || error.message));
    }
  };
  return <div className="p-8">
    <h1 className="text-5xl font-bold text-indigo-600">Create account</h1>
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="relative mb-6">
        <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="peer h-10 w-full border-b-2 border-gray-300 placeholder-transparent focus:outline-none focus:border-indigo-600" />
        <label className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm">
          Name
        </label>
      </div>
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
        Sign Up
      </button>

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Are you a medical professional?
          <Link to="/doctor-login" className="ml-1 text-teal-600 hover:text-teal-700 font-medium">
            Register as a Doctor
          </Link>
        </p>
      </div>
    </form>
  </div>;
};
export default SignupForm;
