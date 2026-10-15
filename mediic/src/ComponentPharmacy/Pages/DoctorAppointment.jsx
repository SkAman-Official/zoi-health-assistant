// src/pages/DoctorAppointment.jsx
const DoctorAppointment = () => <div>
  <h2 className="text-2xl font-bold mb-4">Doctor Appointment</h2>
  <form className="space-y-4 max-w-md">
    <input type="text" placeholder="Your Name" className="border p-2 w-full" />
    <input type="date" className="border p-2 w-full" />
    <input type="time" className="border p-2 w-full" />
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Book Appointment
    </button>
  </form>
</div>;
export default DoctorAppointment;
