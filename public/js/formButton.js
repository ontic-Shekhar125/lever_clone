class formButton extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const text=this.getAttribute("data-text");
        const buttonText="Submit"
        this.innerHTML =
         `
            <button type="submit" class="w-52 h-12 shadow-sm rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 text-white text-base font-semibold leading-7">${buttonText} </button>

        `;
    }
}

customElements.define("form-button", formButton);