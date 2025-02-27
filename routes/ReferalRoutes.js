const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");

const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path
const referrer_id = "67bf5971d24618e1f498ada5";

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      current_location,
      current_company,
      phone,
      relationship,
      referred_jobs,
    } = req.body;
    // Ensure referred_jobs is an array (it may come as a single value)
    const jobsArray = Array.isArray(referred_jobs)
      ? referred_jobs
      : [referred_jobs];

    // Create new candidate entry
    const newCandidate = new Candidate({
      name,
      email,
      phone,
      current_location,
      current_company,
      relationship,
      referred_jobs: jobsArray,
      referred_by: referrer_id, // Assign referrer ID
    });

    await newCandidate.save();

    // Redirect the user to the /emjobs page
    res.send(`
      <script>
          alert("Referal Submitted succesfully!");
          window.location.href = "/emjobs";
      </script>
  `);
  } catch (error) {
    console.error("Error saving candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", (req, res) => {
  res.render("referalForm", {
    flag: 0,
    index: 1,
    flag2: 0,
    jobdata: undefined,
  });
});


module.exports = router;
