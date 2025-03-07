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
const interviewerId = "67bf5971d24618e1f498ada5";
function getInterviewHeaders() {
  let headers = [
    "date",
    "name",
    "email",
    "interviewerName",
    "role",
    "google_meet_link",
  ];
  headers.push("eStatus");
  return headers;
}

async function updateInterviews(interviews) {
  const updated = await Promise.all(
    interviews.map(async (interview) => {
      const [candidate, job] = await Promise.all([
        Candidate.findOne({ _id: interview.candidateId }).lean(),
        Job.findOne({ _id: interview.jobId }).lean(),
      ]);

      return {
        ...interview,
        role: job?.role || "Unknown Role",
        name: candidate?.name || "Unknown Candidate",
        email: candidate?.email || "Unknown Email",
      };
    })
  );

  return updated;
}
function getHeaders(flag) {
  let excludes = [
    "_id",
    "__v",
    "candidateId",
    "interviewerId",
    "feedbackId",
    "estatus",
    "duration",
    "jobId",
  ];
  if (flag) excludes.push("google_meet_link");
  let headers = Object.keys(Interview.schema.paths).filter(
    (key) => !excludes.includes(key)
  );
  headers.push("role");
  headers.push("name");
  headers.push("email");
  if (flag) headers.push("Feedback Action");
  return headers;
}
router.get("/upcoming", async (req, res) => {
  try {
    const currentTimeUTC = new Date(); // Get current UTC time

    // Fetch upcoming interviews sorted by date in ascending order
    const upcomingInterviews = await Interview.find({
      date: { $gt: currentTimeUTC }, // Get future interviews
      interviewerId,
    })
      .sort({ date: 1 })
      .lean();

    console.log("Current UTC Time:", currentTimeUTC);
    console.log("Upcoming Interviews:", upcomingInterviews);
    const headers = getHeaders(0);
    const finalInterviews = await updateInterviews(upcomingInterviews);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ success: true, data: finalInterviews, headers });
    }

    res.render("upinterview", {
      data: finalInterviews,
      headers: headers,
      flag: 0,
      index: 3,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching interviews");
  }
});

router.get("/completed", async (req, res) => {
  try {
    const currentTimeUTC = new Date();

    const completedInterviews = await Interview.find({
      date: { $lt: currentTimeUTC },
      estatus: "Completed",
    })
      .sort({ date: 1 })
      .lean(); // `lean()` makes it return plain JS objects

    console.log("Current UTC Time:", currentTimeUTC);
    console.log("completed Interviews:", completedInterviews);
    const finalInterviews = await updateInterviews(completedInterviews);

    const headers = getHeaders(1);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ success: true, data: finalInterviews, headers });
    }
    res.render("cominterview", {
      flag: 0,
      index: 3,
      data: finalInterviews,
      headers: headers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching interviews");
  }
});

router.get("/pending", async (req, res) => {
  try {
    const currentTimeUTC = new Date();

    const completedInterviews = await Interview.find({
      date: { $lt: currentTimeUTC },
      estatus: "Completed",
      feedbackId: { $exists: false }, // Find documents where feedbackId does not exist
    })
      .sort({ date: 1 })
      .lean(); // `lean()` makes it return plain JS objects

    console.log("Current UTC Time:", currentTimeUTC);
    console.log("completed Interviews:", completedInterviews);
    const finalInterviews = await updateInterviews(completedInterviews);

    const headers = getHeaders(1);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ success: true, data: finalInterviews, headers });
    }
    res.render("cominterview", {
      flag: 0,
      index: 3,
      data: finalInterviews,
      headers: headers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching interviews");
  }
});
router.get("/admin", async (req, res) => {
  try {
    const headers = getInterviewHeaders();
    const candidates = await Candidate.find({}).lean();

    const updatedCandidates = await processCandidates(candidates);
    const finalCandidates=updatedCandidates.filter((candidate)=>{
      return candidate.eStatus!==0;
    });
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      return res.json({ success: true, data: finalCandidates, headers });
    }
    res.render("adInterviews", {
      flag: 1,
      index: 3,
      data: finalCandidates,
      headers: headers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching interviews");
  }
});
module.exports = router;
