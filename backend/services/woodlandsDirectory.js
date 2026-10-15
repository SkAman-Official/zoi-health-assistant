const fs = require("node:fs");
const path = require("node:path");
function nameKey(name) {
  return name.toLowerCase().replace(/\b(prof|dr|lt|col|ms)\b/g, "").replace(/[^a-z]/g, "");
}

// Reviewed spelling and initial expansions against the official web directory.
const ALIASES = {
  kksinha: ["Dr Kisor Kumar Sinha"],
  biswajitghoshdastidar: ["Dr Biswajit Ghosh Dastidar"],
  dhrubabhattacharya: ["Dr Dhruba Bhattacharyya"],
  lalitkragarwal: ["Dr Lalit Kumar Agarwal"]
};
function formatSession(session) {
  const scope = session.dayInterpretation === "explicit_column" ? session.days.join(", ") : `Merged columns spanning ${session.days.join(", ")} (day applicability unconfirmed)`;
  const value = session.byAppointment ? "By Appointment; no fixed times stated" : session.timeRanges.map(range => `${range.start}-${range.end}`).join(" and ");
  return `${scope}: ${value}`;
}
function enrichWoodlands(hospitals) {
  const file = path.join(__dirname, "../data/woodlands-opd.json");
  if (fs.statSync(file).size > 524288) throw new Error("Booklet directory is too large");
  const booklet = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(booklet.doctorEntries) || booklet.doctorEntries.length > 300) {
    throw new Error("Invalid booklet directory");
  }
  return hospitals.map(hospital => {
    if (hospital.name !== booklet.hospital) return hospital;
    const bookletDoctors = booklet.doctorEntries.map(entry => ({
      name: entry.name,
      aliases: ALIASES[nameKey(entry.name)] || [],
      department: entry.department,
      specialty: entry.department,
      shifts: entry.sessions.map(formatSession).join("; "),
      sourceUrl: `${booklet.sourceUrl}#page=${entry.sourcePage}`,
      sourcePage: entry.sourcePage,
      sourceDocument: booklet.sourceTitle,
      lastChecked: booklet.reviewedOn
    }));
    const names = new Set(bookletDoctors.flatMap(doctor => [doctor.name, ...doctor.aliases]).map(nameKey));
    const additional = hospital.doctors.filter(doctor => !names.has(nameKey(doctor.name)));
    const departments = [...hospital.departments];
    for (const name of booklet.departments) {
      if (!departments.some(department => department.name === name)) {
        departments.push({
          name,
          hours: "",
          sourceUrl: booklet.sourceUrl,
          lastChecked: booklet.reviewedOn
        });
      }
    }
    return {
      ...hospital,
      departments,
      doctors: [...bookletDoctors, ...additional],
      directoryScope: `${booklet.doctorEntries.length} consultation listings extracted from all 30 tables of the supplied booklet, plus ${additional.length} additional selected website listings. Repeated doctors can appear in different departments. This is a published snapshot, not a guaranteed complete current staff list. No live booking integration is established.`,
      notes: "Booklet publication date is not identified. The PDF generation date is not its publication date. Schedules are published consultation windows, not live availability. Reconfirm before visiting. Merged weekday cells preserve their printed span but day applicability requires confirmation. Blank cells do not prove absence. Emergency service hours are separate from OPD timings."
    };
  });
}
module.exports = {
  enrichWoodlands,
  formatSession
};
