const homearr = [
  ["Upcoming Interviews", "/interviews/upcoming"],
  ["Completed Interviews", "/interviews/completed"],
  ["Pending Feedback", "/interviews/pending"],
  ["Upcoming Interviews", "/interviews/upcoming"],
];

const path = "http://localhost:3000";

async function loadHomeData() {
  for (const [key, value] of homearr) {
    const homeele = document.createElement("home-ele");
    homeele.setAttribute("data-path",value);
    homeele.setAttribute("data-label",key);
    const homegrid = document.querySelector(".homegrid");
    homegrid.appendChild(homeele);
    setTimeout(async () => {
      const tableInsert = homeele.querySelector(".tableInsert");
      try {
        const { data, headers } = await getData(value); // Await works properly now
        const customtable = document.createElement("custom-table");
        customtable.setAttribute("data-headers", JSON.stringify(headers));
        customtable.setAttribute("data-insert", JSON.stringify(data));

        tableInsert.appendChild(customtable); // Append it to DOM
      } catch (error) {
        console.error(`Error fetching data for ${key}:`, error);
      }
    }, 10);
  }
}

async function getData(value) {
  try {
    const response = await fetch(`http://localhost:3000${value}`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const { data, headers } = await response.json();
    console.log("Fetched Upcoming Interviews:", data);

    return { data, headers };
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return { data: [], headers: [] };
  }
}

class customHomepage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="container mx-auto mt-6 px-2">
      <div class="homegrid grid grid-cols-2 gap-4">
        
      </div>
    </div>
  `;

    loadHomeData();
  }
}

customElements.define("custom-home", customHomepage);
