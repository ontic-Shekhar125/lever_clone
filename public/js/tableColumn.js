class TabCol extends HTMLTableCellElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add(
      "p-5",
      "whitespace-nowrap",
      "text-sm",
      "leading-6",
      "font-medium",
      "text-gray-900"
    );
  }
}

customElements.define("custom-td", TabCol, { extends: "td" });
