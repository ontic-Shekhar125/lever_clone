const emNavBar = new Map([
  ["Home", "/homepage/0"],
  ["Referrals", "/emreferrals/"],
  ["Jobs", "/emjobs/"],
  ["Interviews", "/interviews/completed"],
]);
const adNavbar = new Map([
  ["Home", "/adhomepage/"],
  ["Candidates", "/adCandidates/"],
  ["Jobs", "/adjobs/"],
  ["Interviews", "/interviews/admin/"],
]);

class customNav extends HTMLElement {
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

  insertnav(flag, index) {
    if (!flag) {
      this.insert(index, emNavBar);
    } else {
      this.insert(index, adNavbar);
    }
  }

  insert(index, map) {
    let cnt = 0;
    const navcontainer = this.querySelector(".navcontainer");
    map.forEach((value, key) => {
      console.log("ll");
      const navele = document.createElement("a", { is: "nav-ele" });
      let flag = 0;
      if (cnt == index) {
        flag = 1;
      }
      navele.setAttribute("data-text", key);
      navele.setAttribute("data-path", value);
      navele.setAttribute("data-flag", flag);
      navcontainer.appendChild(navele);
      cnt++;
    });
  }
}

customElements.define("custom-nav", customNav);
