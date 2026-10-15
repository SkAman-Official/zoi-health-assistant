import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doctorRequest } from "./doctorApi";
import { formatDate, formatTime, initials } from "./doctorData";
export default function DoctorPatientDetails() {
  const {
    patientId
  } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [reload, setReload] = useState(0);
  const retry = useCallback(() => setReload(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setData(null);
    doctorRequest(`/api/patients/${encodeURIComponent(patientId)}`, {
      signal: controller.signal
    }).then(result => {
      if (!result.success || !result.data || !Array.isArray(result.appointments)) throw new Error("Patient information could not be loaded.");
      if (!controller.signal.aborted) setData(result);
    }).catch(failure => {
      if (!controller.signal.aborted) setError(failure.message);
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [patientId, reload]);
  return <div className="doctor-page">
    <Link className="doctor-button doctor-button-secondary mb-5" to="/doctor-portal/patients">← Back to patients</Link>
    {loading && <div className="doctor-loading" role="status"><span className="doctor-spinner" />Loading patient details…</div>}
    {error && <div className="doctor-alert doctor-alert-error" role="alert"><p>{error}</p><button type="button" className="underline" onClick={retry}>Try again</button></div>}
    {data && <>
      <div className="doctor-page-heading"><div className="flex items-center gap-4"><span className="doctor-avatar bg-white text-cyan-700" aria-hidden="true">{initials(data.data.name)}</span><div><h1>{data.data.name}</h1><p>Patient details and your appointment history</p></div></div></div>
      <div className="flex gap-2 border-b border-slate-200 mb-6" role="tablist" aria-label="Patient information">
        <button id="patient-overview-tab" role="tab" aria-selected={tab === "overview"} aria-controls="patient-overview" type="button" className="doctor-tab" onClick={() => setTab("overview")}>Overview</button>
        <button id="patient-history-tab" role="tab" aria-selected={tab === "history"} aria-controls="patient-history" type="button" className="doctor-tab" onClick={() => setTab("history")}>Appointments ({data.appointments.length})</button>
      </div>
      {tab === "overview" ? <section id="patient-overview" role="tabpanel" aria-labelledby="patient-overview-tab" className="doctor-surface"><h2 className="font-semibold text-lg mb-5">Contact information</h2>
        <dl className="doctor-detail-list sm:grid-cols-2"><div><dt>Name</dt><dd>{data.data.name || "Not provided"}</dd></div><div><dt>Email</dt><dd>{data.data.email || "Not provided"}</dd></div><div><dt>Account phone</dt><dd>{data.data.phone || "Not provided"}</dd></div></dl>
        <p className="text-sm text-slate-500 mt-6">Booking-specific contact numbers and patient-provided reasons appear in the appointment history.</p>
      </section> : <section id="patient-history" role="tabpanel" aria-labelledby="patient-history-tab" className="space-y-4">
        {data.appointments.map(appointment => <article key={appointment._id} className="doctor-surface"><div className="flex flex-wrap justify-between gap-3"><h2 className="font-semibold">{formatDate(appointment.date)} · {formatTime(appointment.time)} IST</h2><span className="doctor-status" data-status={appointment.status}>{appointment.status}</span></div>
          <dl className="doctor-detail-list sm:grid-cols-2 mt-5"><div><dt>Hospital</dt><dd>{appointment.hospital || "Not recorded"}</dd></div><div><dt>Booking contact</dt><dd>{appointment.phone || "Not provided"}</dd></div><div className="sm:col-span-2"><dt>Patient-provided reason</dt><dd className="whitespace-pre-wrap">{appointment.reason || "Not provided"}</dd></div></dl>
        </article>)}
      </section>}
    </>}
  </div>;
}
