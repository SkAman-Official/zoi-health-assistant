import "react";
import { useParams } from "react-router-dom";
import healthTopicsData from "../../Data/healthTopics.json"; // Importing health topics data

const HealthTopicDetails = () => {
  const {
    id
  } = useParams(); // Extract the topic ID from the URL
  const topic = healthTopicsData.find(item => item.id === parseInt(id));
  if (!topic) {
    return <div>Topic not found</div>;
  }
  return <div className="px-6 py-12 min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50">
    {/* Disease name header with rounded corners, shadow, and hover effect */}
    <div className="bg-sky-400 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 mb-6 max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-bold">{topic.name}</h2>
    </div>

    <div className="flex justify-between items-start max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Left section with text */}
      <div className="flex-1 pr-8">
        <h3 className="text-2xl font-semibold text-sky-400 mb-4">Symptoms</h3>
        <ul className="list-disc pl-6 mb-6">
          {topic.symptoms.map((symptom, index) => <li key={index} className="text-lg text-gray-600">
            {symptom}
          </li>)}
        </ul>

        <h3 className="text-2xl font-semibold text-sky-400 mb-4">
          Home Remedies
        </h3>
        <ul className="list-disc pl-6 mb-6">
          {topic.home_remedies.map((remedy, index) => <li key={index} className="text-lg text-gray-600">
            {remedy}
          </li>)}
        </ul>
      </div>

      {/* Right section with video */}
      <div className="flex-none w-1/3">
        <h3 className="text-2xl font-semibold text-sky-400 mb-4">Video</h3>
        <div className="overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
          <iframe width="100%" height="300" src={topic.video_url} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </div>
  </div>;
};
export default HealthTopicDetails;
