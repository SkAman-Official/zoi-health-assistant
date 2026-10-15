const {
  BookingError,
  objectId,
  normalizeName,
  todayIST,
  validateDate,
  publicDoctor
} = require("./appointmentService");
const COPY = {
  en: {
    department: "Which department would you like to book with? Choose a department below, then select a doctor.",
    departmentUnavailable: "I can't find a registered Zoi doctor for that request. Please choose an available department below or type a specific doctor's name. Hospital directory listings alone are not bookable here.",
    doctor: "Which registered Zoi doctor would you like to book? Choose below or type a doctor's name or department. These are selected matches; narrow your search if needed.",
    noMatch: "I can't match that request to a registered Zoi doctor. Hospital directory listings alone are not bookable here. You can choose a registered doctor below or try another name.",
    noDoctors: "No registered doctors are available for booking in Zoi yet. Hospital directory listings remain informational.",
    date: "Which date would you prefer? You can say tomorrow or choose a date within the next 90 days.",
    invalidDate: "Please choose a valid date from today through the next 90 days, using India time.",
    time: "Choose a time below or tell me your preferred time, including AM or PM. These are Zoi's standard booking slots in India time, subject to doctor approval.",
    noSlots: "No Zoi slots remain on that date. Please choose another date.",
    review: "Please review the appointment below. Nothing is booked until you press Confirm booking. Times are in India time (IST); doctor approval is still required.",
    cancelled: "I've cleared this booking draft. No appointment is created or cancelled."
  },
  hi: {
    department: "आप किस विभाग में अपॉइंटमेंट चाहते हैं? नीचे विभाग चुनें, फिर डॉक्टर चुनें।",
    departmentUnavailable: "इस अनुरोध के लिए पंजीकृत Zoi डॉक्टर नहीं मिला। नीचे उपलब्ध विभाग चुनें या किसी डॉक्टर का नाम लिखें। केवल अस्पताल निर्देशिका में नाम होने से बुकिंग नहीं होती।",
    doctor: "आप किस पंजीकृत Zoi डॉक्टर की अपॉइंटमेंट चाहते हैं? नीचे चुनें या डॉक्टर का नाम या विभाग लिखें। ये चुनिंदा परिणाम हैं; ज़रूरत हो तो खोज को सीमित करें।",
    noMatch: "यह अनुरोध किसी पंजीकृत Zoi डॉक्टर से मेल नहीं खाता। अस्पताल निर्देशिका की सूची से सीधे बुकिंग नहीं होती। नीचे डॉक्टर चुनें या दूसरा नाम लिखें।",
    noDoctors: "अभी Zoi में बुकिंग के लिए कोई पंजीकृत डॉक्टर उपलब्ध नहीं है। अस्पताल निर्देशिका केवल जानकारी देती है।",
    date: "आप कौन सी तारीख चाहते हैं? कल कह सकते हैं या अगले 90 दिनों में कोई तारीख चुनें।",
    invalidDate: "कृपया भारतीय समय के अनुसार आज से अगले 90 दिनों के बीच सही तारीख चुनें।",
    time: "नीचे समय चुनें या AM/PM सहित समय बताएं। ये भारतीय समय में Zoi के सामान्य बुकिंग स्लॉट हैं; डॉक्टर की स्वीकृति आवश्यक है।",
    noSlots: "उस तारीख पर Zoi का कोई स्लॉट नहीं बचा है। दूसरी तारीख चुनें।",
    review: "नीचे अपॉइंटमेंट की जानकारी जाँचें। बुकिंग की पुष्टि बटन दबाने तक बुकिंग नहीं होती। समय IST में है और डॉक्टर की स्वीकृति आवश्यक है।",
    cancelled: "बुकिंग का मसौदा हटा दिया है। कोई अपॉइंटमेंट बनाई या रद्द नहीं की गई है।"
  },
  bn: {
    department: "কোন বিভাগে অ্যাপয়েন্টমেন্ট চান? নিচে বিভাগ বাছুন, তারপর ডাক্তার বেছে নিন।",
    departmentUnavailable: "এই অনুরোধের জন্য নিবন্ধিত Zoi ডাক্তার মেলেনি। নিচে উপলব্ধ বিভাগ বাছুন অথবা নির্দিষ্ট ডাক্তারের নাম লিখুন। শুধু হাসপাতালের ডিরেক্টরিতে নাম থাকলে বুকিং হয় না।",
    doctor: "কোন নিবন্ধিত Zoi ডাক্তারের অ্যাপয়েন্টমেন্ট চান? নিচে বেছে নিন অথবা ডাক্তারের নাম বা বিভাগ লিখুন। এগুলি নির্বাচিত ফলাফল; প্রয়োজনে আরও নির্দিষ্ট করে খুঁজুন।",
    noMatch: "এই অনুরোধের সঙ্গে নিবন্ধিত Zoi ডাক্তার মেলেনি। হাসপাতালের ডিরেক্টরির তালিকা থেকে সরাসরি বুকিং হয় না। নিচে ডাক্তার বাছুন অথবা অন্য নাম লিখুন।",
    noDoctors: "Zoi-তে বুকিংয়ের জন্য এখনও কোনও নিবন্ধিত ডাক্তার নেই। হাসপাতালের ডিরেক্টরি শুধু তথ্য দেয়।",
    date: "কোন তারিখ চান? আগামীকাল বলতে পারেন অথবা আগামী ৯০ দিনের মধ্যে তারিখ বাছুন।",
    invalidDate: "ভারতীয় সময় অনুযায়ী আজ থেকে আগামী ৯০ দিনের মধ্যে সঠিক তারিখ বাছুন।",
    time: "নিচে সময় বাছুন অথবা AM/PM সহ সময় বলুন। এগুলি ভারতীয় সময়ে Zoi-এর সাধারণ বুকিং স্লট; ডাক্তারের অনুমোদন প্রয়োজন।",
    noSlots: "ওই তারিখে Zoi-এর কোনও স্লট বাকি নেই। অন্য তারিখ বাছুন।",
    review: "নিচে অ্যাপয়েন্টমেন্টের তথ্য দেখে নিন। বুকিং নিশ্চিত করুন বোতাম চাপার আগে বুকিং হয় না। সময় IST-তে দেওয়া এবং ডাক্তারের অনুমোদন প্রয়োজন।",
    cancelled: "বুকিংয়ের খসড়া মুছে দেওয়া হয়েছে। কোনও অ্যাপয়েন্টমেন্ট তৈরি বা বাতিল হয়নি।"
  }
};
function cleanDraft(value) {
  if (value == null) return {
    active: true,
    specialty: null,
    doctorId: null,
    date: null,
    time: null
  };
  if (typeof value !== "object" || Array.isArray(value)) throw new BookingError("INVALID_BOOKING");
  const draft = {
    active: true
  };
  for (const key of ["specialty", "doctorId", "date", "time"]) {
    if (value[key] != null && (typeof value[key] !== "string" || value[key].length > (key === "specialty" ? 160 : 40))) throw new BookingError("INVALID_BOOKING");
    draft[key] = value[key] || null;
  }
  if (draft.doctorId && !objectId(draft.doctorId)) throw new BookingError("INVALID_BOOKING");
  return draft;
}
function cleanSelection(value) {
  if (value == null) return null;
  if (typeof value !== "object" || Array.isArray(value)) throw new BookingError("INVALID_BOOKING");
  const keys = Object.keys(value);
  if (keys.length !== 1 || !["start", "cancel", "edit", "specialty", "doctorId", "date", "time"].includes(keys[0])) throw new BookingError("INVALID_BOOKING");
  const key = keys[0];
  if (key === "edit") {
    if (![true, "date", "doctor", "department"].includes(value[key])) throw new BookingError("INVALID_BOOKING");
  } else if (["start", "cancel"].includes(key)) {
    if (value[key] !== true) throw new BookingError("INVALID_BOOKING");
  } else if (typeof value[key] !== "string" || value[key].length > (key === "specialty" ? 160 : 40) || !value[key].trim()) throw new BookingError("INVALID_BOOKING");
  if (key === "doctorId" && !objectId(value[key])) throw new BookingError("INVALID_BOOKING");
  return {
    [key]: value[key]
  };
}
async function prepareBooking({
  language,
  draft: incoming,
  selection,
  intent,
  directory,
  user,
  service,
  now = new Date()
}) {
  const text = COPY[language] || COPY.en;
  if (selection?.cancel || intent?.cancel) return {
    reply: text.cancelled,
    booking: null
  };
  const draft = cleanDraft(selection?.start ? null : incoming);
  if (selection?.edit) draft.time = null;
  if (selection?.edit === "date") draft.date = null;
  if (selection?.edit === "doctor") draft.doctorId = null;
  if (selection?.edit === "department") {
    draft.specialty = null;
    draft.doctorId = null;
  }
  const lower = value => normalizeName(value).toLocaleLowerCase().normalize("NFKC");
  const departments = [...new Map(directory.filter(doctor => doctor.specialization?.trim()).map(doctor => [lower(doctor.specialization.trim()), doctor.specialization.trim()])).values()].sort((a, b) => a.localeCompare(b));
  const specialty = selection?.specialty || intent?.specialty;
  if (specialty && lower(specialty) !== lower(draft.specialty)) {
    draft.specialty = specialty.trim();
    draft.doctorId = null;
    draft.time = null;
  }
  let choices = directory;
  let noMatch = false;
  if (intent?.doctorName && !specialty) draft.specialty = null;
  if (intent?.doctorName || draft.specialty || intent?.hospital) {
    choices = directory.filter(doctor => (!intent?.doctorName || lower(doctor.fullName).includes(lower(intent.doctorName))) && (!draft.specialty || lower(doctor.specialization).includes(lower(draft.specialty))) && (!intent?.hospital || lower(doctor.hospital).includes(lower(intent.hospital))));
    if (intent?.doctorName) {
      const exact = choices.filter(doctor => lower(doctor.fullName) === lower(intent.doctorName));
      if (exact.length) choices = exact;
    }
    if (intent?.doctorName || !choices.some(doctor => String(doctor._id) === draft.doctorId)) {
      const id = intent?.doctorName && choices.length === 1 ? String(choices[0]._id) : null;
      if (id !== draft.doctorId) draft.time = null;
      draft.doctorId = id;
    }
    noMatch = !choices.length;
    if (noMatch) {
      draft.specialty = null;
      draft.doctorId = null;
      draft.time = null;
    }
  }
  if (selection?.doctorId && selection.doctorId !== draft.doctorId) {
    draft.doctorId = selection.doctorId;
    draft.time = null;
  }
  const date = selection?.date || intent?.date;
  if (date && date !== draft.date) {
    draft.date = date;
    draft.time = null;
  }
  const time = selection?.time || intent?.time;
  if (time) draft.time = time;
  const doctor = directory.find(item => String(item._id) === draft.doctorId);
  const booking = {
    draft,
    stage: "doctor",
    minDate: todayIST(now),
    timeZone: "Asia/Kolkata"
  };
  const last = new Date(`${todayIST(now)}T00:00:00Z`);
  last.setUTCDate(last.getUTCDate() + 90);
  booking.maxDate = last.toISOString().slice(0, 10);
  if (doctor) draft.specialty = doctor.specialization.trim();
  if (!doctor && !draft.specialty) {
    booking.stage = "department";
    booking.departments = departments;
    return {
      reply: !directory.length ? text.noDoctors : noMatch ? text.departmentUnavailable : text.department,
      booking
    };
  }
  if (draft.specialty) {
    const exact = departments.find(department => lower(department) === lower(draft.specialty));
    if (exact) draft.specialty = exact;
  }
  if (!doctor) {
    draft.doctorId = null;
    draft.time = null;
    booking.choices = choices.slice(0, 8).map(publicDoctor);
    return {
      reply: !directory.length ? text.noDoctors : noMatch ? text.noMatch : text.doctor,
      booking
    };
  }
  booking.doctor = publicDoctor(doctor);
  booking.stage = "date";
  if (!draft.date) return {
    reply: text.date,
    booking
  };
  try {
    validateDate(draft.date, now);
  } catch {
    draft.date = null;
    draft.time = null;
    return {
      reply: text.invalidDate,
      booking
    };
  }
  const slots = await service.availableSlots(doctor, draft.date);
  if (!slots.length) {
    draft.date = null;
    draft.time = null;
    return {
      reply: text.noSlots,
      booking
    };
  }
  booking.stage = "time";
  booking.availableTimes = slots;
  if (!draft.time || !slots.includes(draft.time)) {
    draft.time = null;
    return {
      reply: text.time,
      booking
    };
  }
  booking.stage = "review";
  booking.confirmationToken = service.signReview(user._id, doctor, draft.date, draft.time);
  booking.contact = {
    name: String(user.name || ""),
    email: String(user.email || ""),
    phone: String(user.phone || "")
  };
  return {
    reply: text.review,
    booking
  };
}
module.exports = {
  cleanDraft,
  cleanSelection,
  prepareBooking
};
