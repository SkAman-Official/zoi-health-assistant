// src/components/DashboardSummary.jsx
import "react";
const DashboardSummary = () => {
  // Mock stats data (replace with real data from your backend if needed)
  const stats = [{
    title: "Appointments Today",
    value: 5
  }, {
    title: "Total Patients",
    value: 23
  }, {
    title: "Prescriptions Given",
    value: 48
  }, {
    title: "Average Rating",
    value: "4.9/5"
  }];
  return <div className="bg-white shadow-lg rounded-xl p-6 mt-8 mx-4 md:mx-10">
    <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => <div key={index} className="bg-gray-100 p-4 rounded-lg text-center border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700">{stat.title}</h3>
        <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
      </div>)}
    </div>
  </div>;
};
export default DashboardSummary;
