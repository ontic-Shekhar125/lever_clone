const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const path = require("path");

const Employee = require(path.join(__dirname, "../models/Employee")); // Ensure correct path
const Candidate = require(path.join(__dirname, "../models/candidate")); // Ensure correct path

router.get("/",async (req,res)=>{
    res.render("emReferrals",{flag:0,index:1});
})
module.exports=router;