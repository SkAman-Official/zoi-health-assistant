import { Link } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import { useDoctorPortal } from "./doctorContext";
export default function PortalState() {
  const {
    loading,
    refreshing,
    error,
    lastUpdated,
    refresh,
    actionError,
    notice
  } = useDoctorPortal();
  return <div className="doctor-portal-state">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <p className="text-sm text-slate-500">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata"
        })} IST` : "Your doctor workspace"}</p>
      <button className="doctor-button doctor-button-secondary" type="button" onClick={() => refresh()} disabled={loading || refreshing}>
        <FiRefreshCw className={refreshing ? "animate-spin" : ""} />{refreshing ? "Refreshing…" : "Refresh"}
      </button>
    </div>
    {error && <div className="doctor-alert doctor-alert-error" role="alert"><p>{error}{lastUpdated ? " Showing the last loaded data." : ""}</p>
      <Link to="/doctor-login" className="underline">Doctor sign in</Link></div>}
    {actionError && <p className="doctor-alert doctor-alert-error" role="alert">{actionError}</p>}
    {notice && <p className="doctor-alert doctor-alert-success" role="status">{notice}</p>}
    {loading && <div className="doctor-loading" role="status"><span className="doctor-spinner" />Loading your appointments…</div>}
  </div>;
}
