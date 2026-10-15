import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiMessageCircle, FiSend, FiTrash2, FiX } from "react-icons/fi";
import renderChatMarkdown from "./renderChatMarkdown";
import renderBookingPanel, { BOOKING_COPY } from "./renderBookingPanel";
import "./chat.css";
const COPY = {
  en: {
    title: "Zoi Assistant",
    subtitle: "A little help, in your language",
    open: "Ask Zoi",
    greeting: "Hi! I can help you explore Zoi, find doctors and prepare an appointment booking. What would you like to know?",
    placeholder: "Ask about doctors or using Zoi…",
    send: "Send",
    close: "Close chat",
    clear: "Start a new chat",
    language: "Chat language",
    thinking: "Thinking…",
    privacy: "Your messages go to our AI provider. Keep personal medical and payment details out of chat.",
    scope: "Information and appointment requests. AI answers can be inaccurate.",
    error: "Zoi Assistant is unavailable right now. Please try again later.",
    busy: "Please wait a little before trying again.",
    login: "Please log in again to use Zoi Assistant.",
    invalid: "Please send a shorter message.",
    prompts: ["How do I book an appointment?", "Which doctors are listed?", "Where is the health library?"],
    appointments: "Appointments",
    library: "Health library",
    you: "You",
    assistant: "Zoi"
  },
  hi: {
    title: "ज़ोई सहायक",
    subtitle: "आपकी भाषा में मदद",
    open: "ज़ोई से पूछें",
    greeting: "नमस्ते! मैं ज़ोई इस्तेमाल करने और ऐप में सूचीबद्ध डॉक्टरों को खोजने में आपकी मदद कर सकता हूँ। आप क्या जानना चाहते हैं?",
    placeholder: "डॉक्टरों या ज़ोई के बारे में पूछें…",
    send: "भेजें",
    close: "चैट बंद करें",
    clear: "नई चैट शुरू करें",
    language: "चैट की भाषा",
    thinking: "सोच रहा हूँ…",
    privacy: "आपके संदेश हमारी AI सेवा को भेजे जाते हैं। निजी चिकित्सा और भुगतान की जानकारी साझा न करें।",
    scope: "केवल ऐप संबंधी मदद। AI के जवाब गलत हो सकते हैं।",
    error: "ज़ोई सहायक अभी उपलब्ध नहीं है। कृपया बाद में कोशिश करें।",
    busy: "दोबारा कोशिश करने से पहले थोड़ा इंतज़ार करें।",
    login: "ज़ोई सहायक इस्तेमाल करने के लिए फिर से लॉग इन करें।",
    invalid: "कृपया छोटा संदेश भेजें।",
    prompts: ["अपॉइंटमेंट कैसे बुक करूँ?", "कौन से डॉक्टर सूचीबद्ध हैं?", "स्वास्थ्य लाइब्रेरी कहाँ है?"],
    appointments: "अपॉइंटमेंट",
    library: "स्वास्थ्य लाइब्रेरी",
    you: "आप",
    assistant: "ज़ोई"
  },
  bn: {
    title: "জোই সহায়ক",
    subtitle: "আপনার ভাষায় সাহায্য",
    open: "জোইকে জিজ্ঞেস করুন",
    greeting: "নমস্কার! জোই ব্যবহার করতে এবং অ্যাপে তালিকাভুক্ত ডাক্তার খুঁজতে আমি সাহায্য করতে পারি। আপনি কী জানতে চান?",
    placeholder: "ডাক্তার বা জোই সম্পর্কে জিজ্ঞেস করুন…",
    send: "পাঠান",
    close: "চ্যাট বন্ধ করুন",
    clear: "নতুন চ্যাট শুরু করুন",
    language: "চ্যাটের ভাষা",
    thinking: "ভাবছি…",
    privacy: "আপনার বার্তা আমাদের AI পরিষেবায় পাঠানো হয়। ব্যক্তিগত চিকিৎসা ও পেমেন্টের তথ্য শেয়ার করবেন না।",
    scope: "শুধু অ্যাপ ব্যবহারের সাহায্য। AI-এর উত্তর ভুল হতে পারে।",
    error: "জোই সহায়ক এখন উপলব্ধ নয়। পরে আবার চেষ্টা করুন।",
    busy: "আবার চেষ্টা করার আগে একটু অপেক্ষা করুন।",
    login: "জোই সহায়ক ব্যবহার করতে আবার লগ ইন করুন।",
    invalid: "অনুগ্রহ করে ছোট বার্তা পাঠান।",
    prompts: ["কীভাবে অ্যাপয়েন্টমেন্ট বুক করব?", "কোন ডাক্তারদের তালিকা আছে?", "স্বাস্থ্য লাইব্রেরি কোথায়?"],
    appointments: "অ্যাপয়েন্টমেন্ট",
    library: "স্বাস্থ্য লাইব্রেরি",
    you: "আপনি",
    assistant: "জোই"
  }
};
export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState("");
  const [booking, setBooking] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [phone, setPhone] = useState("");
  const bottom = useRef(null);
  const input = useRef(null);
  const pending = useRef(false);
  const request = useRef(null);
  const text = COPY[language];
  useEffect(() => {
    if (open) bottom.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, [messages, busy, open, errorKey, bookingError, booking]);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => () => request.current?.abort(), []);
  function reset(nextLanguage = language) {
    if (pending.current) return;
    setLanguage(nextLanguage);
    setMessages([]);
    setDraft("");
    setErrorKey("");
    setBooking(null);
    setBookingError("");
    setPhone("");
  }
  async function send(value, bookingSelection = null) {
    const content = value.trim();
    if (!content || pending.current) return;
    if (content.length > 2000) {
      setErrorKey("invalid");
      return;
    }
    const token = localStorage.getItem("token") || localStorage.getItem("doctorToken");
    if (!token) {
      setErrorKey("login");
      return;
    }
    const history = [...messages.slice(-10), {
      role: "user",
      content
    }];
    pending.current = true;
    request.current = new AbortController();
    const timer = setTimeout(() => request.current?.abort(), 100000);
    setMessages(history);
    setDraft("");
    setErrorKey("");
    setBusy(true);
    setBooking(null);
    setBookingError("");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: request.current.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          language,
          messages: history,
          bookingDraft: booking?.draft || null,
          ...(bookingSelection ? {
            bookingSelection
          } : {})
        })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 403 && data.code === "BOOKING_FORBIDDEN") throw new Error("bookingForbidden");
        const key = response.status === 401 ? "login" : data.code === "CHAT_BUSY" ? "busy" : data.code === "INVALID_CHAT_INPUT" ? "invalid" : "error";
        throw new Error(key);
      }
      if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("error");
      setMessages([...history, {
        role: "assistant",
        content: data.reply
      }]);
      setBooking(data.booking || null);
      if (data.booking?.contact) setPhone(data.booking.contact.phone);
    } catch (error) {
      setMessages(messages);
      setDraft(content);
      setBooking(booking);
      setErrorKey(error.message === "bookingForbidden" ? "" : ["login", "busy", "invalid"].includes(error.message) ? error.message : "error");
      if (error.message === "bookingForbidden") setBookingError("BOOKING_FORBIDDEN");
    } finally {
      clearTimeout(timer);
      pending.current = false;
      setBusy(false);
    }
  }
  async function confirmBooking() {
    if (pending.current || !booking?.confirmationToken) return;
    const digits = phone.replace(/\D/g, "");
    if (!/^[+\d][\d ()-]{6,24}$/.test(phone.trim()) || digits.length < 7 || digits.length > 15) {
      setBookingError("CONTACT_REQUIRED");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorKey("login");
      return;
    }
    pending.current = true;
    setBusy(true);
    setBookingError("");
    setErrorKey("");
    request.current = new AbortController();
    const timer = setTimeout(() => request.current?.abort(), 30000);
    try {
      const response = await fetch("/api/appointments/chat/confirm", {
        method: "POST",
        signal: request.current.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          confirmationToken: booking.confirmationToken,
          phone: phone.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) setErrorKey("login");
        throw new Error(data.code || "BOOKING_UNAVAILABLE");
      }
      if (!data.appointment?.id) throw new Error("BOOKING_UNAVAILABLE");
      setBooking({
        stage: "done",
        receipt: data.appointment
      });
      setPhone("");
      setMessages(history => [...history.slice(-8), {
        role: "user",
        content: BOOKING_COPY[language].confirm
      }, {
        role: "assistant",
        content: BOOKING_COPY[language].success
      }]);
    } catch (error) {
      setBookingError(error.message);
      if (["SLOT_TAKEN", "REVIEW_EXPIRED", "INVALID_TIME", "INVALID_DATE"].includes(error.message)) {
        setBooking({
          ...booking,
          stage: "time",
          confirmationToken: null,
          draft: {
            ...booking.draft,
            time: null
          },
          availableTimes: booking.availableTimes.filter(time => error.message !== "SLOT_TAKEN" || time !== booking.draft.time)
        });
      }
    } finally {
      clearTimeout(timer);
      pending.current = false;
      setBusy(false);
    }
  }
  return <div className="zoi-chat" lang={language} data-lenis-prevent>
    {open && <section className="zoi-chat-panel" role="region" aria-label={text.title}>
      <header className="zoi-chat-header">
        <div><strong>{text.title}</strong><p>{text.subtitle}</p></div>
        <div className="zoi-chat-actions">
          <button type="button" onClick={() => reset()} disabled={busy} aria-label={text.clear} title={text.clear}><FiTrash2 /></button>
          <button type="button" onClick={() => setOpen(false)} aria-label={text.close}><FiX /></button>
        </div>
      </header>
      <div className="zoi-chat-language">
        <label htmlFor="zoi-chat-language">{text.language}</label>
        <select id="zoi-chat-language" value={language} disabled={busy} onChange={event => reset(event.target.value)}>
          <option value="en">English</option><option value="hi">हिन्दी</option><option value="bn">বাংলা</option>
        </select>
      </div>
      <div className="zoi-chat-log" role="log" aria-live="polite" aria-relevant="additions" aria-busy={busy}>
        <div className="zoi-chat-message assistant"><small>{text.assistant}</small><p>{text.greeting}</p></div>
        {messages.map((message, index) => <div key={index} className={`zoi-chat-message ${message.role}`}>
          <small>{message.role === "user" ? text.you : text.assistant}</small>
          {message.role === "assistant" ? renderChatMarkdown(message.content) : <p>{message.content}</p>}
        </div>)}
        {busy && <p className="zoi-chat-thinking" role="status">{text.thinking}</p>}
        {errorKey && <p className="zoi-chat-error" role="alert">{text[errorKey]}</p>}
        {renderBookingPanel({
          booking,
          language,
          busy,
          phone,
          onPhone: setPhone,
          onChoose: send,
          onConfirm: confirmBooking,
          error: bookingError
        })}
        {!booking && bookingError && <p className="zoi-chat-error" role="alert">{BOOKING_COPY[language].errors[bookingError] || BOOKING_COPY[language].errors.default}</p>}
        <div ref={bottom} />
      </div>
      {messages.length === 0 && !busy && <div className="zoi-chat-prompts">
        {text.prompts.map(prompt => <button key={prompt} type="button" onClick={() => send(prompt)}>{prompt}</button>)}
      </div>}
      <nav className="zoi-chat-links" aria-label={text.title}>
        <button
          type="button"
          disabled={busy}
          onClick={() => send(BOOKING_COPY[language].start, {
          start: true
        })}
        >{BOOKING_COPY[language].start}</button>
        <Link to="/home/appointment">{text.appointments}</Link>
        <Link to="/health-library">{text.library}</Link>
        <Link to="/home/documents">{language === "hi" ? "दस्तावेज़" : language === "bn" ? "নথি" : "Documents"}</Link>
      </nav>
      <form
        className="zoi-chat-compose"
        onSubmit={event => {
        event.preventDefault();
        send(draft);
      }}
      >
        <textarea
          ref={input}
          rows={2}
          maxLength={2000}
          disabled={busy}
          value={draft}
          aria-label={text.placeholder}
          placeholder={text.placeholder}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={event => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            send(draft);
          }
        }}
        />
        <button type="submit" disabled={busy || !draft.trim()} aria-label={text.send}><FiSend /></button>
      </form>
      <footer className="zoi-chat-footer"><p>{text.scope}</p><p>{text.privacy}</p></footer>
    </section>}
    <button className="zoi-chat-launcher" type="button" aria-expanded={open} aria-label={open ? text.close : text.open} onClick={() => setOpen(!open)}>
      {open ? <FiX /> : <><FiMessageCircle /><span>{text.open}</span></>}
    </button>
  </div>;
}
