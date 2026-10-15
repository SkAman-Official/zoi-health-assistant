const express = require("express");
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");
const Doctor = require("../models/Doctor");
const {
  loadHospitalKnowledge
} = require("../services/hospitalKnowledge");
const {
  selectHospitalKnowledge
} = require("../services/hospitalRetrieval");
const {
  ChatError,
  validateChatInput,
  getChatConfig,
  generateChatTurn
} = require("../services/chatService");
const {
  BookingError,
  todayIST
} = require("../services/appointmentService");
const {
  cleanDraft,
  cleanSelection,
  prepareBooking
} = require("../services/bookingConversation");
const {
  bookingService
} = require("../controllers/appointmentController");
const router = express.Router();
router.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: "CHAT_BUSY"
  }
}));
router.post("/", auth, async (req, res) => {
  res.set("Cache-Control", "no-store");
  try {
    const input = validateChatInput(req.body);
    const selection = cleanSelection(req.body.bookingSelection);
    const draft = req.body.bookingDraft == null ? null : cleanDraft(req.body.bookingDraft);
    const directory = await Doctor.find({}).select("fullName specialization hospital").sort({
      fullName: 1,
      _id: 1
    }).limit(200).lean().maxTimeMS(5000);
    let turn;
    if (!selection) {
      const hospitals = selectHospitalKnowledge(loadHospitalKnowledge(), input.messages);
      const doctor = directory.find(item => String(item._id) === draft?.doctorId);
      turn = await generateChatTurn({
        ...input,
        directory,
        hospitals,
        config: getChatConfig(),
        today: todayIST(),
        bookingDraft: draft ? {
          active: true,
          specialty: draft.specialty,
          doctorName: doctor?.fullName || null,
          date: draft.date,
          time: draft.time
        } : null
      });
    }
    if (selection || turn?.intent) {
      if (req.accountType !== "user") return res.status(403).json({
        code: "BOOKING_FORBIDDEN"
      });
      const result = await prepareBooking({
        ...input,
        draft,
        selection,
        intent: turn?.intent,
        directory,
        user: req.user,
        service: bookingService
      });
      return res.json({
        ...result,
        language: input.language
      });
    }
    res.json({
      reply: turn.reply,
      booking: null,
      language: input.language
    });
  } catch (error) {
    const known = error instanceof ChatError || error instanceof BookingError;
    console.warn("[Zoi chat]", known ? error.code : "CHAT_DATA_UNAVAILABLE", known ? error.diagnostic : {});
    res.status(known ? error.status : 503).json({
      code: known ? error.code : "CHAT_UNAVAILABLE"
    });
  }
});
module.exports = router;
