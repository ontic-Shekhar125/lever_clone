const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  interview_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  interviewer_email: { type: String, required: true },
  candidate_email: { type: String, required: true },
  recommendation: {
    type: String,
    enum: ["Strong Yes", "Yes", "Neutral", "No", "Strong No"],
    required: true,
  },   
  technical_score: { type: String, required: true },
  behavioral_score: { type: String, required: true },
  additional_feedback: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
