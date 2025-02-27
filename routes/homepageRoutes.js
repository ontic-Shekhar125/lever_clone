const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const path = require("path");

const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path
const Interview = require(path.join(__dirname, "../models/interview")); // Ensure correct path
const Job = require(path.join(__dirname, "../models/jobs")); // Ensure correct path


router.get("/:id",async (req,res)=>{
    const index=0;
    const flag=req.params.id;
    res.render("homepage",{flag,index});
})

module.exports=router;