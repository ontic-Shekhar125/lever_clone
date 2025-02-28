const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");
const Job = require(path.join(__dirname, "../../models/jobs"));
const Employee = require(path.join(__dirname, "../../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../../models/candidate")); // Ensure correct path
const Interview = require(path.join(__dirname, "../../models/interview")); // Ensure correct path
const Feedback = require(path.join(__dirname, "../../models/feedback")); // Ensure correct path

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
  
  async function getEstatus(objectId, role, candidate) {
    const interview = await checkCandidateInInterview(objectId, role);
    let status = 0;
    if(interview)
    {
      candidate.interviewId = interview._id;
      candidate.date=interview.date;
      candidate.google_meet_link=interview.google_meet_link;
      const employee = await Employee.findById(interview.interviewerId);
      candidate.interviewerName=employee.name;

    }
    if (interview && interview.estatus === "Completed") {
      if (interview.feedbackId) {
        status = 3;
        
      } else status = 2;
    } else if (interview && interview.estatus === "Scheduled") {
      status = 1;
    }
    return status;
  }
  async function addStatus(updatedCandidates) {
    const candidatesWithStatus = await Promise.all(
      updatedCandidates.map(async (candidate) => {
        const objectId = candidate._id;
        const role = candidate.role;
        candidate["eStatus"] = await getEstatus(objectId, role, candidate);
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

  module.exports = {
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
    Feedback

  };
  