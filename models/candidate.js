const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  current_location: String,
  current_company: String,
  referred_jobs: [{ type: String }], // Array of job IDs or names
  referred_by: { type: mongoose.Schema.Types.ObjectId }, // Reference to an Employee/User
  relationship_with_referrer: String,
  notes: String,
  resume_link: String
});

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
