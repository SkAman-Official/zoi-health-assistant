import { createContext, useContext } from "react";
export const DoctorContext = createContext(null);
export function useDoctorPortal() {
  const context = useContext(DoctorContext);
  if (!context) throw new Error("Doctor portal provider is missing.");
  return context;
}
