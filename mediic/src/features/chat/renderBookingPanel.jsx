export const BOOKING_COPY = {
  en: {
    department: "Department",
    changeDepartment: "Change department",
    start: "Book in chat",
    cancel: "Discard draft",
    edit: "Change time",
    changeDate: "Change date",
    changeDoctor: "Change doctor",
    chooseDate: "Choose date",
    date: "Date",
    review: "Review appointment",
    doctor: "Doctor",
    hospital: "Hospital",
    time: "Time (IST)",
    name: "Patient",
    email: "Email",
    phone: "Contact phone",
    confirm: "Confirm booking",
    confirming: "Booking…",
    payment: "Pay at clinic. No payment is collected in chat.",
    privacy: "Contact details go directly to Zoi's booking service, outside the AI conversation.",
    done: "Appointment scheduled",
    pending: "Subject to doctor approval. This is a Zoi booking, not confirmation from an external hospital system.",
    reference: "Booking reference",
    success: "Your appointment is scheduled in Zoi and is subject to doctor approval.",
    errors: {
      SLOT_TAKEN: "That slot has just been taken. Choose another time.",
      REVIEW_EXPIRED: "This review has expired. Choose a time again to refresh it.",
      CONTACT_REQUIRED: "Enter a valid contact phone number.",
      BOOKING_FORBIDDEN: "Sign in with a patient account to book an appointment.",
      default: "The booking could not be confirmed. Retry with this same review to check safely."
    }
  },
  hi: {
    department: "विभाग",
    changeDepartment: "विभाग बदलें",
    start: "चैट में बुक करें",
    cancel: "मसौदा हटाएं",
    edit: "समय बदलें",
    changeDate: "तारीख बदलें",
    changeDoctor: "डॉक्टर बदलें",
    chooseDate: "तारीख चुनें",
    date: "तारीख",
    review: "अपॉइंटमेंट की जाँच",
    doctor: "डॉक्टर",
    hospital: "अस्पताल",
    time: "समय (IST)",
    name: "रोगी",
    email: "ईमेल",
    phone: "संपर्क फ़ोन",
    confirm: "बुकिंग की पुष्टि करें",
    confirming: "बुकिंग जारी है…",
    payment: "क्लिनिक में भुगतान करें। चैट में कोई भुगतान नहीं लिया जाता।",
    privacy: "संपर्क जानकारी सीधे Zoi की बुकिंग सेवा को जाती है, AI बातचीत को नहीं।",
    done: "अपॉइंटमेंट दर्ज है",
    pending: "डॉक्टर की स्वीकृति आवश्यक है। यह Zoi की बुकिंग है, किसी बाहरी अस्पताल प्रणाली की पुष्टि नहीं।",
    reference: "बुकिंग संदर्भ",
    success: "आपकी अपॉइंटमेंट Zoi में दर्ज है। डॉक्टर की स्वीकृति आवश्यक है।",
    errors: {
      SLOT_TAKEN: "यह समय अभी बुक हो गया है। दूसरा समय चुनें।",
      REVIEW_EXPIRED: "यह समीक्षा समाप्त हो गई है। फिर से समय चुनें।",
      CONTACT_REQUIRED: "कृपया सही संपर्क फ़ोन नंबर लिखें।",
      BOOKING_FORBIDDEN: "अपॉइंटमेंट के लिए रोगी खाते से लॉग इन करें।",
      default: "बुकिंग की पुष्टि नहीं हो सकी। इसी समीक्षा से सुरक्षित रूप से दोबारा प्रयास करें।"
    }
  },
  bn: {
    department: "বিভাগ",
    changeDepartment: "বিভাগ বদলান",
    start: "চ্যাটে বুক করুন",
    cancel: "খসড়া সরান",
    edit: "সময় বদলান",
    changeDate: "তারিখ বদলান",
    changeDoctor: "ডাক্তার বদলান",
    chooseDate: "তারিখ বাছুন",
    date: "তারিখ",
    review: "অ্যাপয়েন্টমেন্ট দেখে নিন",
    doctor: "ডাক্তার",
    hospital: "হাসপাতাল",
    time: "সময় (IST)",
    name: "রোগী",
    email: "ইমেল",
    phone: "যোগাযোগের ফোন",
    confirm: "বুকিং নিশ্চিত করুন",
    confirming: "বুকিং হচ্ছে…",
    payment: "ক্লিনিকে পেমেন্ট করুন। চ্যাটে টাকা নেওয়া হয় না।",
    privacy: "যোগাযোগের তথ্য সরাসরি Zoi-এর বুকিং পরিষেবায় যায়, AI কথোপকথনে নয়।",
    done: "অ্যাপয়েন্টমেন্ট নথিভুক্ত",
    pending: "ডাক্তারের অনুমোদন প্রয়োজন। এটি Zoi-এর বুকিং, বাইরের হাসপাতাল ব্যবস্থার নিশ্চিতকরণ নয়।",
    reference: "বুকিং নম্বর",
    success: "আপনার অ্যাপয়েন্টমেন্ট Zoi-তে নথিভুক্ত। ডাক্তারের অনুমোদন প্রয়োজন।",
    errors: {
      SLOT_TAKEN: "এই সময়টি এইমাত্র বুক হয়েছে। অন্য সময় বাছুন।",
      REVIEW_EXPIRED: "এই পর্যালোচনার মেয়াদ শেষ। আবার সময় বাছুন।",
      CONTACT_REQUIRED: "সঠিক যোগাযোগের ফোন নম্বর লিখুন।",
      BOOKING_FORBIDDEN: "অ্যাপয়েন্টমেন্ট বুক করতে রোগীর অ্যাকাউন্টে লগ ইন করুন।",
      default: "বুকিং নিশ্চিত করা যায়নি। নিরাপদে যাচাই করতে একই পর্যালোচনা দিয়ে আবার চেষ্টা করুন।"
    }
  }
};
export default function renderBookingPanel({
  booking,
  language,
  busy,
  phone,
  onPhone,
  onChoose,
  onConfirm,
  error
}) {
  if (!booking) return null;
  const text = BOOKING_COPY[language];
  const choose = (selection, label) => onChoose(label, selection);
  const doctor = booking.doctor;
  return <div className="zoi-chat-booking" aria-label={text.review}>
    {doctor && <p><strong>{doctor.name}</strong><br />{doctor.hospital}</p>}
    {booking.draft?.specialty && <p><strong>{text.department}:</strong> {booking.draft.specialty}</p>}
    {booking.stage === "department" && <div className="zoi-chat-booking-choices">
        {booking.departments.map(department => <button
          key={department}
          type="button"
          disabled={busy}
          onClick={() => choose({
        specialty: department
      }, `${text.department}: ${department}`)}
        >{department}</button>)}
      </div>}
    {booking.stage === "doctor" && <div className="zoi-chat-booking-choices">
        {booking.choices.map(choice => <button
          key={choice.id}
          type="button"
          disabled={busy}
          onClick={() => choose({
        doctorId: choice.id
      }, `${text.doctor}: ${choice.name}`)}
        >
          <strong>{choice.name}</strong><span>{choice.specialty} · {choice.hospital}</span>
        </button>)}
      </div>}
    {booking.stage === "date" && <form
      key={doctor.id}
      onSubmit={event => {
      event.preventDefault();
      const date = new FormData(event.currentTarget).get("date");
      choose({
        date
      }, `${text.date}: ${date}`);
    }}
    >
      <label>{text.date}<input type="date" name="date" required min={booking.minDate} max={booking.maxDate} disabled={busy} /></label>
      <button className="zoi-chat-booking-confirm" type="submit" disabled={busy}>{text.chooseDate}</button>
      </form>}
    {booking.stage === "time" && <>
      <p>{text.date}: {booking.draft.date} · IST</p>
      <div className="zoi-chat-booking-times">{booking.availableTimes.map(time => <button
        type="button"
        key={time}
        disabled={busy}
        onClick={() => choose({
          time
        }, `${text.time}: ${time}`)}
      >{time}</button>)}</div>
      </>}
    {booking.stage === "review" && <form
      onSubmit={event => {
      event.preventDefault();
      onConfirm();
    }}
    >
      <h3>{text.review}</h3>
      <dl><dt>{text.date}</dt><dd>{booking.draft.date}</dd><dt>{text.time}</dt><dd>{booking.draft.time}</dd>
        <dt>{text.name}</dt><dd>{booking.contact.name}</dd><dt>{text.email}</dt><dd>{booking.contact.email}</dd></dl>
      <label>{text.phone}<input type="tel" autoComplete="tel" required minLength={7} maxLength={25} value={phone} disabled={busy} onChange={event => onPhone(event.target.value)} /></label>
      <p className="zoi-chat-booking-hint">{text.privacy}</p><p>{text.payment}</p>
      <button className="zoi-chat-booking-confirm" type="submit" disabled={busy || !phone.trim()}>{busy ? text.confirming : text.confirm}</button>
      </form>}
    {booking.stage === "done" && <>
      <h3>{text.done}</h3><p>{booking.receipt.doctor}<br />{booking.receipt.hospital}<br />{booking.receipt.date} · {booking.receipt.time} IST</p>
      <p>{text.reference}: <code>{booking.receipt.id}</code></p><p>{text.pending}</p>
      </>}
    {error && <p className="zoi-chat-error" role="alert">{text.errors[error] || text.errors.default}</p>}
    {["doctor", "date", "time", "review"].includes(booking.stage) && <div className="zoi-chat-booking-actions">
        {booking.stage === "review" && <button
          type="button"
          disabled={busy}
          onClick={() => choose({
        edit: true
      }, text.edit)}
        >{text.edit}</button>}
        {["time", "review"].includes(booking.stage) && <button
          type="button"
          disabled={busy}
          onClick={() => choose({
        edit: "date"
      }, text.changeDate)}
        >{text.changeDate}</button>}
        {["date", "time", "review"].includes(booking.stage) && <button
          type="button"
          disabled={busy}
          onClick={() => choose({
        edit: "doctor"
      }, text.changeDoctor)}
        >{text.changeDoctor}</button>}
      <button
        type="button"
        disabled={busy}
        onClick={() => choose({
        edit: "department"
      }, text.changeDepartment)}
      >{text.changeDepartment}</button>
      </div>}
    {booking.stage !== "done" && <button
      className="zoi-chat-booking-discard"
      type="button"
      disabled={busy}
      onClick={() => choose({
      cancel: true
    }, text.cancel)}
    >{text.cancel}</button>}
  </div>;
}
