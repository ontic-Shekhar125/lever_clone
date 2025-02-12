const mongoose=require('mongoose');

const jobsschema=new mongoose.Schema({
    admin: String,
    role: String,
    department: String,
    locationType: String,
    workType: String,
    location:String
});
const jobs=mongoose.model('jobss',jobsschema);

module.exports=jobs;


