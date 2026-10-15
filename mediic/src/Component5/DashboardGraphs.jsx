// src/components/DashboardGraphs.jsx
import "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart, Bar } from "recharts";
const DashboardGraphs = () => {
  // Sample data for the charts
  const lineData = [{
    name: "Jan",
    appointments: 5
  }, {
    name: "Feb",
    appointments: 8
  }, {
    name: "Mar",
    appointments: 12
  }, {
    name: "Apr",
    appointments: 15
  }, {
    name: "May",
    appointments: 20
  }];
  const barData = [{
    name: "Mon",
    value: 5
  }, {
    name: "Tue",
    value: 8
  }, {
    name: "Wed",
    value: 10
  }, {
    name: "Thu",
    value: 7
  }, {
    name: "Fri",
    value: 12
  }, {
    name: "Sat",
    value: 9
  }, {
    name: "Sun",
    value: 11
  }];
  return <div className="bg-white shadow-lg rounded-xl p-6 mt-8 mx-4 md:mx-10">
    <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

    {/* Line Chart */}
    <div className="mb-8">
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Appointments Trend (Monthly)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="appointments" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Bar Chart */}
    <div>
      <h3 className="text-xl font-medium text-gray-700 mb-4">
        Appointments per Day
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>;
};
export default DashboardGraphs;
