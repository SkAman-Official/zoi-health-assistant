// src/components/KPIStats.jsx
import "react";
import CountUp from "react-countup";
const KPIStats = () => {
  return <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 mx-4 md:mx-10">
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="text-lg font-medium text-gray-700">Total Appointments</p>
      <h3 className="text-3xl font-bold text-blue-500">
        <CountUp end={120} duration={2.5} />
      </h3>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="text-lg font-medium text-gray-700">Total Patients</p>
      <h3 className="text-3xl font-bold text-green-500">
        <CountUp end={230} duration={2.5} />
      </h3>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="text-lg font-medium text-gray-700">Appointments Today</p>
      <h3 className="text-3xl font-bold text-orange-500">
        <CountUp end={5} duration={2.5} />
      </h3>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
      <p className="text-lg font-medium text-gray-700">Missed Appointments</p>
      <h3 className="text-3xl font-bold text-red-500">
        <CountUp end={1} duration={2.5} />
      </h3>
    </div>
  </div>;
};
export default KPIStats;
