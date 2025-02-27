const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  interviewId: { type: mongoose.Schema.Types.ObjectId, required: true },

  recommendation: {
    type: String,
    enum: ["Strong Yes", "Yes", "Neutral", "No", "Strong No"],
    required: true,
  },   
  technicalScore: { type: String },
  behavioralScore: { type: String },
  additionalFeedback: { type: String },

});

module.exports = mongoose.model("Feedback", feedbackSchema);
