class homeElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const val = this.getAttribute("data-value");
    const label = this.getAttribute("data-label");
    this.innerHTML = `
                <div class="table-container bg-white shadow-md rounded-lg p-4">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-semibold">Upcoming Interviews</h2>
                        <div class="flex flex-col gap-2 shrink-0 sm:flex-row">
                            <button
                              class="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                              type="button"
                            >
                              <a href="jobs">View All </a>
                            </button>
                          </div>                    </div>
                    <div class="overflow-auto max-h-50"> <!-- Scrollable Wrapper -->

                        <custom-table 
                            data-interviews='<%- JSON.stringify(interviews) %>' 
                            data-headers='<%- JSON.stringify(headers) %>'>
                        </custom-table>
                    </div>
                </div>
        `;
  }
}

customElements.define("form-ele", homeElement);
