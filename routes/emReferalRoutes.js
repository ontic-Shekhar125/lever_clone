const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");
const referrer_id = "67bf5971d24618e1f498ada5";

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
          "referred_by"
        ].includes(key)
    );
    headers.push("role");
    headers.push("Referral Status");
    return headers;
  }

router.get("/",async (req,res)=>{
    const candidates = await Candidate.find({referred_by:referrer_id}).lean();
    let headers = getHeaders();
    const updatedCandidates = await processCandidates(candidates);
    if (req.headers.accept && req.headers.accept.includes("application/json")) {
        return res.json({ success: true, data: updatedCandidates, headers });
      }
    res.render("emReferrals",{flag:0,index:1,data:updatedCandidates,headers});
})
module.exports=router;