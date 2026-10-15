const mongoose = require("mongoose");
const field = new mongoose.Schema({
  value: {
    type: String,
    default: ""
  },
  uncertain: {
    type: Boolean,
    required: true
  }
}, {
  _id: false
});
const medicine = new mongoose.Schema({
  name: field,
  strength: field,
  instructions: field,
  duration: field
}, {
  _id: false
});
const schema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  extractionId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 120
  },
  extraction: {
    documentType: {
      type: String,
      enum: ["prescription", "medical_report", "other_medical"],
      required: true
    },
    doctor: field,
    hospital: field,
    documentDate: field,
    medicines: [medicine],
    notes: field,
    rawText: {
      type: String,
      required: true,
      maxlength: 12000
    }
  },
  source: {
    sha256: String,
    mimeType: String,
    sizeBytes: Number
  },
  extractionMetadata: {
    provider: String,
    model: String,
    readability: String,
    flags: [String],
    warnings: [String]
  },
  reviewedHash: {
    type: String,
    required: true
  },
  edited: {
    type: Boolean,
    required: true
  },
  reviewedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  strict: "throw"
});
schema.index({
  ownerId: 1,
  extractionId: 1
}, {
  unique: true
});
schema.index({
  ownerId: 1,
  createdAt: -1
});
module.exports = mongoose.model("ReviewedDocument", schema);
