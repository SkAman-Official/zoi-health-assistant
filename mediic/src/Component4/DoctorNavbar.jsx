import { useNavigate, Link } from "react-router-dom";
const DoctorNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem("doctorToken");

    // Clear any doctor-related data
    localStorage.removeItem("doctorData");

    // Redirect to doctor login
    navigate("/doctor-login");

    // Force refresh to clear memory state (optional)
    window.location.reload();
  };
  return <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/doctor-dashboard" className="flex items-center">
          <span className="text-2xl font-bold text-teal-600">Zoi MD</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/doctor-dashboard" className="text-gray-600 hover:text-teal-600 transition">
            Dashboard
          </Link>
          <Link to="/doctor-dashboard/appointments" className="text-gray-600 hover:text-teal-600 transition">
            Appointments
          </Link>
          <Link to="/doctor-dashboard/patients" className="text-gray-600 hover:text-teal-600 transition">
            Patients
          </Link>
          <Link to="/doctor-dashboard/profile" className="text-gray-600 hover:text-teal-600 transition">
            Profile
          </Link>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm font-medium">
          Log Out
        </button>
      </div>
    </div>
  </nav>;
};
export default DoctorNavbar;
