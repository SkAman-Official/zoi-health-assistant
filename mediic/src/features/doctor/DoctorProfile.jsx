import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDoctorPortal } from "./doctorContext";
import { doctorRequest } from "./doctorApi";
import { initials } from "./doctorData";
import PortalState from "./PortalState";
const FIELDS = [["fullName", "Full name", "text", 160], ["specialization", "Department / specialty", "text", 160], ["hospital", "Hospital", "text", 160], ["email", "Email", "email", 254], ["licenseNumber", "License number", "text", 64]];
export default function DoctorProfile({
  edit = false
}) {
  const {
    doctor,
    loading,
    refresh
  } = useDoctorPortal();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (doctor) setForm(Object.fromEntries(FIELDS.map(([key]) => [key, doctor[key] || ""])));
  }, [doctor]);
  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await doctorRequest("/api/doctors/update", {
        method: "PUT",
        body: JSON.stringify(form)
      });
      if (!result.updatedDoctor) throw new Error("The profile could not be updated.");
      localStorage.setItem("doctorData", JSON.stringify(result.updatedDoctor));
      localStorage.setItem("doctorName", result.updatedDoctor.fullName);
      await refresh();
      navigate("/doctor-portal/profile", {
        state: {
          saved: true
        }
      });
    } catch (failure) {
      setError(failure.message);
    } finally {
      setSaving(false);
    }
  }
  return <div className="doctor-page"><div className="doctor-page-heading"><div><h1>{edit ? "Edit profile" : "My profile"}</h1><p>Your registered professional details.</p></div>
    {!edit && <Link className="doctor-button bg-white text-blue-700" to="/doctor-portal/profile/edit">Edit profile</Link>}</div>
    <PortalState />
    {!loading && doctor && form && <div className="doctor-surface max-w-4xl mx-auto">
      <div className="flex items-center gap-4 pb-6 mb-6 border-b border-slate-100"><span className="doctor-avatar" aria-hidden="true">{initials(doctor.fullName)}</span><div><h2 className="text-xl font-semibold text-slate-800">{doctor.fullName}</h2><p className="text-sm text-slate-500 mt-1">{doctor.specialization} · {doctor.hospital}</p></div></div>
      {error && <p className="doctor-alert doctor-alert-error" role="alert">{error}</p>}
      {edit ? <form onSubmit={save}><div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{FIELDS.map(([key, label, type, maxLength]) => <label className="doctor-field" key={key}>{label}<input
        required
        type={type}
        maxLength={maxLength}
        value={form[key]}
        disabled={saving}
        onChange={event => setForm(previous => ({
              ...previous,
              [key]: event.target.value
            }))}
      /></label>)}</div>
        <div className="flex flex-wrap gap-3 mt-8"><button className="doctor-button doctor-button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button><Link className="doctor-button doctor-button-secondary" to="/doctor-portal/profile">Cancel</Link></div>
      </form> : <dl className="doctor-detail-list sm:grid-cols-2">{FIELDS.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{doctor[key] || "Not provided"}</dd></div>)}</dl>}
    </div>}
  </div>;
}
DoctorProfile.propTypes = {
  edit: PropTypes.bool
};
