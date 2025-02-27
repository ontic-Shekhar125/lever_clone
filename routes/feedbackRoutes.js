const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");
const Job = require(path.join(__dirname, "../models/jobs"));
const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path
const Interview = require(path.join(__dirname, "../models/interview")); // Ensure correct path
const Feedback = require(path.join(__dirname, "../models/feedback")); // Ensure correct path

function getHeaders() {
  let headers = Object.keys(Feedback.schema.paths).filter(
    (key) => !["_id", "__v", "interviewId"].includes(key)
  );
  headers.unshift("Candidate Name");
  return headers;
}
router.get(["/:id","/:id/:fixedflag"], async (req, res) => {
  try {
    const interviewId = new mongoose.Types.ObjectId(req.params.id);
    const fixedflag= req.params.fixedflag ? 1 :0;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const feedback = await Feedback.findOne({ interviewId: interviewId });
    const candidate = await Candidate.findById(interview.candidateId);
    console.log(feedback ? "Feedback Found" : "No Feedback Found");

    const headers = getHeaders();
    res.render("feedback", {
      flag: 0,
      index: 3,
      data:  feedback || null,
      extradata:{candidate},
      headers,
      fixedflag,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id", async (req, res) => {
  try {
    console.log("Reached feedback route");
    const interviewId = new mongoose.Types.ObjectId(req.params.id);

    console.log("Interview ID:", interviewId);
    console.log("Received Data:", req.body);

    const {
      recommendation,
      technicalScore,
      behavioralScore,
      additionalFeedback,
    } = req.body;

    let feedback = await Feedback.findOne({ interviewId });
    
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    
    let flag = 0;
    if (feedback) {
      flag = 1;
      feedback.recommendation = recommendation;
      feedback.technicalScore = technicalScore;
      feedback.behavioralScore = behavioralScore;
      feedback.additionalFeedback = additionalFeedback;
      
    } else {
      feedback = new Feedback({
        interviewId,
        recommendation,
        technicalScore,
        behavioralScore,
        additionalFeedback,
      });
    }
      await feedback.save();
      interview.feedbackId = feedback._id;
      await interview.save();
      
      res.send(`
        <script>
            alert("Feedback ${flag ? "Updated" : "Submitted"} successfully!");
            window.location.href = "/emjobs";
        </script>
      `);
    }
   catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
