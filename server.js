const express = require("express");
const app = express();
const path = require("path");
const http = require("http"); // HTTP module
const socketIo = require("socket.io"); // Socket.IO

const server = http.createServer(app); // Attach Express to HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (update this for production)
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const { initLogger } = require("./socketFunctions"); // Import initLogger
initLogger(io); // Initialize io in activityLogger.js
const port = 3000;

const mongoose = require("mongoose");

app.use(express.json()); //
app.use(express.urlencoded({ extended: true }));

const Employee = require(path.join(__dirname, "./models/Employee")); // Ensure correct path
const Job = require(path.join(__dirname, "./models/jobs"));
const Interview = require(path.join(__dirname, "./models/interview"));
const Feedback = require(path.join(__dirname, "./models/feedback"));
const Candidate = require(path.join(__dirname, "./models/candidate"));
const CandidatesRouter = require(path.join(
  __dirname,
  "./routes/CandidateRoutes"
));
const ReferalFormRouter = require(path.join(
  __dirname,
  "./routes/ReferalRoutes"
));

const employeeReferralRouter = require(path.join(
  __dirname,
  "./routes/emReferalRoutes"
));
const ScheduleInterviewRouter = require(path.join(
  __dirname,
  "./routes/ScheduleInterviewRoutes"
));
const interviewRouter = require(path.join(
  __dirname,
  "./routes/interviewRoutes"
));

const feedbackRouter = require(path.join(__dirname, "./routes/feedbackRoutes"));

const homepageRouter = require(path.join(__dirname, "./routes/homepageRoutes"));
function getjobheaders() {
  const excludes = ["_id", "__v","admin"];
  return Object.keys(Job.schema.paths).filter(
    (item) => !excludes.includes(item)
  );
}


app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/adCandidates", CandidatesRouter);
app.use("/referalForm", ReferalFormRouter);
app.use("/scheduleInt", ScheduleInterviewRouter);
app.use("/emreferrals", employeeReferralRouter);
app.use("/interviews", interviewRouter);
app.use("/feedback", feedbackRouter);
app.use("/homepage", homepageRouter);
const referrer = {
  _id: "67bd72b31f89e8105cae2006",
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

app.get("/adhomepage", async (req, res) => {
  const currentTimeUTC = new Date();
  const alljobs = await Job.find({});
  const jobs = alljobs.length;
  const allCandidates = await Candidate.find({});
  const candidates = allCandidates.length;
  const Interviews = await Interview.find({ estatus: "Scheduled" });
  const feedbacks = await Feedback.find({});
  const pendingFeedbacks = await Interview.find({
    date: { $lt: currentTimeUTC },
    estatus: "Completed",
    feedbackId: { $exists: false }, // Find documents where feedbackId does not exist
  });
  res.render("adHomepage", {
    flag: 1,
    index: 0,
    jobs,
    candidates,
    scheduledInterviews: Interviews.length,
    pendingFeedback: pendingFeedbacks.length,
    feedbacks: feedbacks.length,
  });
});
app.get("/adjobs", (req, res) => {
  res.render("adjobs", { flag: 1, index: 2 });
});

app.get("/editjobs/:id", async (req, res) => {
  try {
    const headers = getjobheaders();
    const jobId = req.params.id;

    // Convert jobId to a MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).send("Invalid Job ID");
    }

    const jobdata = await Job.findById(new mongoose.Types.ObjectId(jobId));

    if (!jobdata) {
      return res.status(404).send("Job not found");
    }

    res.render("editjobs", { headers, flag: 1, index: 2, data: jobdata });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/editjobs/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("hello");
    // Convert jobId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job ID format" });
    }

    const updatedJobData = req.body;

    // Find job by ID and update
    const updatedJob = await Job.findByIdAndUpdate(
      new mongoose.Types.ObjectId(jobId), // Convert string to ObjectId
      updatedJobData,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    //res.json({ message: "Job updated successfully", job: updatedJob });
    res.send(`
        <script>
            alert("Job updated successfully!");
            window.location.href = "/adjobs";
        </script>
    `);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/createjob", async (req, res) => {
  const excludes = ["_id", "__v","admin"];
  const headers = Object.keys(Job.schema.paths).filter(
    (item) => !excludes.includes(item)
  );
  res.render("createjob", { headers, flag: 1, index: 2 });
});

app.post("/createjob", async (req, res) => {
  try {
    const { role, department, locationType, workType, location } =
      req.body;

    // Validate required fields
    const admin="John Doe";
    if (
      !admin ||
      !role ||
      !department ||
      !locationType ||
      !workType ||
      !location
    ) {
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
    res.send(`
      <script>
          alert("Job created successfully!");
          window.location.href = "/adjobs";
      </script>
    `);  } catch (error) {
    console.error("Error creating job:", error);
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

    res.render("referalForm", { jobdata, flag: 0, index: 1, flag2: 1 });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/adCandidates/:id", async (req, res) => {
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

app.get("/jobsdata", async (req, res) => {
  const jobsdata = await Job.find({}).select("-__v");
  res.json(jobsdata);
});
app.get("/emjobs", async (req, res) => {
  res.render("emjobs", { flag: 0, index: 2 });
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
    const excludeFields = [
      "_id",
      "feedback_id",
      "interviewer_email",
      "duration",
      "updatedAt",
      "round",
      "estatus",
    ];
    const headers = allFields.filter((field) => !excludeFields.includes(field));

    res.render("upinterview", {
      interviews: upcomingInterviews,
      headers: headers,
    });
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
    const excludeFields = [
      "_id",
      "feedback_id",
      "interviewer_email",
      "google_meet_link",
      "updatedAt",
      "round",
      "estatus",
    ];
    const headers = allFields.filter((field) => !excludeFields.includes(field));
    headers.push("Feedback status");
    res.render("cominterview", {
      flag: 0,
      index: 3,
      interviews: completedInterviews,
      headers: headers,
    });
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
    const excludes = [
      "createdAt",
      "updatedAt",
      "_id",
      "__v",
      "interview_id",
      "interviewer_email",
    ];
    const headers = Object.keys(Feedback.schema.paths).filter(
      (item) => !excludes.includes(item)
    );
    res.render("feedback", {
      flag: 0,
      index: 3,
      interview,
      feedback: feedback || null,
      headers,
    });
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

    const {
      recommendation,
      technical_score,
      behavioral_score,
      additional_feedback,
    } = req.body;

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
      return res
        .status(200)
        .json({ message: "Feedback updated successfully", feedback });
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
      await interview.save();
      return res
        .status(201)
        .json({ message: "Feedback created successfully", feedback });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
//module.exports = { app, server, logActivity }; // Export logActivity
