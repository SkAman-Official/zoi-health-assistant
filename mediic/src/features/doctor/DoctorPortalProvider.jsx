import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DoctorContext } from "./doctorContext";
import { doctorRequest } from "./doctorApi";
import { observePageRefresh } from "../observePageRefresh";
import "./doctor.css";
export default function DoctorPortalProvider({
  children
}) {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const request = useRef(null);
  const mutation = useRef(false);
  const mounted = useRef(true);
  const loaded = useRef(false);
  const readInFlight = useRef(false);
  const refresh = useCallback(async (quiet = false) => {
    if (quiet && (readInFlight.current || mutation.current)) return false;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    readInFlight.current = true;
    if (!quiet) {
      setFetching(true);
      setError("");
    }
    try {
      const [profile, records] = await Promise.all([doctorRequest("/api/doctors/me", {
        signal: controller.signal
      }), doctorRequest("/api/appointments/mine", {
        signal: controller.signal
      })]);
      if (controller.signal.aborted || !mounted.current) return false;
      if (!profile.doctor || !Array.isArray(records)) throw new Error("Doctor data could not be loaded. Please retry.");
      setDoctor(previous => JSON.stringify(previous) === JSON.stringify(profile.doctor) ? previous : profile.doctor);
      setAppointments(records);
      loaded.current = true;
      setLastUpdated(new Date());
      setError("");
      return true;
    } catch (failure) {
      if (!controller.signal.aborted && mounted.current) setError(failure.message);
      return false;
    } finally {
      if (!controller.signal.aborted && mounted.current) {
        readInFlight.current = false;
        setFetching(false);
      }
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    refresh();
    const stop = observePageRefresh(() => refresh(true));
    return () => {
      mounted.current = false;
      stop();
      request.current?.abort();
    };
  }, [refresh]);
  async function updateStatus(id, status) {
    if (mutation.current) return;
    mutation.current = true;
    setPendingId(id);
    setActionError("");
    setNotice("");
    try {
      const action = status === "Approved" ? "approve" : "reject";
      const result = await doctorRequest(`/api/appointments/${action}/${encodeURIComponent(id)}`, {
        method: "PATCH"
      });
      if (!result.success) throw new Error("The appointment could not be updated.");
      if (mounted.current) {
        setAppointments(items => items.map(item => item._id === id ? {
          ...item,
          status
        } : item));
        setNotice(status === "Approved" ? "Appointment approved." : "Appointment rejected. The slot is available for a new booking.");
        await refresh();
      }
    } catch (failure) {
      if (mounted.current) {
        setActionError(failure.message);
        await refresh();
      }
    } finally {
      mutation.current = false;
      if (mounted.current) setPendingId(null);
    }
  }
  return <DoctorContext.Provider
    value={{
    doctor,
    appointments,
    loading: fetching && !loaded.current,
    refreshing: fetching && loaded.current,
    error,
    lastUpdated,
    refresh,
    updateStatus,
    pendingId,
    actionError,
    notice
  }}
  >{children}</DoctorContext.Provider>;
}
DoctorPortalProvider.propTypes = {
  children: PropTypes.node.isRequired
};
