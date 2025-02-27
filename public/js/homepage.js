class customHomepage extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
  <nav class="bg-gray-800 sticky top-0 z-1">
  <div class="ml-30 max-w-7xl px-2 sm:px-6 lg:px-8">
    <div class="relative flex h-16 items-center justify-between">
  
      <div
        class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
      >
        <div class="flex shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
          />
        </div>
        <div class=" sm:ml-6 sm:block">
          <div class="navcontainer flex space-x-4">
          </div>
        </div>
      </div>
    </div>
  </div>
  </nav>
  `;
  
      const index = +this.getAttribute("data-index");
      const flag = +this.getAttribute("data-flag");
      this.insertnav(flag, index);
    }
}
  
  customElements.define("custom-nav", customHomepage);