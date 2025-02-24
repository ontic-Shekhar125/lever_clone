class SearchableDropdown extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const label = this.getAttribute("data-value");
        let options = this.getAttribute("data-options").split(",");
        this.render(label, options);
    }

    render(label, options) {
        this.shadowRoot.innerHTML = `
            <style>
                .dropdown-container {
                    position: relative;
                    width: 100%;
                }

                .dropdown-box {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 25px;
                    background: white;
                    cursor: pointer;
                }

                .dropdown-list {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    max-height: 150px;
                    overflow-y: auto;
                    background: white;
                    border: 1px solid #ccc;
                    border-top: none;
                    border-radius: 5px;
                    z-index: 10;
                    display: none;
                }

                .dropdown-item {
                    padding: 10px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .dropdown-item:hover {
                    background: #f3f4f6;
                }

                .search-box {
                    width: 100%;
                    padding: 8px;
                    border: none;
                    border-bottom: 1px solid #ccc;
                    outline: none;
                }
            </style>

            <div class="dropdown-container">
                <label class="text-gray-600 text-sm font-medium mb-2">${label}</label>
                <div class="dropdown-box">Select an option</div>
                <div class="dropdown-list">
                    <input type="text" class="search-box" placeholder="Search...">
                    <div class="options">
                        ${options.map(option => `<div class="dropdown-item" data-value="${option}">${option}</div>`).join('')}
                    </div>
                </div>
                <input type="hidden" name="${label}" value="">
            </div>
        `;

        this.addEventListeners();
    }

    addEventListeners() {
        const dropdownBox = this.shadowRoot.querySelector(".dropdown-box");
        const dropdownList = this.shadowRoot.querySelector(".dropdown-list");
        const searchBox = this.shadowRoot.querySelector(".search-box");
        const optionsContainer = this.shadowRoot.querySelector(".options");
        const hiddenInput = this.shadowRoot.querySelector("input[type='hidden']");

        dropdownBox.addEventListener("click", () => {
            dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
            searchBox.focus();
        });

        searchBox.addEventListener("input", () => {
            const filter = searchBox.value.toLowerCase();
            const options = optionsContainer.querySelectorAll(".dropdown-item");

            options.forEach(option => {
                option.style.display = option.textContent.toLowerCase().includes(filter) ? "block" : "none";
            });
        });

        optionsContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("dropdown-item")) {
                dropdownBox.textContent = event.target.textContent;
                hiddenInput.value = event.target.getAttribute("data-value");
                dropdownList.style.display = "none";
            }
        });

        document.addEventListener("click", (event) => {
            if (!this.contains(event.target)) {
                dropdownList.style.display = "none";
            }
        });
    }
}

customElements.define("form-dropdown", SearchableDropdown);
