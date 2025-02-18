const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const Job = require(path.join(__dirname, "./models/jobs"));
mongoose
  .connect("mongodb://localhost:27017/randomeee")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// let x=20;
//  while(x--)
//  {
//   const newJob = new Job({
//     admin: "John Doe",
//     role: "Software Engineer",
//     department: "Development",
//     locationType: "Remote",
//     workType: "Full-time",
//     location: "San Francisco"
// });
//   newJob.save()
//   .then(() => console.log('Job saved'))
//   .catch(err => console.error('Error saving job:', err))
//  }

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/jobs", (req, res) => {
  res.sendFile(path.join(__dirname, "/jobs.html"));
});

app.get("/header.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/header.js"));
});
app.get("/jobRef.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/jobRef.js"));
});
app.get("/referalForm", (req, res) => {
  res.sendFile(path.join(__dirname, "/referalForm.html"));
});
app.get("/jobsdata", async (req, res) => {
  const jobsdata = await Job.find({}).select("-__v");
  res.json(jobsdata);
});

app.get("/jobRoles", async (req, res) => {
  const jobRoles = await Job.distinct('role');
  console.log(jobRoles);
  res.json(jobRoles);
});
app.delete("/jobs/delete/:id", async (req, res) => {
  try {
    const result = await Job.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: "Job deleted successfully!" });
      setTimeout(() => {
        
        console.log("ll");
      }, 5000);
      console.log("hello node");
    } else {
      res.status(404).json({ message: "Job not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
