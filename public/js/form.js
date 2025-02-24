
const formConfig = {

    recommendation: {
        
        formatter: () =>  { 
            const options=["Strong Yes", "Yes", "Neutral", "No", "Strong No"];
            const formdropdown=document.createElement('form-dropdown');
            formdropdown.setAttribute('data-options',options);
            formdropdown.setAttribute('data-value',"recommendation");
            return formdropdown;
        }
      },
      candidate_email:
      {
        formatter: (interview) =>  { 
           
            const formSpan=document.createElement('form-span');
            formSpan.setAttribute('data-fixed',interview.candidate_email);
            formSpan.setAttribute('data-value',"Candidate Email");
            return formSpan;
        }
      },
      workType:
      {
        formatter: () =>  { 
            const options=["Full-time", "Contract", "Part-time"];
            const formdropdown=document.createElement('form-dropdown');
            formdropdown.setAttribute('data-options',options);
            formdropdown.setAttribute('data-value',"workType");
            return formdropdown;
        }
      },
      locationType:
      {
        formatter: () =>  { 
            const options=["Remote", "On-site", "Hybrid"];
            const formdropdown=document.createElement('form-dropdown');
            formdropdown.setAttribute('data-options',options);
            formdropdown.setAttribute('data-value',"locationType");
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
        const headers=JSON.parse(this.getAttribute("data-headers"));
        const interview=JSON.parse(this.getAttribute("data-interview"));

        this.innerHTML=`
            <form method="POST"  class="formclass"></form>
        `;
        const data=this.getAttribute("data-insert");
        this.createform(headers,interview,data);
        
        if(data)
        {
            this.populateForm(JSON.parse(data));
        }


    }
    insertbutton(form)
    {
        const btn=document.createElement('form-button');
        form.appendChild(btn);
        
        
    }
    createform(headers,interview,data)
    {
        const form=document.querySelector('.formclass');
        headers.forEach((header)=>{

            if (formConfig[header] && formConfig[header].formatter) {
                form.appendChild(formConfig[header].formatter(interview));
            } else {
                const formele=document.createElement('form-ele');
                formele.setAttribute('data-value',header);
                if(data)
                {
                    console.log(data);
                    formele.value=data[header];
                }
                form.appendChild(formele);
            }
        });
        this.insertbutton(form);


    }
     populateForm(data) {
        
        for (let key in data) {
            const field = document.querySelector(`[name='${key}']`);
            
            if (field) {
                field.value = data[key]; 
               // Set value for both text inputs and selects
            }
        }
    }
}

customElements.define("whole-form", wholeForm);

