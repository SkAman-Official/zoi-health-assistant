import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FiCalendar, FiClock, FiCheck, FiX, FiUser } from "react-icons/fi";
import { useDoctorPortal } from "./doctorContext";
import { formatDate, formatTime, initials, patientId, patientName, PENDING_STATUSES } from "./doctorData";
export default function AppointmentList({
  appointments,
  emptyTitle = "No appointments yet",
  emptyText = "New bookings appear here once patients request an appointment."
}) {
  const {
    updateStatus,
    pendingId
  } = useDoctorPortal();
  const [rejectId, setRejectId] = useState(null);
  if (!appointments.length) return <div className="doctor-empty"><FiCalendar /><h3>{emptyTitle}</h3><p>{emptyText}</p></div>;
  return <div className="space-y-4">{appointments.map(appointment => {
      const id = patientId(appointment);
      const name = patientName(appointment);
      const actionable = PENDING_STATUSES.includes(appointment.status);
      return <article key={appointment._id} className="doctor-appointment-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0"><div className="doctor-avatar" aria-hidden="true">{initials(name)}</div>
            <div className="min-w-0"><h3 className="font-semibold text-slate-800 break-words">{name}</h3>
              <p className="text-xs text-slate-500 mt-1">Reference · {appointment._id.slice(-8)}</p></div></div>
          <span className="doctor-status" data-status={appointment.status}>{appointment.status || "Unknown"}</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2"><FiCalendar />{formatDate(appointment.date)}</span>
          <span className="inline-flex items-center gap-2"><FiClock />{formatTime(appointment.time)} IST</span>
        </div>
        <div className="doctor-card-actions">
          {id ? <Link className="doctor-button doctor-button-secondary" to={`/doctor-portal/patients/${id}`}><FiUser />View patient</Link> : <span className="text-sm text-slate-500">Linked patient account unavailable</span>}
          {actionable && <div className="flex flex-wrap gap-2">
            <button
              className="doctor-button doctor-button-approve"
              type="button"
              disabled={pendingId !== null}
              onClick={() => {
              setRejectId(null);
              updateStatus(appointment._id, "Approved");
            }}
            ><FiCheck />{pendingId === appointment._id ? "Updating…" : "Approve"}</button>
            <button className="doctor-button doctor-button-reject" type="button" disabled={pendingId !== null} onClick={() => setRejectId(appointment._id)}><FiX />Reject</button>
          </div>}
        </div>
        {actionable && rejectId === appointment._id && <div className="doctor-reject-review" role="group" aria-label="Confirm appointment rejection">
          <p className="text-sm text-slate-700">Reject this appointment for {name}? This releases the slot.</p>
          <div className="flex flex-wrap gap-2 mt-3"><button
            className="doctor-button doctor-button-reject"
            type="button"
            disabled={pendingId !== null}
            onClick={async () => {
              await updateStatus(appointment._id, "Rejected");
              setRejectId(null);
            }}
          >Confirm rejection</button>
            <button className="doctor-button doctor-button-secondary" type="button" disabled={pendingId !== null} onClick={() => setRejectId(null)}>Keep appointment</button></div>
        </div>}
      </article>;
  })}</div>;
}
AppointmentList.propTypes = {
  appointments: PropTypes.array.isRequired,
  emptyTitle: PropTypes.string,
  emptyText: PropTypes.string
};
