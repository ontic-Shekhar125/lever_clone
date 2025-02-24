const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const Job = require(path.join(__dirname, "./models/jobs"));
const Interview = require(path.join(__dirname, "./models/Interview"));
const Feedback = require(path.join(__dirname,"./models/Feedback")); // Ensure correct path
app.use(express.json()); //
app.use(express.urlencoded({ extended: true })); 
const Employee = require(path.join(__dirname,"./models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname,"./models/Candidate")); // Ensure correct path

function getjobheaders()
{
  const excludes=['_id','__v'];
  return Object.keys(Job.schema.paths).filter((item)=>!excludes.includes(item));
}
// Set EJS as the view engine
app.set("view engine", "ejs");

// Set views directory (if needed)
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
const referrer = {
  _id: "67bb01f9afa26cbd5f3ba086",
  name: "Bob Smith",
  email: "bob.smith@example.com",
  phone: "+1 876-543-2109",
  department: "Engineering",
  designation: "Software Engineer",
  location: "Noida",
};

mongoose
  .connect("mongodb://localhost:27017/randomeee")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  
  app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/jobs", (req, res) => {
  res.sendFile(path.join(__dirname, "/jobs.html"));
});

app.get("/jobs", (req, res) => {
  res.sendFile(path.join(__dirname, "/jobs.html"));
});
app.get("/adjobs", (req, res) => {
  res.render("adjobs",{flag:1,index:2});
});

app.get("/editjobs/:id", async (req, res) => {
  
  const headers=getjobheaders();
  try {
    const jobId = req.params.id;

    // Convert jobId to a MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).send("Invalid Job ID");
    }

    const jobdata = await Job.findById(new mongoose.Types.ObjectId(jobId));

    if (!jobdata) {
        return res.status(404).send("Job not found");
    }

    res.render("editjobs",{headers,flag:1,index:2,data:jobdata});
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send("Internal Server Error");
}
  res.render("editjobs",{headers,flag:1,index:2,data:1});
});
app.get("/createjob", async (req, res) => {
  const excludes=['_id','__v'];
  const headers=Object.keys(Job.schema.paths).filter((item)=>!excludes.includes(item));
  res.render("createjob",{headers,flag:1,index:2});
});
app.post("/createjob", async (req, res) => {
  try {
      const { admin, role, department, locationType, workType, location } = req.body;

      // Validate required fields
      if (!admin || !role || !department || !locationType || !workType || !location) {
          return res.status(400).json({ error: "All fields are required" });
      }

      // Create and save job in database
      const newJob = new Job({
          admin,
          role,
          department,
          locationType,
          workType,
          location,
      });

      await newJob.save();
      res.status(201).json({ message: "Job created successfully", job: newJob });

  } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/referalForm", (req, res) => {
  res.render("referalForm",{flag:0,index:1,flag2:0,jobdata:undefined});
});
app.post("/referalForm", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      current_location,
      current_company,
      relationship_with_referrer,
      referred_jobs,
      referrer_id, // Assuming referrer ID is sent from the frontend
    } = req.body;

    // Ensure referred_jobs is an array (it may come as a single value)
    const jobsArray = Array.isArray(referred_jobs) ? referred_jobs : [referred_jobs];

    // Create new candidate entry
    const newCandidate = new Candidate({
      name,
      email,
      phone,
      current_location,
      current_company,
      relationship_with_referrer,
      referred_jobs: jobsArray,
      referred_by: referrer_id, // Assign referrer ID
    });

    await newCandidate.save();

    // Redirect the user to the /emjobs page
    res.redirect("/emjobs");
  } catch (error) {
    console.error("Error saving candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/referalForm/:id", async (req, res) => {
  try {
      const jobId = req.params.id;

      // Convert jobId to a MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
          return res.status(400).send("Invalid Job ID");
      }

      const jobdata = await Job.findById(new mongoose.Types.ObjectId(jobId));

      if (!jobdata) {
          return res.status(404).send("Job not found");
      }

      res.render("referalForm", { jobdata, flag: 0, index: 1,flag2:1 });
  } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).send("Internal Server Error");
  }
});
app.get("/jobsdata", async (req, res) => {
  const jobsdata = await Job.find({}).select("-__v");
  res.json(jobsdata);
});
app.get("/emjobs", async (req, res) => {
  res.render("emjobs", { flag:0 , index:2});

});
app.get("/jobRoles", async (req, res) => {
  const jobRoles = await Job.distinct("role");
  console.log(jobRoles);
  res.json(jobRoles);
});

app.get("/upInterviews", async (req, res) => {
  try {
    const currentTimeUTC = new Date(); // Get current UTC time

    // Fetch upcoming interviews with date greater than current UTC time
    const upcomingInterviews = await Interview.find({
      date: { $gt: currentTimeUTC },
    }).lean(); // `lean()` makes it return plain JS objects

    console.log("Current UTC Time:", currentTimeUTC);
    console.log("Upcoming Interviews:", upcomingInterviews);

    const allFields = Object.keys(upcomingInterviews[0]);
    const excludeFields = ["_id", "feedback_id", "interviewer_email", "duration", "updatedAt", "round","status"];
    const headers = allFields.filter((field) => !excludeFields.includes(field));

    res.render("upinterview", { interviews: upcomingInterviews, headers:headers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching interviews");
  }
});

app.get("/comInterviews", async (req, res) => {
  try {
    const currentTimeUTC = new Date(); // Get current UTC time

    // Fetch upcoming interviews with date greater than current UTC time
    const completedInterviews = await Interview.find({
      date: { $lt: currentTimeUTC },
    }).lean(); // `lean()` makes it return plain JS objects

    console.log("Current UTC Time:", currentTimeUTC);
    console.log("completed Interviews:", completedInterviews);
    
    const allFields = Object.keys(completedInterviews[0]);
    const excludeFields = ["_id", "feedback_id", "interviewer_email","google_meet_link", "updatedAt", "round","status"];
    const headers = allFields.filter((field) => !excludeFields.includes(field));
    headers.push("Feedback status");
    res.render("cominterview", { interviews: completedInterviews, headers:headers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching interviews");
  }
});
app.delete("/jobs/delete/:id", async (req, res) => {
  try {
    const result = await Job.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: "Job deleted successfully!" });

      
    } else {
      res.status(404).json({ message: "Job not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/feedback/:id", async (req, res) => {
  try {
    const interviewId = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId

    // Fetch interview details
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    // Fetch feedback related to the interview
    const feedback = await Feedback.findOne({ interview_id: interviewId });

    console.log(feedback ? "Feedback Found" : "No Feedback Found");
    console.log(Object.keys(Feedback.schema.paths));
    const excludes=['createdAt','updatedAt','_id','__v','interview_id','interviewer_email'];
    const headers=Object.keys(Feedback.schema.paths).filter((item)=>!excludes.includes(item));
    res.render("feedback", { interview, feedback: feedback || null,headers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/feedback/:id", async (req, res) => {
  try {
    console.log("Reached feedback route");
    const interview_id = new mongoose.Types.ObjectId(req.params.id); // Convert to ObjectId

    // Validate ObjectId

    console.log("Interview ID:", interview_id);
    console.log("Received Data:", req.body);

    const { recommendation, technical_score, behavioral_score, additional_feedback } = req.body;

    // Check if feedback already exists for the interview
    let feedback = await Feedback.findOne({ interview_id });

    // Fetch interview details to get interviewer_email
    const interview = await Interview.findById(interview_id);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }
    const interviewer_email = interview.interviewer_email;
    const candidate_email = interview.candidate_email;

    if (feedback) {
      // Update existing feedback
      feedback.recommendation = recommendation;
      feedback.technical_score = technical_score;
      feedback.behavioral_score = behavioral_score;
      feedback.additional_feedback = additional_feedback;

      await feedback.save();
      return res.status(200).json({ message: "Feedback updated successfully", feedback });
    } else {
      // Create new feedback
      feedback = new Feedback({
        interview_id,
        interviewer_email,
        candidate_email,
        recommendation,
        technical_score,
        behavioral_score,
        additional_feedback,
      });

      await feedback.save();
      interview.feedback_id = feedback._id;
      await interview.save()
      return res.status(201).json({ message: "Feedback created successfully", feedback });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/emHomepage", async (req, res) => {
  const currentTimeUTC = new Date(); // Get current UTC time

  // Fetch upcoming interviews with date greater than current UTC time
  const upcomingInterviews = await Interview.find({
    date: { $gt: currentTimeUTC },
  }).lean(); // `lean()` makes it return plain JS objects

  console.log("Current UTC Time:", currentTimeUTC);
  console.log("Upcoming Interviews:", upcomingInterviews);

  const allFields = Object.keys(upcomingInterviews[0]);
  const excludeFields = ["_id", "feedback_id", "interviewer_email", "duration", "updatedAt", "round","status"];
  const headers = allFields.filter((field) => !excludeFields.includes(field));

  res.render("emHomepage", { flag:0 , index:0,interviews: upcomingInterviews, headers:headers });
  // res.render(,{flag:0 , index:0});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
