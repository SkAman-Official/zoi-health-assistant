// src/components/RecentAppointments.jsx
import "react";
const RecentAppointments = () => {
  const appointments = [{
    id: 1,
    patientName: "John Doe",
    date: "2025-05-14",
    status: "Confirmed"
  }, {
    id: 2,
    patientName: "Jane Smith",
    date: "2025-05-15",
    status: "Pending"
  }, {
    id: 3,
    patientName: "Robert Brown",
    date: "2025-05-16",
    status: "Confirmed"
  }];
  return <div className="bg-white shadow-lg rounded-xl p-6 mt-8 mx-4 md:mx-10">
    <h2 className="text-2xl font-semibold mb-6">Recent Appointments</h2>
    <div className="space-y-4">
      {appointments.map(appointment => <div key={appointment.id} className="flex justify-between items-center p-4 border rounded-lg shadow-sm">
        <div>
          <p className="font-medium">{appointment.patientName}</p>
          <p className="text-sm text-gray-500">{appointment.date}</p>
        </div>
        <span className={`px-3 py-1 rounded-lg text-white ${appointment.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"}`}>
          {appointment.status}
        </span>
      </div>)}
    </div>
  </div>;
};
export default RecentAppointments;
