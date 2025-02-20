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

        this.createform(headers,interview);
        
    }
    insertbutton(form)
    {
        const btn=document.createElement('form-button');
        form.appendChild(btn);
        
        
    }
    createform(headers,interview)
    {
        const form=document.querySelector('.formclass');
        headers.forEach((header)=>{

            if (formConfig[header] && formConfig[header].formatter) {
                form.appendChild(formConfig[header].formatter(interview));
            } else {
                const formele=document.createElement('form-ele');
                formele.setAttribute('data-value',header);
                form.appendChild(formele);
            }
        });
        this.insertbutton(form);

    }
}

customElements.define("whole-form", wholeForm);

