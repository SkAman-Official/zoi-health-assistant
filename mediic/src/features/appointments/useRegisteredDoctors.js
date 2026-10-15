import { useEffect, useMemo, useState } from "react";
import { observePageRefresh } from "../observePageRefresh.js";
export function retainDoctorSelection(current, doctors) {
  return doctors.some(doctor => doctor.fullName === current) ? current : "";
}
export default function useRegisteredDoctors() {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    let active = true;
    let inFlight = false;
    let controller;
    async function refresh() {
      if (inFlight) return;
      inFlight = true;
      controller = new AbortController();
      try {
        const response = await fetch("/api/auth/doctors/all", {
          cache: "no-store",
          signal: controller.signal
        });
        const data = await response.json();
        if (!response.ok || !Array.isArray(data) || data.some(doctor => !doctor || ["_id", "fullName", "specialization", "hospital"].some(key => typeof doctor[key] !== "string"))) throw new Error();
        if (active) setDoctors(previous => JSON.stringify(previous) === JSON.stringify(data) ? previous : data);
      } catch {
        if (active) console.warn("Registered doctor directory is temporarily unavailable.");
      } finally {
        inFlight = false;
      }
    }
    refresh();
    const stop = observePageRefresh(refresh);
    return () => {
      active = false;
      stop();
      controller?.abort();
    };
  }, []);
  const hospitals = useMemo(() => [...new Set(doctors.map(doctor => doctor.hospital))], [doctors]);
  return {
    doctors,
    hospitals
  };
}
