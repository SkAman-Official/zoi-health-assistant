import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiMail, FiPhone } from "react-icons/fi";
import { useDoctorPortal } from "./doctorContext";
import { summarizePatients, formatDate, formatTime, initials } from "./doctorData";
import PortalState from "./PortalState";
export default function DoctorPatients() {
  const {
    appointments,
    loading,
    lastUpdated
  } = useDoctorPortal();
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("all");
  const patients = summarizePatients(appointments);
  const filtered = patients.filter(patient => `${patient.name} ${patient.email}`.toLowerCase().includes(search.trim().toLowerCase()) && (scope === "all" || (scope === "upcoming" ? patient.next : !patient.next)));
  return <div className="doctor-page">
    <div className="doctor-page-heading"><div><h1>My patients</h1><p>Patient accounts linked to your appointments.</p></div></div>
    <PortalState />
    {!loading && lastUpdated && <>
      <div className="doctor-surface mb-6"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="doctor-field">Search patients<input type="search" placeholder="Patient name or email" value={search} onChange={event => setSearch(event.target.value)} /></label>
        <label className="doctor-field">Appointments<select value={scope} onChange={event => setScope(event.target.value)}><option value="all">All patients</option><option value="upcoming">With upcoming appointments</option><option value="none">No upcoming appointment</option></select></label>
      </div><p className="text-sm text-slate-500 mt-4">Showing {filtered.length} of {patients.length} patients</p></div>
      {filtered.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{filtered.map(patient => <article className="doctor-surface flex flex-col" key={patient.id}>
        <div className="flex items-center gap-3 mb-5"><span className="doctor-avatar" aria-hidden="true">{initials(patient.name)}</span><div className="min-w-0"><h2 className="font-semibold text-slate-800 break-words">{patient.name}</h2><p className="text-xs text-slate-500 mt-1">{patient.appointments.length} recorded appointment{patient.appointments.length === 1 ? "" : "s"}</p></div></div>
        <p className="flex items-start gap-2 text-sm break-all mb-3"><FiMail className="shrink-0 mt-1" />{patient.email}</p>
        <p className="flex items-center gap-2 text-sm mb-5"><FiPhone className="shrink-0" />{patient.phone}</p>
        <div className="bg-slate-50 rounded-xl p-3 mb-5 text-sm"><p className="text-xs text-slate-500 mb-1">Next appointment · IST</p>
          {patient.next ? <><p className="font-medium">{formatDate(patient.next.date)} · {formatTime(patient.next.time)}</p><span className="doctor-status mt-2" data-status={patient.next.status}>{patient.next.status}</span></> : <p>No upcoming appointment</p>}</div>
        <Link className="doctor-button doctor-button-secondary mt-auto" to={`/doctor-portal/patients/${patient.id}`}>View patient details</Link>
      </article>)}</div> : <div className="doctor-empty"><FiUsers /><h3>{patients.length ? "No patients match" : "No linked patients yet"}</h3><p>{patients.length ? "Try another name or change the appointment filter." : "Patient accounts appear here when they book an appointment with you."}</p></div>}
    </>}
  </div>;
}
