import { Link } from "react-router-dom";
import { FiUsers, FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useDoctorPortal } from "./doctorContext";
import { summarizeAppointments } from "./doctorData";
import AppointmentList from "./AppointmentList";
import PortalState from "./PortalState";
const COLORS = ["#f59e0b", "#fb923c", "#8b5cf6", "#3b82f6", "#10b981", "#f43f5e"];
export default function DoctorOverview() {
  const {
    doctor,
    appointments,
    loading,
    lastUpdated
  } = useDoctorPortal();
  const summary = summarizeAppointments(appointments);
  const stats = [["Total patients", summary.patients, FiUsers, "bg-blue-50 text-blue-600"], ["Today's appointments", summary.today, FiCalendar, "bg-cyan-50 text-cyan-600"], ["Awaiting approval", summary.pending, FiClock, "bg-amber-50 text-amber-600"], ["Completed appointments", summary.completed, FiCheckCircle, "bg-emerald-50 text-emerald-600"]];
  return <div className="doctor-page">
    <div className="doctor-page-heading"><div><h1>Practice overview</h1><p>{doctor?.hospital || "Your appointments and patients, in one place."}</p></div>
      <Link to="/doctor-portal/appointments?status=awaiting" className="doctor-button bg-white text-blue-700">Review requests</Link></div>
    <PortalState />
    {!loading && lastUpdated && <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map(([label, value, Icon, color]) => <div key={label} className="doctor-surface flex justify-between items-center gap-3">
        <div><p className="text-sm text-slate-500">{label}</p><p className="text-3xl font-bold text-slate-800 mt-2">{value}</p></div><div className={`p-3 rounded-xl ${color}`}><Icon size={24} /></div>
      </div>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="doctor-surface"><h2 className="font-semibold text-lg text-slate-800">Weekly appointments</h2><p className="text-xs text-slate-500 mt-1 mb-5">Last seven scheduled dates · all statuses · IST</p>
          <div className="h-64" role="img" aria-label={summary.week.map(day => `${day.day}: ${day.appointments}`).join(", ")}>
            <ResponsiveContainer width="100%" height="100%"><LineChart
              data={summary.week}
              margin={{
                left: -24,
                right: 12,
                top: 10
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} /><Tooltip />
              <Line
                type="monotone"
                dataKey="appointments"
                name="Appointments"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 3
                }}
                isAnimationActive={false}
              />
            </LineChart></ResponsiveContainer>
          </div>
        </section>
        <section className="doctor-surface"><h2 className="font-semibold text-lg text-slate-800">Appointment status</h2><p className="text-xs text-slate-500 mt-1 mb-5">Your recorded appointments</p>
          {summary.statuses.length ? <div className="h-64" role="img" aria-label={summary.statuses.map(item => `${item.name}: ${item.value}`).join(", ")}>
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={summary.statuses} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3} isAnimationActive={false}>
              {summary.statuses.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend
                wrapperStyle={{
                  fontSize: 12
                }}
              /></PieChart></ResponsiveContainer>
          </div> : <div className="doctor-empty min-h-64 flex flex-col justify-center"><FiCalendar /><h3>No appointment activity yet</h3><p>Your status breakdown appears after the first booking.</p></div>}
        </section>
      </div>
      <section className="doctor-surface"><div className="doctor-section-heading"><div><h2>Upcoming appointments</h2><p className="text-sm text-slate-500 mt-1">Your next six appointments · India time</p></div>
        <Link to="/doctor-portal/appointments" className="doctor-button doctor-button-secondary">View all appointments</Link></div>
        <AppointmentList appointments={summary.upcoming.slice(0, 6)} emptyTitle="Your schedule is clear" emptyText="Upcoming appointments appear here when patients book with you." />
      </section>
    </div>}
  </div>;
}
