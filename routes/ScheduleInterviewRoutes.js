const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");
const Job = require(path.join(__dirname, "../models/jobs"));
const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path
const Interview = require(path.join(__dirname, "../models/interview")); // Ensure correct path

function getHeaders() {
  let headers = Object.keys(Interview.schema.paths).filter(
    (key) => !["_id", "__v", "feedbackId", "estatus", "duration"].includes(key)
  );
  return headers;
}

async function getRole(jobId) {
  try {
    const job = await Job.findById(jobId); // Wait for MongoDB query to complete

    if (!job) {
      console.log("Job not found!");
      return null; // Return null or handle the error
    }

    return job.role; // Now you can safely access role
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
}
async function checkRoles(role, array) {
  console.log(array);
  return array.includes(role);
}
router.get("/", async (req, res) => {
  const headers = getHeaders();
  const candidates = await Candidate.find({});
  const jobs = await Job.find({});
  const employees = await Employee.find({});
  const optionsObj = {
    candidates: candidates,
    jobs: jobs,
    employees: employees,
  };
  res.render("scheduleInt", { flag: 1, index: 3, headers, optionsObj });
});

router.get("/:cId/:jobId", async (req, res) => {
    try {
      const { cId: candidateId, jobId } = req.params;
      
      // Fetch all required data in parallel
      const [candidates, jobs, employees, interview] = await Promise.all([
        Candidate.find({}),
        Job.find({}),
        Employee.find({}),
        Interview.findOne({ candidateId, jobId }),
      ]);
  
      // Construct the options object
      const optionsObj = { candidates, jobs, employees };
  
      // Prepare data for the form
      const data = interview
        ? {
            candidateId,
            jobId,
            google_meet_link: interview.google_meet_link,
            date: interview.date ? interview.date.toISOString().slice(0, 16) : "",
            interviewerId: interview.interviewerId,
          }
        : { candidateId, jobId };
  
      // Render the page
      res.render("editInt", { flag: 1, index: 3, headers: getHeaders(), optionsObj, data });
  
    } catch (error) {
      console.error("Error fetching interview details:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
router.post(["/", "/:cId/:jobId"], async (req, res) => {
  try {
    const { candidateId, jobId, date, google_meet_link, interviewerId } =
      req.body;
    if (
      !candidateId ||
      !jobId ||
      !date ||
      !google_meet_link ||
      !interviewerId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const role = await getRole(jobId);
    const candidate = await Candidate.findOne({ _id: candidateId }).lean();

   
    let interview = await Interview.findOne({ candidateId, jobId });

    if (interview) {
      
      interview.date = new Date(date);
      interview.google_meet_link = google_meet_link;
      interview.interviewerId = interviewerId;
      interview.estatus = "Scheduled";

      await interview.save();
      console.log("Interview Updated:", interview);
    } else {
      // ✅ Create new interview if not found
      interview = new Interview({
        candidateId,
        jobId,
        date: new Date(date),
        google_meet_link,
        interviewerId,
        estatus: "Scheduled",
      });

      await interview.save();
      console.log("New Interview Scheduled:", interview);
    }

    console.log(role);
    console.log(candidate);
    console.log(candidate.referred_jobs);

    // ✅ Check candidate's referred_jobs and update if needed
    const fg = await checkRoles(role, candidate["referred_jobs"]);
    if (!fg) {
      const updatedCandidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { $addToSet: { referred_jobs: role } }, // Avoid duplicate entries
        { new: true, upsert: true }
      );

      if (!updatedCandidate) {
        console.log("Candidate not found!");
        return res.status(404).json({ error: "Candidate not found" });
      }

      console.log("Updated Candidate:", updatedCandidate);
    }

    // ✅ Send success message
    res.send(`
        <script>
            alert("Interview ${
              interview ? "Updated" : "Scheduled"
            } successfully!");
            window.location.href = "/adjobs";
        </script>
      `);
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
