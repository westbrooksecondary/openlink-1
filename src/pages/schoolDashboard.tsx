import { createSignal, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

type DashboardRole = "admin" | "staff";

const dashboardSections: Record<DashboardRole, string[]> = {
  admin: ["Overview", "Staff", "Students", "Attendance", "Behaviour", "Messages"],
  staff: ["Overview", "Timetable", "Classes", "Attendance", "Behaviour", "Messages"],
};

const previewRows: Record<string, string[]> = {
  Staff: ["Staff directory preview", "Role assignments preview", "Account status preview"],
  Students: ["Student list preview", "Year groups preview", "Class membership preview"],
  Attendance: ["Today's register preview", "Absence summary preview", "Attendance trends preview"],
  Behaviour: ["Recent entries preview", "Recognition summary preview", "Follow-up list preview"],
  Messages: ["Inbox preview", "Announcements preview", "Drafts preview"],
  Timetable: ["Today's timetable preview", "Next lesson preview", "Room changes preview"],
  Classes: ["Assigned classes preview", "Class lists preview", "Teaching groups preview"],
};

const appPages: Record<string, string> = {
  Attendance: "attendance",
  Behaviour: "behaviour",
  Messages: "messages",
  Timetable: "timetable",
};

export default function SchoolDashboard(props: { role: DashboardRole }) {
  const navigate = useNavigate();
  const sections = dashboardSections[props.role];
  const [activeSection, setActiveSection] = createSignal("Overview");
  const title = props.role === "admin" ? "School admin" : "Staff";
  const rows = () => previewRows[activeSection()] ?? [];
  const appPage = () => appPages[activeSection()];

  return (
    <main class="min-h-screen bg-slate-100 text-slate-900">
      <header class="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
        <div class="flex items-center gap-3">
          <div class="grid size-9 place-items-center rounded-md bg-sky-700 text-sm font-bold text-white">O</div>
          <div>
            <p class="text-sm font-semibold">Openlink</p>
            <p class="text-xs text-slate-500">{title} dashboard</p>
          </div>
        </div>
        <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50" onClick={() => navigate("/")}>
          Return to app
        </button>
      </header>

      <div class="border-b border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-950 md:px-8">
        <strong>UI preview only.</strong> School records and actions shown here are examples; nothing is saved or sent to your school.
      </div>

      <div class="mx-auto grid min-h-[calc(100vh-7rem)] max-w-screen-2xl md:grid-cols-[220px_1fr]">
        <nav aria-label={`${title} sections`} class="border-b border-slate-200 bg-white p-4 md:border-b-0 md:border-r">
          <p class="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
          <div class="grid grid-cols-2 gap-1 md:grid-cols-1">
            <For each={sections}>
              {(section) => (
                <button
                  class={`rounded-md px-3 py-2 text-left text-sm ${activeSection() === section ? "bg-sky-50 font-semibold text-sky-800" : "text-slate-700 hover:bg-slate-50"}`}
                  aria-current={activeSection() === section ? "page" : undefined}
                  onClick={() => setActiveSection(section)}
                >
                  {section}
                </button>
              )}
            </For>
          </div>
          <div class="mt-6 border-t border-slate-200 pt-4">
            <button class="w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50" onClick={() => navigate("/")}>
              Open full client
            </button>
          </div>
        </nav>

        <section class="min-w-0 p-5 md:p-8">
          <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p class="text-sm text-slate-500">{title} workspace</p>
              <h1 class="mt-1 text-2xl font-semibold tracking-normal">{activeSection()}</h1>
            </div>
            <Show when={appPage()}>
              {(page) => (
                <button class="rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800" onClick={() => navigate(`/?page=${page()}`)}>
                  Open existing {activeSection().toLowerCase()} page
                </button>
              )}
            </Show>
          </div>

          <Show when={activeSection() === "Overview"} fallback={
            <div class="overflow-hidden rounded-md border border-slate-200 bg-white">
              <div class="border-b border-slate-200 px-5 py-4">
                <h2 class="text-sm font-semibold">{activeSection()} workspace</h2>
                <p class="mt-1 text-sm text-slate-500">Preview layout only; connect an authorized Edulink operation before using this for real records.</p>
              </div>
              <div class="divide-y divide-slate-100">
                <For each={rows()}>
                  {(row, index) => (
                    <div class="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                      <span>{row}</span>
                      <span class="text-xs text-slate-400">Example {index() + 1}</span>
                    </div>
                  )}
                </For>
              </div>
            </div>
          }>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <For each={props.role === "admin"
                ? ["Staff overview", "Student groups", "Attendance", "Messages"]
                : ["Today's timetable", "Assigned classes", "Attendance", "Messages"]}>
                {(label, index) => (
                  <button
                    class="min-h-28 rounded-md border border-slate-200 bg-white p-5 text-left hover:border-sky-400 hover:bg-sky-50/40"
                    onClick={() => setActiveSection(sections[index() + 1] ?? "Overview")}
                  >
                    <span class="block text-sm font-medium text-slate-700">{label}</span>
                    <span class="mt-3 block text-xs text-slate-500">Preview data</span>
                  </button>
                )}
              </For>
            </div>
            <div class="mt-6 rounded-md border border-slate-200 bg-white p-5">
              <h2 class="text-sm font-semibold">Available client pages</h2>
              <p class="mt-1 text-sm text-slate-500">These open existing views using the signed-in Edulink account.</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <For each={["Timetable", "Attendance", "Behaviour", "Messages"]}>
                  {(section) => (
                    <button class="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50" onClick={() => {
                      const page = appPages[section];
                      if (page) navigate(`/?page=${page}`);
                    }}>
                      {section}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </section>
      </div>
    </main>
  );
}