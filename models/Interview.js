const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId },
  jobId: { type: mongoose.Schema.Types.ObjectId },
  date: { type: Date },
  google_meet_link: { type: String },
  interviewerId: { type: mongoose.Schema.Types.ObjectId },
  feedbackId: { type: mongoose.Schema.Types.ObjectId },
  estatus: {
    type: String,
    enum: ["Scheduled", "Completed", "Rescheduled", "Canceled"],
    default: "Scheduled",
  },
  duration: { type: Number }, // In minutes
}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
