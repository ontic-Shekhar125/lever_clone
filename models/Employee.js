const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String },
  designation: { type: String },
  employee_id: { type: String, unique: true, required: true },
  location: { type: String },
  joined_date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Employee", employeeSchema);
