  class headingele extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const val=this.getAttribute("data-value");
      this.innerHTML = `
            <div>
            <h1
            class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-8"
            >
            <span
                class="text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600"
            >
                ${val}
            </span>
            </h1>
            </div>`;

    }

  
  }
  
  customElements.define("custom-heading", headingele);