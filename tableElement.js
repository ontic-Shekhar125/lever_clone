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
                <tr class="tableHeader bg-gray-200"></tr>  <!-- This will hold <custom-th> -->
              </thead>
              <tbody class="tableBody divide-y divide-gray-300"></tbody> <!-- This will hold <custom-td> -->
            </table>
          </div>
        </div>
      </div>
    </div>`;

    //   // Insert dynamic columns & rows
    //   this.insertColumns(["Name", "Email", "Role"]);
    //   this.insertRows([
    //     { name: "Alice", email: "alice@example.com", role: "Engineer" },
    //     { name: "Bob", email: "bob@example.com", role: "Designer" }
    //   ]);
    // }

    // insertColumns(columns) {
    //   const headerRow = this.querySelector(".tableHeader");
    //   columns.forEach(col => {
    //     const th = document.createElement("th", { is: "custom-th" });
    //     th.innerText = col;
    //     headerRow.appendChild(th);
    //   });
    // }

    // insertRows(data) {
    //   const tbody = this.querySelector(".tableBody");
    //   data.forEach(row => {
    //     const tr = document.createElement("tr");
    //     tr.innerHTML = `
    //       <td is="custom-td">${row.name}</td>
    //       <td is="custom-td">${row.email}</td>
    //       <td is="custom-td">${row.role}</td>`;
    //     tbody.appendChild(tr);
    //   });
    // }
  }
}

customElements.define("custom-table", CustomTable);
