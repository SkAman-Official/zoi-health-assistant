function normalize(value) {
  return String(value).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim();
}
const HOSPITAL_TERMS = [["woodlands", "woodland", "উডল্যান্ডস", "উডল্যান্ড", "वुड्लैंड्स", "वुडलैंड्स"], ["fortis", "ফর্টিস", "फोर्टिस"], ["sskm", "ipgmer", "ipgme", "এসএসকেএম", "এস এস কে এম", "एसएसकेएम", "एस एस के एम"]];
const DEPARTMENT_TERMS = [["cardiology", "cardiac", "cardiologist", "cardiologists", "heart", "কার্ডিওলজি", "হৃদরোগ", "কার্ডিওলজিস্ট", "कार्डियोलॉजी", "हृदय", "कार्डियोलॉजिस्ट"], ["orthopaedics", "orthopaedic", "orthopedic", "orthopaedic", "joint", "অর্থোপেডিক", "অর্থোপেডিক্স", "ऑर्थोपेडिक", "হাড়"], ["paediatrics", "paediatric", "pediatric", "pediatrics", "child", "children", "শিশু", "বাচ্চা", "बाल", "बच्चे"], ["nephrology", "nephrologist", "kidney", "কিডনি", "নেফ্রোলজি", "नेफ्रोलॉजी", "किडनी"], ["neurology", "neurologist", "neurologists", "নিউরোলজি", "নিউরোলজিস্ট", "न्यूरोलॉजी", "न्यूरोलॉजिस्ट"], ["neurosurgery", "neurosurgeon", "নিউরোসার্জারি", "न्यूरोसर्जरी"], ["gastroenterology", "gastroenterologist", "gastro", "গ্যাস্ট্রো", "गैस्ट्रो"], ["dermatology", "dermatologist", "skin", "চর্ম", "ত্বক", "डर्मेटोलॉजी", "त्वचा"], ["endocrinology", "endocrinologist", "diabetes", "diabetic", "thyroid", "ডায়াবেটিস", "থাইরয়েড", "डायबिटीज", "थायरॉइड"], ["gynae", "gynaecology", "gynecology", "obstetrics", "গাইনি", "স্ত্রীরোগ", "स्त्रीरोग", "गायनी"], ["psychiatry", "psychiatrist", "psychology", "mental", "মানসিক", "মনোরোগ", "मनोचिकित्सा", "मानसिक"], ["dental", "dentist", "দাঁত", "दांत"], ["ophthalmology", "ophthalmologist", "eye", "চোখ", "आंख"], ["oncology", "oncologist", "cancer", "ক্যান্সার", "कैंसर"], ["urology", "urologist", "ইউরোলজি", "यूरोलॉजी"]];
function hasTerm(query, term) {
  return ` ${query} `.includes(` ${normalize(term)} `);
}
function selectHospitalKnowledge(hospitals, messages) {
  const userQueries = messages.filter(message => message.role === "user").slice(-3).map(message => normalize(message.content));
  const query = userQueries.join(" ");
  let selected = hospitals;
  // Most recent explicit hospital mention wins, preserving hospital context in follow-ups.
  for (const userQuery of [...userQueries].reverse()) {
    const matches = hospitals.filter(hospital => HOSPITAL_TERMS.some(terms => terms.some(term => normalize(hospital.name).includes(term)) && terms.some(term => hasTerm(userQuery, term))));
    if (matches.length) {
      selected = matches;
      break;
    }
  }
  const activeGroups = DEPARTMENT_TERMS.filter(terms => terms.some(term => hasTerm(query, term)));
  const limit = selected.length === 1 ? 24 : selected.length === 2 ? 12 : 8;
  return selected.map(hospital => {
    const ranked = hospital.doctors.map((doctor, index) => {
      const names = [doctor.name, ...(doctor.aliases || [])].map(normalize);
      let score = 0;
      for (const name of names) {
        const words = name.split(" ").filter(word => word.length >= 3 && !["prof", "doctor"].includes(word));
        const hits = words.filter(word => hasTerm(query, word)).length;
        score = Math.max(score, hits * 12 + (hits === words.length ? 100 : 0));
      }
      const department = normalize(`${doctor.department} ${doctor.specialty}`);
      for (const group of activeGroups) {
        if (group.some(term => hasTerm(department, term))) score += 10;
      }
      // Also match specialty terms not covered by the synonym groups, such as ENT.
      for (const word of department.split(" ")) {
        if (word.length >= 3 && !["and", "the", "care"].includes(word) && hasTerm(query, word)) score += 2;
      }
      return {
        doctor,
        score,
        index
      };
    }).sort((a, b) => b.score - a.score || a.index - b.index);
    const hits = ranked.filter(record => record.score > 0);
    const doctors = (hits.length ? hits : ranked).slice(0, limit).map(record => record.doctor);
    return {
      ...hospital,
      doctors,
      doctorRecordsAvailable: hospital.doctors.length,
      doctorRecordsIncluded: doctors.length,
      retrievalNote: "Only selected records relevant to recent questions are included. Other records may exist; ask for a doctor or department to narrow the search. Do not treat this subset as the full hospital roster."
    };
  });
}
module.exports = {
  selectHospitalKnowledge
};
