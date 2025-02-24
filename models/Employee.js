const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String },
  designation: { type: String },
  location: { type: String },
})    
 ;

module.exports = mongoose.model("Employee", employeeSchema);
