class jobRef extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.innerHTML = `                            
                         

            <select class="jobDropdown mt-4 text-sm leading-6 font-semibold text-gray-900 capitalize block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none ">
                <option value="" disabled selected>Choose job</option>

            </select>
                                
                                `;
    }
  } 
  customElements.define("job-ref", jobRef); // (2)