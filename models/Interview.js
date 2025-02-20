const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  candidate_name: { type: String },
  candidate_email: { type: String, required: true },
  job_role: { type: String, required: true },
  date: { type: Date, required: true },
  google_meet_link: { type: String },
  interviewer_email: { type: String, required: true },
  feedback_id: { type: mongoose.Schema.Types.ObjectId },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Rescheduled", "Canceled"],
    default: "Scheduled",
  },
  duration: { type: Number, required: true }, // In minutes
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
