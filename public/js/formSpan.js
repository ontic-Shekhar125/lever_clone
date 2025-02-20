class formspan extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const val = this.getAttribute("data-value"); // Label text
        const fixedValue = this.getAttribute("data-fixed") || "N/A"; // Default value if not provided

        this.innerHTML = `
            <div class="relative mb-6">
                <label class="flex items-center mb-2 text-gray-600 text-sm font-medium">
                    ${val} 
                    <svg width="7" height="7" class="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
                    </svg>
                </label>
                <div class="flex items-center w-full h-11 px-5 py-2.5 bg-gray-100 text-base font-medium shadow-xs text-gray-900 border border-gray-300 rounded-full">
                    ${fixedValue}
                </div>            
            </div>
        `;
    }
}

customElements.define("form-span", formspan);
