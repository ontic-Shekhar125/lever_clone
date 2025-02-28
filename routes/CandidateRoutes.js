const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");

const {
  updateFn,
  addReferredName,
  addJobIds,
  checkCandidateInInterview,
  getEstatus,
  addStatus,
  processCandidates,
  Job,
  Employee,
  Candidate,
  Interview,
  Feedback,
} = require(path.join(__dirname, "../public/js/candidateFunctions"));
async function createInterview() {
  try {
    // Set date for 28th Feb 2025 at 10:00 AM IST
    const istDate = new Date(Date.UTC(2025, 2, 28, 10 - 5, 30)); // 10 AM IST converted to UTC

    const newInterview = new Interview({
      candidateId: new mongoose.Types.ObjectId("67bdb9b5d33fb57efe275caf"),
      jobId: new mongoose.Types.ObjectId("67bdc42fd24618e1f498ad61"),
      interviewerId: new mongoose.Types.ObjectId("67bd72b31f89e8105cae2006"),
      google_meet_link: "https://meet.google.com/xya-abc-123",
      date: istDate, // Store in MongoDB
      estatus: "Completed",
    });

    const savedInterview = await newInterview.save();
    console.log("Interview Created:", savedInterview);
  } catch (error) {
    console.error("Error creating interview:", error);
  }
}
function getHeaders() {
  let headers = Object.keys(Candidate.schema.paths).filter(
    (key) =>
      ![
        "_id",
        "__v",
        "referred_jobs",
        "notes",
        "resume_link",
        "email",
      ].includes(key)
  );
  headers.push("role");
  headers.push("eStatus");
  return headers;
}

// Call the function

router.post("/", async (req, res) => {
  try {
    const savedEmployee = await new Employee(req.body).save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find({}).lean();
    let headers = getHeaders();
    const updatedCandidates = await processCandidates(candidates);
    //await createInterview();
    res.render("candidates", {
      flag: 1,
      index: 1,
      headers,
      data: updatedCandidates,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    // 1️⃣ Fetch the Job using the provided ID
    const job = await Job.findById(jobId).select("role").lean();
    if (!job) {
      return res.status(404).send("Job not found");
    }

    const jobRole = job.role;

    const candidates = await Candidate.find({}).lean();

    let headers = getHeaders();

    const updatedCandidates = await processCandidates(candidates);
    const filteredCandidates = updatedCandidates.filter(
      (candidate) => candidate.role === jobRole
    );

    res.render("candidates", {
      flag: 1,
      index: 1,
      headers,
      data: filteredCandidates,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
