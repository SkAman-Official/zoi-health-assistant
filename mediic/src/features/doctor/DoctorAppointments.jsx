import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDoctorPortal } from "./doctorContext";
import { APPOINTMENT_STATUSES, PENDING_STATUSES, filterAppointments } from "./doctorData";
import PortalState from "./PortalState";
import AppointmentList from "./AppointmentList";
export default function DoctorAppointments() {
  const {
    appointments,
    loading,
    lastUpdated
  } = useDoctorPortal();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date-desc");
  const status = params.get("status") || "all";
  const scope = params.get("scope") || "all";
  const filtered = filterAppointments(status === "awaiting" ? appointments.filter(item => PENDING_STATUSES.includes(item.status)) : appointments, {
    search,
    sort,
    status: status === "awaiting" ? "all" : status,
    scope
  });
  const choose = (key, value) => setParams(previous => {
    const next = new URLSearchParams(previous);
    next.set(key, value);
    return next;
  });
  const reset = () => {
    setSearch("");
    setSort("date-desc");
    setParams({});
  };
  return <div className="doctor-page">
    <div className="doctor-page-heading"><div><h1>Appointments</h1><p>Review requests and manage your patient appointments.</p></div></div>
    <PortalState />
    {!loading && lastUpdated && <section className="doctor-surface">
      <div className="doctor-filters">
        <label className="doctor-field">Search<input value={search} onChange={event => setSearch(event.target.value)} placeholder="Patient name or booking reference" type="search" /></label>
        <label className="doctor-field">Status<select value={status} onChange={event => choose("status", event.target.value)}><option value="all">All statuses</option><option value="awaiting">Awaiting approval</option>{APPOINTMENT_STATUSES.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="doctor-field">Schedule<select value={scope} onChange={event => choose("scope", event.target.value)}><option value="all">All dates</option><option value="today">Today</option><option value="upcoming">Upcoming</option></select></label>
        <label className="doctor-field">Sort<select value={sort} onChange={event => setSort(event.target.value)}><option value="date-desc">Latest first</option><option value="date-asc">Earliest first</option><option value="name">Patient name</option></select></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><p className="text-sm text-slate-500">Showing {filtered.length} of {appointments.length} appointments · IST</p>
        <button className="doctor-button doctor-button-secondary" type="button" onClick={reset}>Clear filters</button></div>
      <AppointmentList appointments={filtered} emptyTitle={appointments.length ? "No appointments match" : "No appointments yet"} emptyText={appointments.length ? "Try another name, date range or status, or clear the filters." : "Appointments from the booking form and chat appear here when patients book with you."} />
    </section>}
  </div>;
}
