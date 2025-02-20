const mongoose = require("mongoose");

const Candidate = mongoose.model("Candidate", new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    current_location: String,
    current_company: String,
    referred_jobs: [String],
    referred_by: String,
    relationship_with_referrer: String,
    notes: String,
    resume_link: String
  }));

  module.exports = mongoose.model("candidate", Candidate);
  