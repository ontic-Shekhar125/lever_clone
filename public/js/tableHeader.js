class CustomTh extends HTMLTableCellElement {
    constructor() {
        super();
    }

    connectedCallback() {
       // this.textContent = this.getAttribute("data-text") || "Custom Header";
        this.classList.add(
            "p-5",
            "text-left",
            "whitespace-nowrap",
            "text-sm",
            "leading-6",
            "font-semibold",
            "text-gray-900",
            "capitalize"
        );
        this.setAttribute("scope", "col");
    }
}

customElements.define("custom-th", CustomTh, { extends: "th" });
