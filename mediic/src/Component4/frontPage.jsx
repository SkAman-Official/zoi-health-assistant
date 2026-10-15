import "react";
import { Link } from "react-router-dom";
import backgroundImage from "../Assets/Images/frontBG.jpg"; // Replace with the path to your background image

function FrontPage() {
  return <div
    className="flex flex-col items-center justify-center h-screen bg-center bg-no-repeat"
    style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "100%" // Adjust this value to zoom out
  }}
  >
    {/* Div for Text */}
    <div className="bg-white p-8 rounded-lg text-center shadow-lg">
      <h1 className="text-5xl font-extrabold mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500">
          Zoí -
        </span>{" "}
        Health App
      </h1>
      <p className="mt-4 text-xl text-gray-600">
        Your health is our priority!
      </p>
    </div>

    {/* Button to Navigate */}
    <Link to="/login" className="mt-4">
      {" "}
      {/* Updated to navigate to /login */}
      <button className="text-black bg-blue-200 py-2 px-4 rounded transition-all duration-300 ease-in-out hover:scale-110 hover:bg-blue-400 hover:text-white">
        Take Me There!
      </button>
    </Link>
  </div>;
}
export default FrontPage;
