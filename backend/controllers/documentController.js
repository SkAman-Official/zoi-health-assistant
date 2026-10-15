const ReviewedDocument = require("../models/ReviewedDocument");
const {
  objectId
} = require("../services/appointmentService");
const {
  DocumentError,
  validateImage,
  getDocumentConfig,
  extractDocument,
  issueReview,
  validateSave
} = require("../services/documentExtraction");
const MESSAGES = {
  IMAGE_CONSENT_REQUIRED: "Please confirm that this image may be sent to Gemini for extraction.",
  UNSUPPORTED_IMAGE: "Choose a JPG or PNG image. PDFs and other formats are not supported in this version.",
  INVALID_IMAGE: "This image cannot be read. Choose a valid JPG or PNG file.",
  IMAGE_TOO_LARGE: "Choose an image no larger than 5 MB.",
  IMAGE_DIMENSIONS_EXCEEDED: "Choose an image up to 20 megapixels and 10,000 pixels per side.",
  DOCUMENT_NOT_CONFIGURED: "Document extraction is not configured. Check the server's Gemini configuration.",
  DOCUMENT_TIMEOUT: "Extraction timed out. Try a smaller, clearer printed image.",
  DOCUMENT_BUSY: "Extraction is busy. Please wait before trying again.",
  DOCUMENT_UNAVAILABLE: "Document extraction is unavailable right now. Please try again.",
  DOCUMENT_BAD_RESPONSE: "The document could not be extracted reliably. Try a clearer image of one page.",
  DOCUMENT_NOT_PRINTED: "This version needs a clear printed medical document. Handwritten, unclear or unrelated images are not supported.",
  DOCUMENT_REVIEW_EXPIRED: "This extraction review is invalid or expired. Extract the image again before saving.",
  DOCUMENT_REVIEW_REQUIRED: "Review the extracted fields and confirm your review before saving.",
  INVALID_EXTRACTION: "Please check the document fields and text lengths.",
  DOCUMENT_ALREADY_SAVED: "This extraction is already saved with different edits. Start a new extraction for another record."
};
function fail(res, error) {
  const known = error instanceof DocumentError;
  console.warn("[Zoi documents]", known ? error.code : "DOCUMENT_DATA_UNAVAILABLE", known ? error.diagnostic : {});
  return res.status(known ? error.status : 503).json({
    code: known ? error.code : "DOCUMENT_UNAVAILABLE",
    message: known ? MESSAGES[error.code] : "Documents are unavailable right now. Please try again."
  });
}
const readable = record => ({
  id: String(record._id),
  title: record.title,
  extraction: record.extraction,
  edited: record.edited,
  reviewedAt: record.reviewedAt,
  createdAt: record.createdAt,
  extractionMetadata: record.extractionMetadata
});
function createDocumentController({
  Model = ReviewedDocument,
  extract = extractDocument,
  config = getDocumentConfig
} = {}) {
  let indexes;
  return {
    extract: async (req, res) => {
      try {
        const image = validateImage(req.body);
        const settings = config();
        const result = await extract({
          image,
          config: settings
        });
        const reviewToken = issueReview({
          userId: req.user._id,
          image,
          result,
          model: settings.model
        });
        res.json({
          ...result,
          reviewToken,
          model: settings.model,
          reviewExpiresInMinutes: 30
        });
      } catch (error) {
        fail(res, error);
      }
    },
    save: async (req, res) => {
      try {
        const record = validateSave(req.body, req.user._id);
        if (!indexes) indexes = Model.createIndexes().catch(error => {
          indexes = null;
          throw error;
        });
        await indexes;
        const filter = {
          ownerId: req.user._id,
          extractionId: record.extractionId
        };
        let previous = await Model.findOne(filter);
        let created = false;
        if (!previous) {
          try {
            previous = await Model.create(record);
            created = true;
          } catch (error) {
            if (error.code !== 11000) throw error;
            previous = await Model.findOne(filter);
          }
        }
        if (!previous) throw new Error();
        if (previous.reviewedHash !== record.reviewedHash) throw new DocumentError("DOCUMENT_ALREADY_SAVED", 409);
        res.status(created ? 201 : 200).json({
          document: readable(previous)
        });
      } catch (error) {
        fail(res, error);
      }
    },
    list: async (req, res) => {
      try {
        const records = await Model.find({
          ownerId: req.user._id
        }).sort({
          createdAt: -1
        }).limit(30).select("title extraction.documentType edited reviewedAt createdAt").lean().maxTimeMS(5000);
        res.json({
          documents: records.map(record => ({
            id: String(record._id),
            title: record.title,
            documentType: record.extraction?.documentType,
            edited: record.edited,
            reviewedAt: record.reviewedAt,
            createdAt: record.createdAt
          }))
        });
      } catch (error) {
        fail(res, error);
      }
    },
    get: async (req, res) => {
      if (!objectId(req.params.id)) return res.status(404).json({
        message: "Document not found."
      });
      try {
        const record = await Model.findOne({
          _id: req.params.id,
          ownerId: req.user._id
        });
        if (!record) return res.status(404).json({
          message: "Document not found."
        });
        res.json({
          document: readable(record)
        });
      } catch (error) {
        fail(res, error);
      }
    }
  };
}
module.exports = {
  createDocumentController
};
