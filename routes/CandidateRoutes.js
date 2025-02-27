const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");
const Job = require(path.join(__dirname, "../models/jobs"));
const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path
const Interview = require(path.join(__dirname, "../models/interview")); // Ensure correct path
const Feedback = require(path.join(__dirname, "../models/feedback")); // Ensure correct path

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

async function updateFn(candidates) {
  let updatedCandidates = [];
  candidates.forEach((candidate) => {
    candidate.referred_jobs.forEach((role) => {
      let newCandidate = { ...candidate, role: role };
      updatedCandidates.push(newCandidate);
    });
  });
  return updatedCandidates;
}
async function addReferredName(candidates) {
  return await Promise.all(
    candidates.map(async (candidate) => {
      let newCandidate = { ...candidate };

      if (candidate.referred_by) {
        const employee = await Employee.findById(candidate.referred_by)
          .select("name")
          .lean();
        newCandidate["referred_by"] = employee ? employee.name : "N/A"; // Replace ObjectId with name
      }

      return newCandidate; // Return modified object
    })
  );
}

async function addJobIds(candidates) {
  return await Promise.all(
    candidates.map(async (candidate) => {
      let newCandidate = { ...candidate };
      const job = await Job.findOne({ role: candidate.role });
      newCandidate.jobId = job._id;
      return newCandidate; // Return modified object
    })
  );
}
async function checkCandidateInInterview(candidateId, role) {
  try {
    const job = await Job.findOne({ role: role });
    if (!job) {
      console.log("No job found for role:", role);
      return false;
    }

    const interview = await Interview.findOne({
      candidateId: candidateId,
      jobId: job._id,
    });

    return interview ? interview : false;
  } catch (error) {
    console.error("Error finding candidate in interviews:", error);
    return false;
  }
}

async function getEstatus(objectId, role,candidate) {
  const Interview = await checkCandidateInInterview(objectId, role);
  let status = 0;
  if (Interview && Interview.estatus === "Completed") {
    if (Interview.feedbackId) 
      {
        status = 3;
        candidate.interviewId=Interview._id;
      }
    else status = 2;
  } else if (Interview && Interview.estatus === "Scheduled") {
    status = 1;
  }
  return status;
}
async function addStatus(updatedCandidates) {
  const candidatesWithStatus = await Promise.all(
    updatedCandidates.map(async (candidate) => {
      const objectId = candidate._id;
      const role = candidate.role;
      candidate["eStatus"] = await getEstatus(objectId, role,candidate);
      return candidate;
    })
  );

  return candidatesWithStatus;
}
async function processCandidates(candidates) {
  try {
    const candidatesNew = await addReferredName(candidates);
    console.log("candidatesNew:", candidatesNew);
    if (!candidatesNew || !Array.isArray(candidatesNew)) {
      throw new Error("addReferredName did not return a valid array.");
    }

    const updatedCandidates = await updateFn(candidatesNew);
    console.log("updatedCandidates:", updatedCandidates);
    const statusCandidates = await addStatus(updatedCandidates);
    console.log("statusCandidates:", statusCandidates);
    const finalCandidates = await addJobIds(statusCandidates);
    console.log("finalCandidates:", finalCandidates);

    return finalCandidates;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
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
      interviews: updatedCandidates,
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

    const jobRole = job.role; // Extract the job role

    // 2️⃣ Fetch candidates who have this role in referred_jobs array
    const candidates = await Candidate.find({
      referred_jobs: { $in: [jobRole] }, // Matches if role exists in referred_jobs array
    }).lean();
    console.log(candidates);
    // 3️⃣ Extract headers dynamically from Candidate schema
    let headers = Object.keys(Candidate.schema.paths).filter(
      (key) =>
        !["_id", "__v", "referred_jobs", "notes", "resume_link"].includes(key)
    );

    // 4️⃣ Convert referred_by ObjectId to Employee name using Promise.all()
    const candidatesNew = await Promise.all(
      candidates.map(async (candidate) => {
        let newCandidate = { ...candidate }; // Clone the candidate object

        if (candidate.referred_by) {
          const employee = await Employee.findById(candidate.referred_by)
            .select("name")
            .lean();
          newCandidate.referred_by = employee ? employee.name : "N/A"; // Replace ObjectId with name
        }

        return newCandidate; // Return modified candidate object
      })
    );

    // 5️⃣ Render the template with headers and modified candidate data
    //console.log(candidatesNew);
    res.render("candidates", {
      flag: 1,
      index: 1,
      headers,
      interviews: candidatesNew,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
