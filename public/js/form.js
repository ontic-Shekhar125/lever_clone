function getOptionsName(candidates)
{
  return JSON.stringify(candidates.map((candidate)=>{
    return {label:candidate.name,value:candidate._id};
  }));
}
function getOptionsRoles(jobs)
{
  return JSON.stringify(jobs.map((job)=>{
    return {label:job.role,value:job._id};
  }));
}
function getNames(candidates)
{
  let names=[];
  candidates.forEach((candidate)=>{
    names.push(candidate.name);
  })
  return names;
}
function getJobRoles(jobs)
{
  let roles=[];
  jobs.forEach((job)=>{
    roles.push(job.role);
  })
  return roles;
}
const formConfig = {
  recommendation: {
    formatter: () => {
      const options = ["Strong Yes", "Yes", "Neutral", "No", "Strong No"];
      const formdropdown = document.createElement("form-dropdown");
      formdropdown.setAttribute("data-options", options);
      formdropdown.setAttribute("data-value", "recommendation");
      return formdropdown;
    },
  },
  candidate_email: {
    formatter: (interview) => {
      const formSpan = document.createElement("form-span");
      formSpan.setAttribute("data-fixed", interview.candidate_email);
      formSpan.setAttribute("data-value", "Candidate Email");
      return formSpan;
    },
  },
  workType: {
    formatter: () => {
      const options = JSON.stringify(["Full-time", "Contract", "Part-time"]);
      const formdropdown = document.createElement("form-dropdown");
      formdropdown.setAttribute("data-options", options);
      formdropdown.setAttribute("data-label", "Work Type");
      formdropdown.setAttribute("data-value", "workType");
      return formdropdown;
    },
  },
  locationType: {
    formatter: () => {
      const options = JSON.stringify(["Remote", "On-site", "Hybrid"]);
      const formdropdown = document.createElement("form-dropdown");
      formdropdown.setAttribute("data-options", options);
 
      formdropdown.setAttribute("data-label", "Location Type");
      formdropdown.setAttribute("data-value", "locationType");
      return formdropdown;
    },
  },
  candidateId: {
    formatter: (...args) => {
      
      const options = getOptionsName(args[1].candidates);

      const formdropdown = document.createElement("form-dropdown");
      formdropdown.setAttribute("data-options", options);
      formdropdown.setAttribute("data-label", "Candidate Name");
      formdropdown.setAttribute("data-value", "candidateId");
      return formdropdown;
    },
  },
  jobId: {
    formatter: (...args) => {
      const options = getOptionsRoles(args[1].jobs);
      
      const formdropdown = document.createElement("form-dropdown");
      formdropdown.setAttribute("data-options", options);
      formdropdown.setAttribute("data-label", "Job Role");
      formdropdown.setAttribute("data-value", "jobId");

      return formdropdown;
    },
  },
  date:{
    formatter:()=>{
      const formDate = document.createElement("form-date");
      formDate.setAttribute("data-label", "Interview Date and time");
      formDate.setAttribute("data-value", "date");


      return formDate;
    }
  }
  ,
  interviewerId:{
    formatter:(...args)=>{
      const options = getOptionsName(args[1].employees);
      
      const formdropdown = document.createElement("form-dropdown");
      formdropdown.setAttribute("data-options", options);
      formdropdown.setAttribute("data-value", "interviewerId");
      formdropdown.setAttribute("data-label", "Interviewer");
      return formdropdown;
    }
  }
};

class wholeForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    //const onaction=this.getAttribute("data-onaction");
    const headers = JSON.parse(this.getAttribute("data-headers"));
    const interview = JSON.parse(this.getAttribute("data-interview"));
    const optionsObj=JSON.parse(this.getAttribute("data-optionsObj"));
    this.innerHTML = `
            <form method="POST" class="formclass"></form>
        `;
    const data = JSON.parse(this.getAttribute("data-insert"));
    this.createform(headers, interview, data,optionsObj);
   
    document.addEventListener(('DOMContentLoaded'),()=>{
      if(data) 
        {
          
            this.populateForm(data);
          
          
        }
    })

    // setTimeout(()=>{
    //   
    // },4000)
  }
  insertbutton(form) {
    const btn = document.createElement("form-button");
    form.appendChild(btn);
  }
  createform(headers, interview, data,optionsObj) {
    const form = document.querySelector(".formclass");
    headers.forEach((header) => {
      if (formConfig[header] && formConfig[header].formatter) {
        form.appendChild(formConfig[header].formatter(interview,optionsObj,form));
      } else {
        const formele = document.createElement("form-ele");
        formele.setAttribute("data-value", header);
        if (data) {
          console.log(data);
          formele.value = data[header];
        }
        form.appendChild(formele);
      }
    });
    this.insertbutton(form);
  }
  populateForm(data) {
    
    
    for (let key in data) {
      
      const field = document.querySelector(`[name='${key}']`);
     console.log(field);
      if (field) {
        field.value = data[key];
        
        // Set value for both text inputs and selects
      }
    }
  }
}

customElements.define("whole-form", wholeForm);
