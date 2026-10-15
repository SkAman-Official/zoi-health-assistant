const express = require("express");
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");
const {
  createDocumentController
} = require("../controllers/documentController");
const router = express.Router();
const controller = createDocumentController();
router.use(auth);
router.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  if (req.accountType !== "user") return res.status(403).json({
    message: "Sign in with a patient account to manage your documents."
  });
  next();
});
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  keyGenerator: req => String(req.user._id),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: "DOCUMENT_BUSY",
    message: "Please wait before extracting another image."
  }
});
router.post("/extract", limiter, express.json({
  limit: "8mb"
}), controller.extract);
router.post("/", express.json({
  limit: "256kb"
}), controller.save);
router.get("/", controller.list);
router.get("/:id", controller.get);
router.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === "entity.too.large") return res.status(413).json({
    code: "IMAGE_TOO_LARGE",
    message: "The upload is too large. Choose an image up to 5 MB."
  });
  if (error.type === "entity.parse.failed") return res.status(400).json({
    code: "INVALID_IMAGE",
    message: "The upload request is invalid."
  });
  res.status(503).json({
    code: "DOCUMENT_UNAVAILABLE",
    message: "Documents are unavailable right now."
  });
});
module.exports = router;
