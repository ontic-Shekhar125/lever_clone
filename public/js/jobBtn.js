class jobBtn extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
        const val=this.getAttribute("data-value");
        const path=this.getAttribute("data-path");
      this.innerHTML = `                            
                         

              <button   type="button" class="JobBtn w-32 h-10 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-800 transition-all duration-500">
                ${val}
                   </button>
                                
                                `;
    const btn=this.querySelector(".JobBtn");
    btn.addEventListener("click",()=>{
        window.location.href=`${path}`;
    });
    }
  } 
  customElements.define("job-btn", jobBtn); // (2)