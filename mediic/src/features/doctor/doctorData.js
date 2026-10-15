export const PENDING_STATUSES = ["Scheduled", "Pending", "Rescheduled"];
export const APPOINTMENT_STATUSES = [...PENDING_STATUSES, "Approved", "Completed", "Rejected"];
export const patientName = appointment => appointment.userId?.name || appointment.name || "Patient account unavailable";
export const patientId = appointment => appointment.userId?._id || null;
export const initials = (name = "") => name.trim().split(/\s+/u).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "—";
export const todayIST = (now = new Date()) => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
}).format(now);
export const appointmentTime = appointment => Date.parse(`${appointment.date}T${appointment.time}:00+05:30`);
export function formatDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return "Date unavailable";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value ? new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date) : "Date unavailable";
}
export function formatTime(value) {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/u.test(value)) return "Time unavailable";
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}
export function isUpcoming(appointment, now = new Date()) {
  return [...PENDING_STATUSES, "Approved"].includes(appointment.status) && appointmentTime(appointment) >= now.getTime();
}
export function summarizeAppointments(appointments, now = new Date()) {
  const today = todayIST(now);
  const week = Array.from({
    length: 7
  }, (_, index) => {
    const date = new Date(`${today}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() - 6 + index);
    const iso = date.toISOString().slice(0, 10);
    return {
      date: iso,
      day: date.toLocaleDateString("en-IN", {
        weekday: "short",
        timeZone: "UTC"
      }),
      appointments: appointments.filter(appointment => appointment.date === iso).length
    };
  });
  return {
    patients: new Set(appointments.map(patientId).filter(Boolean)).size,
    today: appointments.filter(appointment => appointment.date === today && appointment.status !== "Rejected").length,
    pending: appointments.filter(appointment => PENDING_STATUSES.includes(appointment.status)).length,
    completed: appointments.filter(appointment => appointment.status === "Completed").length,
    upcoming: appointments.filter(appointment => isUpcoming(appointment, now)).sort((a, b) => appointmentTime(a) - appointmentTime(b)),
    week,
    statuses: APPOINTMENT_STATUSES.map(status => ({
      name: status,
      value: appointments.filter(appointment => appointment.status === status).length
    })).filter(item => item.value)
  };
}
export function filterAppointments(appointments, {
  search = "",
  status = "all",
  scope = "all",
  sort = "date-desc"
} = {}, now = new Date()) {
  const query = search.trim().toLowerCase();
  return appointments.filter(appointment => (status === "all" || appointment.status === status) && (scope === "all" || (scope === "today" ? appointment.date === todayIST(now) : isUpcoming(appointment, now))) && (!query || `${patientName(appointment)} ${appointment._id}`.toLowerCase().includes(query))).sort((a, b) => sort === "name" ? patientName(a).localeCompare(patientName(b)) : `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`) * (sort === "date-asc" ? 1 : -1));
}
export function summarizePatients(appointments, now = new Date()) {
  const patients = new Map();
  for (const appointment of [...appointments].sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)))) {
    const id = patientId(appointment);
    if (!id) continue;
    if (!patients.has(id)) patients.set(id, {
      id,
      name: patientName(appointment),
      email: appointment.userId.email || appointment.email || "Not provided",
      phone: appointment.userId.phone || appointment.phone || "Not provided",
      appointments: [],
      next: null,
      lastCompleted: null
    });
    const patient = patients.get(id);
    patient.appointments.push(appointment);
    if (isUpcoming(appointment, now) && (!patient.next || appointmentTime(appointment) < appointmentTime(patient.next))) patient.next = appointment;
    if (appointment.status === "Completed" && (!patient.lastCompleted || appointmentTime(appointment) > appointmentTime(patient.lastCompleted))) patient.lastCompleted = appointment;
  }
  return [...patients.values()].sort((a, b) => a.name.localeCompare(b.name));
}
