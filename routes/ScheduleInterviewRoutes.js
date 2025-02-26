const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");
const Job = require(path.join(__dirname, "../models/jobs"));
const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path
const Interview = require(path.join(__dirname, "../models/interview")); // Ensure correct path


router.get("/", async (req,res)=>{
    res.render("scheduleInt",{flag:1,index:3});
})
module.exports=router;