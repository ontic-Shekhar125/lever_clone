const headerHash = new Map([
  ["google_meet_link", "Google Meet Link"],
  ["eStatus", "Action"],
  ["current_company", "Current Company"],
  ["current_location", "Current Location"],
  ["referred_by", "Referred By"],
  ["interviewerName","Interviewer Name"]
]);
const columnConfig = {
  date: {
    type: "date",
    formatter: (row) =>
      new Date(row.date).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
  },
  google_meet_link: {
    type: "link",
    formatter: (row) => {
      const meetLink = row.google_meet_link.startsWith("http")
        ? row.google_meet_link
        : `https://${row.google_meet_link}`;
      return `<a href='${meetLink}' target="_blank" class="text-blue-600 underline">Meet Link</a>`;
    },
  },
  status: {
    type: "status",
    formatter: (row) =>
      `<span class="px-2 py-1 rounded ${
        row.status === "Scheduled"
          ? "bg-green-200 text-green-800"
          : "bg-gray-200 text-gray-800"
      }">${row.status}</span>`,
  },
  "Feedback Action": {
    type: "link",
    formatter: (row) => {
      if (row.hasOwnProperty("feedbackId") && row.feedbackId) {
        return `<a class="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600" href='/feedback/${row._id}'>Edit Feedback</a>`;
      } else {
        return `<a class="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600" href='/feedback/${row._id}'>Add Feedback</a>`;
      }
    },
  },
  eStatus: {
    type: "button",
    formatter: (row) => {
      const statusOptions = {
        1: { text: "Edit Interview Info", color: "blue", hover: "blue-600" },
        0: { text: "Schedule Interview", color: "green", hover: "green-600" },
        2: { text: "Waiting Feedback", color: "yellow", hover: "yellow-600" },
        3: { text: "View the Feedback", color: "purple", hover: "purple-600" },
      };
      console.log(row);
      const status = statusOptions[row.eStatus];

      if (row.eStatus !== 3) {
        return `<a class="px-3 py-1 text-white bg-${status.color}-500 rounded hover:bg-${status.hover}" 
                    href='/scheduleint/${row._id}/${row.jobId}' aria-label="${status.text}">
                  ${status.text}
                </a>`;
      } else {
        return `<a class="px-3 py-1 text-white bg-${status.color}-500 rounded hover:bg-${status.hover}" 
                    href='/feedback/${row.interviewId}/1' aria-label="${status.text}">
                  ${status.text}
                </a>`;
      }

      return `<span class="text-gray-500 italic">No Action</span>`; // Handles unexpected statuses
    },
  },
  "Referral Status": {
    formatter: (row) => {
      const statusOptions = {
        1: { text: "Interview Scheduled", color: "blue", hover: "blue-600" },
        0: { text: "Not Shortlisted", color: "green", hover: "green-600" },
        2: {
          text: "Interview Completed",
          color: "yellow",
          hover: "yellow-600",
        },
        3: { text: "Selected", color: "purple", hover: "purple-600" },
      };
      console.log(row);
      const status = statusOptions[row.eStatus];

      return `<a class="px-3 py-1 text-white bg-${status.color}-500 rounded " 
                     aria-label="${status.text}">
                  ${status.text}
                </a>`;

      return `<span class="text-gray-500 italic">No Action</span>`; // Handles unexpected statuses
    },
  },
};

class CustomTable extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <div class="flex flex-col">
      <div class="overflow-x-auto pb-4">
        <div class="min-w-full inline-block align-middle">
          <div class="overflow-hidden border rounded-lg border-gray-300">
            <table class="table-auto min-w-full rounded-xl">
              <thead>
                <tr class="tableHeader bg-gray-50"></tr>  <!-- This will hold <custom-th> -->
              </thead>
              <tbody class="tableBody divide-y divide-gray-300"></tbody> <!-- This will hold <custom-td> -->
            </table>
          </div>
        </div>
      </div>
    </div>`;

    const headers = JSON.parse(this.getAttribute("data-headers"));
    this.insertheaders(headers);
    this.insertdata(JSON.parse(this.getAttribute("data-insert")), headers);
  }

  insertheaders(headers) {
    const headerRow = this.querySelector(".tableHeader");
    headerRow.innerHTML = "";
    headers.forEach((text) => {
      const th = document.createElement("th", { is: "custom-th" }); // Creates <custom-th>
      th.setAttribute("label", text);
      th.innerText = headerHash.has(text) ? headerHash.get(text) : text;
      headerRow.appendChild(th);
    });
  }
  insertdata(data, headers) {
    const tableBody = this.querySelector(".tableBody");
    tableBody.innerHTML = "";
    console.log("Parsed Data:", data);

    data.forEach((row) => {
      const tr = document.createElement("tr");

      headers.forEach((header) => {
        const td = document.createElement("td", { is: "custom-td" });

        // Apply formatter if columnConfig exists
        if (columnConfig[header] && columnConfig[header].formatter) {
          td.innerHTML = columnConfig[header].formatter(row);
        } else {
          td.innerText = row[header] || "N/A"; // Default text
        }

        tr.appendChild(td);
      });

      tableBody.appendChild(tr);
    });
  }
}

customElements.define("custom-table", CustomTable);
