import { useState } from "react";
import { Link } from "react-router-dom";
import healthTopicsData from "../../Data/healthTopics.json"; // Importing health topics data

const HealthLibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Static data from the JSON file
  const healthTopics = healthTopicsData;

  // Filter topics based on search input
  const filteredTopics = healthTopics.filter(topic => topic.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
  // <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
  //   {/* Header with Background Image */}
  //   <div className="relative h-[350px] text-white text-center flex flex-col justify-center bg-cover bg-center">
  //     <div className="bg-sky-400 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 max-w-3xl mx-auto mb-6">
  //       <h1 className="text-5xl font-extrabold">{`Health Library`}</h1>
  //     </div>
  //     <p className="text-xl text-yellow-200 max-w-2xl mx-auto opacity-80 animate__animated animate__fadeIn animate__delay-1s">
  //       Sometimes a diagnostic is just a search away...
  //     </p>
  //   </div>

    <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 min-h-screen">
      {/* Header with Background Image */}
      <div className="relative h-[350px] text-white text-center flex flex-col justify-center bg-cover bg-center">
        <div className="relative z-10 flex justify-center">
          {/* Heading Box with Border, Shadow, and Hover Effect */}
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-blue-500 border-2 border-transparent">
            <h1 className="text-5xl text-blue-600 font-extrabold mb-4 animate__animated animate__fadeIn animate__delay-1s">
              Health Library
            </h1>
            <p className="text-xl text-gray-500 opacity-80 animate__animated animate__fadeIn animate__delay-2s">
              Sometimes a diagnostic is just a search away...
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center -mt-12 mb-12 px-4 animate__animated animate__fadeIn animate__delay-2s">
        <div className="flex items-center bg-white p-4 rounded-full shadow-lg border border-blue-300 max-w-3xl w-full transition-all duration-300 hover:shadow-2xl hover:border-blue-500">
          <input type="text" placeholder="Search for a disease, symptom, or treatment..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg" />
          <button className="bg-green-600 text-white py-2 px-4 rounded-full ml-4 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105" onClick={() => console.log("Search Query:", searchQuery)}>
            Search
          </button>
        </div>
      </div>

      {/* Health Topics */}
      <div className="px-6 pb-10">
        <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center animate__animated animate__fadeIn animate__delay-3s">
          Explore Health Topics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredTopics.length > 0 ? filteredTopics.map(topic => <div key={topic.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              {topic.name}
            </h3>
            <p className="text-gray-700 mb-4">{topic.description}</p>
            <Link to={`/health-library/${topic.id}`}>
              <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-300 transform hover:scale-105">
                Read More
              </button>
            </Link>
          </div>) : <p className="text-gray-500 text-center col-span-full">
            No topics found. Try searching for something else.
          </p>}
        </div>
      </div>
    </div>
  );
};
export default HealthLibraryPage;
