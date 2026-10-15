const fs = require("node:fs");
const path = require("node:path");
const {
  enrichWoodlands
} = require("./woodlandsDirectory");
function text(value, limit = 240) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}
function source(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href.slice(0, 500) : "";
  } catch {
    return "";
  }
}
function checkedDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value) && date <= new Date() ? value : "";
}
function sanitizeHospitals(data) {
  if (!data || !Array.isArray(data.hospitals) || data.hospitals.length > 10) {
    throw new Error("Invalid hospital directory");
  }
  return data.hospitals.map(hospital => {
    if (!hospital || !text(hospital.name) || !source(hospital.sourceUrl) || !checkedDate(hospital.lastChecked)) {
      throw new Error("Hospital entries require a name, source URL and valid lastChecked date");
    }
    const departments = Array.isArray(hospital.departments) ? hospital.departments : [];
    const doctors = Array.isArray(hospital.doctors) ? hospital.doctors : [];
    if (departments.length > 50 || doctors.length > 300) throw new Error("Hospital directory exceeds its record limit");
    return {
      name: text(hospital.name),
      address: text(hospital.address),
      addressSourceUrl: source(hospital.addressSourceUrl),
      directoryScope: text(hospital.directoryScope, 500),
      notes: text(hospital.notes, 700),
      bookingUrl: source(hospital.bookingUrl),
      operatingHours: text(hospital.operatingHours),
      timezone: "Asia/Kolkata",
      sourceUrl: source(hospital.sourceUrl),
      lastChecked: checkedDate(hospital.lastChecked),
      departments: departments.map(department => {
        if (!department || !text(department.name)) throw new Error("Invalid department entry");
        if (text(department.hours) && (!source(department.sourceUrl) || !checkedDate(department.lastChecked))) {
          throw new Error("Department hours require their own source and check date");
        }
        return {
          name: text(department.name),
          hours: text(department.hours),
          sourceUrl: source(department.sourceUrl),
          lastChecked: checkedDate(department.lastChecked)
        };
      }),
      doctors: doctors.map(doctor => {
        if (!doctor || !text(doctor.name) || !source(doctor.sourceUrl) || !checkedDate(doctor.lastChecked)) {
          throw new Error("Doctor entries require a name, source and check date");
        }
        return {
          name: text(doctor.name),
          department: text(doctor.department),
          specialty: text(doctor.specialty),
          aliases: Array.isArray(doctor.aliases) ? doctor.aliases.slice(0, 5).map(alias => text(alias)) : [],
          shifts: text(doctor.shifts, 1800),
          sourceUrl: source(doctor.sourceUrl),
          lastChecked: checkedDate(doctor.lastChecked),
          sourcePage: Number.isInteger(doctor.sourcePage) && doctor.sourcePage >= 1 && doctor.sourcePage <= 16 ? doctor.sourcePage : undefined,
          sourceDocument: text(doctor.sourceDocument)
        };
      })
    };
  });
}
function loadHospitalKnowledge() {
  const file = path.join(__dirname, "../data/hospitals.json");
  if (fs.statSync(file).size > 131072) throw new Error("Hospital directory is too large");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const initial = sanitizeHospitals(data);
  return sanitizeHospitals({
    hospitals: enrichWoodlands(initial)
  });
}
module.exports = {
  loadHospitalKnowledge,
  sanitizeHospitals
};
