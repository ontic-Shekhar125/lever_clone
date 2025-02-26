class NavEle extends HTMLAnchorElement {
  // Fix 1: Use a meaningful class name and extend HTMLAnchorElement
  constructor() {
    super();
  }

  connectedCallback() {
    const path = this.getAttribute("data-path");
    const text = this.getAttribute("data-text");
    const flag = +this.getAttribute("data-flag"); // Convert to number

    this.setAttribute("href", path);
    this.innerText = text;
    this.insertClass(flag);
  }

  insertClass(flag) {
    const op1 = ["bg-gray-900", "text-white"];
    const op2 = ["text-gray-300", "hover:bg-gray-700", "hover:text-white"];
    const op = ["rounded-md", "px-3", "py-2", "text-sm", "font-medium"];
    const op3 = flag ? op.concat(op1) : op.concat(op2);
    this.classList.add(...op3); // Fix 2: Use spread operator and ternary operator for cleaner code
  }
}

// Fix 3: Properly define custom element extending <a>
customElements.define("nav-ele", NavEle, { extends: "a" });
