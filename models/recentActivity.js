const mongoose = require("mongoose");

const recentActivitySchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto set current date/time
  },
});

// Create and export the model
module.exports = mongoose.model("RecentActivity", recentActivitySchema);