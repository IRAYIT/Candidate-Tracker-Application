import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState, useRef, useEffect, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Constants ────────────────────────────────────────────────────────────────
const SKILL_OPTIONS = [
  "Java","Spring Boot","Spring MVC","Spring Security","Spring Cloud","Hibernate","JPA","JDBC",
  "Maven","Gradle","JUnit","Mockito","Microservices","REST API","SOAP","Apache Kafka","RabbitMQ",
  "C#",".NET","ASP.NET","ASP.NET Core","Entity Framework","LINQ","WPF","WCF","Blazor","NUnit","SignalR",
  "JavaScript","TypeScript","React","Angular","Vue.js","Next.js","Nuxt.js","Redux","MobX",
  "HTML","CSS","Sass","Tailwind CSS","Bootstrap","Material UI","Ant Design","jQuery","Webpack","Vite",
  "Node.js","Express.js","NestJS","FastAPI","Django","Flask","Python","Ruby on Rails","PHP","Laravel",
  "Go","Rust","Kotlin","Scala","Android","iOS","Swift","React Native","Flutter","Dart",
  "SQL","MySQL","PostgreSQL","SQL Server","Oracle","SQLite","MongoDB","Redis","Elasticsearch",
  "Cassandra","DynamoDB","Firebase","Neo4j","MariaDB",
  "AWS","Azure","GCP","Docker","Kubernetes","Terraform","Ansible","Jenkins","GitHub Actions",
  "GitLab CI/CD","CI/CD","Linux","Bash","Nginx","Prometheus","Grafana","ELK Stack","Splunk",
  "Selenium","TestNG","Cypress","Playwright","Jest","Postman","Swagger","JMeter","Appium",
  "Manual Testing","Automation Testing","Performance Testing","API Testing","UAT",
  "Machine Learning","Deep Learning","TensorFlow","PyTorch","Power BI","Tableau",
  "Data Analysis","Data Science","Apache Spark","Git","GitHub","GitLab","JIRA","Confluence",
  "Agile","Scrum","Kanban","GraphQL","gRPC","OAuth","JWT","Design Patterns","System Design","SonarQube",
];

const TECHNOLOGY_SKILLS = {
  JAVA:           ["Core Java","Spring Boot","Hibernate","Microservices","REST API","Spring Security","JPA","Maven"],
  DOTNET:         [".NET Core","ASP.NET","C#","Entity Framework","LINQ","Blazor","SignalR"],
  TESTING:        ["Manual Testing","Selenium","Cypress","JMeter","Playwright","Postman","TestNG","Appium"],
  ANGULAR:        ["Angular","TypeScript","RxJS","NgRx","HTML","CSS","Material UI"],
  REACTJS:        ["React","Redux","JavaScript","TypeScript","Tailwind CSS","Next.js","Vite"],
  "AWS DEVOPS":   ["AWS","Docker","Kubernetes","Jenkins","Terraform","Ansible","GitHub Actions","Linux"],
  "AZURE DEVOPS": ["Azure","CI/CD","Terraform","GitHub Actions","Docker","Kubernetes"],
  "SQL DEVELOPER":["SQL","PL/SQL","MySQL","PostgreSQL","Oracle","SQL Server","MongoDB"],
};

const TECHNOLOGY_OPTIONS = [
  { value: "JAVA",          label: "JAVA" },
  { value: "DOTNET",        label: "DOTNET" },
  { value: "TESTING",       label: "TESTING" },
  { value: "ANGULAR",       label: "ANGULAR" },
  { value: "REACTJS",       label: "REACTJS" },
  { value: "AWS DEVOPS",    label: "AWS DEVOPS" },
  { value: "AZURE DEVOPS",  label: "AZURE DEVOPS" },
  { value: "SQL DEVELOPER", label: "SQL DEVELOPER" },
  { value: "Other",         label: "Other" },
];

const ROLE_LABELS = ["Backend","Frontend","Testing","DevOps","Database","Mobile","AI/ML","Full Stack","Other"];

const createEmptyRole = () => ({
  id: Date.now() + Math.random(),
  roleLabel: "",
  technology: "",
  customTech: "",
  skills: [],
  resourcePool: [],
  selectedResourceIds: [],
  loading: false,
});

function groupResources(list) {
  const managerIds = new Set(list.filter((r) => r.managerId != null).map((r) => r.managerId));
  const tree = list.filter((r) => managerIds.has(r.id)).map((mgr) => ({
    manager: mgr,
    reportees: list.filter((r) => r.managerId === mgr.id),
  }));
  const independent = list.filter((r) => r.managerId == null && !managerIds.has(r.id));
  return { tree, independent };
}

// ─── Hook: smart dropdown direction ──────────────────────────────────────────
// Returns "up" if there isn't enough space below the trigger, else "down"
function useDropdownDirection(triggerRef, open) {
  const [direction, setDirection] = useState("down");
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setDirection(spaceBelow < 220 ? "up" : "down");
  }, [open, triggerRef]);
  return direction;
}

// ─── SkillTagInput ────────────────────────────────────────────────────────────
function SkillTagInput({ selected, onChange, technology, error }) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const direction = useDropdownDirection(triggerRef, open);

  useEffect(() => {
    const h = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pool = technology && TECHNOLOGY_SKILLS[technology]
    ? [...TECHNOLOGY_SKILLS[technology], ...SKILL_OPTIONS.filter((s) => !TECHNOLOGY_SKILLS[technology].includes(s))]
    : SKILL_OPTIONS;

  const filtered = pool.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !selected.includes(s));
  const showOther = input.trim() && !SKILL_OPTIONS.some((s) => s.toLowerCase() === input.trim().toLowerCase()) && !selected.includes(input.trim());
  const options = showOther ? [...filtered, "__OTHER__"] : filtered;

  const add = (s) => { if (!selected.includes(s)) onChange([...selected, s]); setInput(""); setOpen(false); setHi(-1); inputRef.current?.focus(); };
  const remove = (s) => onChange(selected.filter((x) => x !== s));

  const onKey = (e) => {
    if (!options.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => (h + 1) % options.length); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHi((h) => (h - 1 + options.length) % options.length); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (hi >= 0 && options[hi]) add(options[hi] === "__OTHER__" ? input.trim() : options[hi]);
      else if (input.trim()) add(input.trim());
    }
    if (e.key === "Backspace" && !input && selected.length) remove(selected[selected.length - 1]);
  };

  const dropdownStyle = direction === "up"
    ? { bottom: "100%", marginBottom: 4, top: "auto" }
    : { top: "100%", marginTop: 4 };

  return (
    <div className="relative" ref={containerRef}>
      <div ref={triggerRef}
        onClick={() => { setOpen(true); inputRef.current?.focus(); }}
        className={`border-2 rounded p-2 flex flex-wrap items-center gap-2 cursor-text min-h-[42px] ${error ? "border-red-500" : "border-yellow-400"}`}
      >
        {selected.map((s) => (
          <span key={s} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
            {s}
            <button type="button" onClick={(e) => { e.stopPropagation(); remove(s); }}
              className="text-gray-400 hover:text-red-500 font-bold leading-none cursor-pointer ml-1">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          placeholder={selected.length === 0 ? "Search and add skills..." : ""}
          onChange={(e) => { setInput(e.target.value); setOpen(true); setHi(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 focus:outline-none flex-1"
          style={{ minWidth: 120 }}
        />
        {selected.length > 0 && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}
            className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0">+</button>
        )}
      </div>

      {/* Smart direction dropdown */}
      {open && options.length > 0 && (
        <ul
          className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto"
          style={{ maxHeight: 200, ...dropdownStyle }}
        >
          {options.map((s, i) => (
            <li key={s}
              onMouseDown={(e) => { e.preventDefault(); add(s === "__OTHER__" ? input.trim() : s); }}
              onMouseEnter={() => setHi(i)}
              onMouseLeave={() => setHi(-1)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                s === "__OTHER__"
                  ? i === hi ? "bg-yellow-100 text-blue-700 font-semibold border-t border-gray-200" : "text-blue-600 font-semibold border-t border-gray-200 hover:bg-yellow-50"
                  : i === hi ? "bg-yellow-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-yellow-50"
              }`}>
              {s === "__OTHER__" ? `+ Add "${input.trim()}" as custom skill` : s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── ResourceTreeSelect ───────────────────────────────────────────────────────
function ResourceTreeSelect({ resourcePool, selectedIds, onChange, error, loading }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const direction = useDropdownDirection(triggerRef, open);
  const { tree, independent } = groupResources(resourcePool);

  useEffect(() => {
    const h = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (id) => onChange(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]);

  const toggleMgr = (mgr, reportees) => {
    const all = [mgr.id, ...reportees.map((r) => r.id)];
    const allSel = all.every((id) => selectedIds.includes(id));
    onChange(allSel ? selectedIds.filter((s) => !all.includes(s)) : [...selectedIds, ...all.filter((id) => !selectedIds.includes(id))]);
  };

  const mgrState = (mgr, reportees) => {
    const all = [mgr.id, ...reportees.map((r) => r.id)];
    const n = all.filter((id) => selectedIds.includes(id)).length;
    return n === 0 ? "none" : n === all.length ? "all" : "some";
  };

  const selectedNames = resourcePool.filter((r) => selectedIds.includes(r.id)).map((r) => r.resourceName);
  const isEmpty = resourcePool.length === 0;

  const dropdownStyle = direction === "up"
    ? { bottom: "100%", marginBottom: 4, top: "auto" }
    : { top: "100%", marginTop: 4 };

  return (
    <div ref={containerRef} className="relative">
      <div ref={triggerRef}
        onClick={() => !loading && !isEmpty && setOpen((p) => !p)}
        className={`border-2 rounded p-2 min-h-[42px] flex flex-wrap gap-2 items-center transition-all ${
          error ? "border-red-500" : "border-yellow-400"
        } ${loading || isEmpty ? "bg-gray-50 cursor-not-allowed" : "bg-white cursor-pointer"}`}
      >
        {loading ? (
          <span className="text-sm text-gray-400 flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin inline-block" />
            Loading developers...
          </span>
        ) : selectedNames.length === 0 ? (
          <span className="text-sm text-gray-400">
            {isEmpty ? "Add skills above to load developers" : "Click to select developers..."}
          </span>
        ) : (
          selectedNames.map((name) => (
            <span key={name} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
              {name}
              <button type="button"
                onClick={(e) => { e.stopPropagation(); const id = resourcePool.find((r) => r.resourceName === name)?.id; if (id) toggle(id); }}
                className="text-gray-400 hover:text-red-500 font-bold leading-none ml-1">×</button>
            </span>
          ))
        )}
        {!loading && !isEmpty && (
          <span className="ml-auto text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
        )}
      </div>

      {open && (
        <div
          className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto"
          style={{ maxHeight: 240, ...dropdownStyle }}
        >
          {tree.map(({ manager, reportees }) => {
            const state = mgrState(manager, reportees);
            return (
              <div key={manager.id}>
                <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 hover:bg-yellow-50 cursor-pointer border-b border-gray-100 transition-colors">
                  <input type="checkbox" checked={state === "all"}
                    ref={(el) => { if (el) el.indeterminate = state === "some"; }}
                    onChange={() => toggleMgr(manager, reportees)}
                    className="w-4 h-4 accent-yellow-500 cursor-pointer" />
                  <span className="flex-1 flex items-center gap-2 text-sm font-semibold text-gray-800">
                    <span>👤</span> {manager.resourceName}
                    <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Manager</span>
                  </span>
                </label>
                {reportees.map((emp) => (
                  <label key={emp.id} className="flex items-center gap-3 px-4 py-2 pl-10 hover:bg-yellow-50 cursor-pointer border-b border-gray-50 transition-colors">
                    <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggle(emp.id)}
                      className="w-4 h-4 accent-yellow-500 cursor-pointer" />
                    <span className="text-sm text-gray-600 flex items-center gap-1.5">
                      <span className="text-gray-300 text-xs">└─</span>{emp.resourceName}
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
          {independent.length > 0 && (
            <>
              {tree.length > 0 && (
                <div className="px-4 py-1.5 bg-gray-50 border-y border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">No Manager</span>
                </div>
              )}
              {independent.map((emp) => (
                <label key={emp.id} className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-50 cursor-pointer border-b border-gray-50 transition-colors">
                  <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggle(emp.id)}
                    className="w-4 h-4 accent-yellow-500 cursor-pointer" />
                  <span className="text-sm text-gray-700">{emp.resourceName}</span>
                </label>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── RoleCard ─────────────────────────────────────────────────────────────────
function RoleCard({ role, index, isFirst, onUpdate, onRemove, roleError }) {

  // ✅ fetchResources receives tech/customTech/skills as direct arguments
  // — never reads from role closure to avoid stale state
  const fetchResources = useCallback(async (tech, customTech, skills) => {
    const effectiveTech = tech === "Other" ? customTech.trim() : tech;
    if (!effectiveTech || skills.length === 0) return;
    onUpdate(index, { loading: true, resourcePool: [], selectedResourceIds: [] });
    try {
      const res = await axios.post("http://localhost:8098/api/v1/projects/getResourceNames", {
        permissionId: 3,
        technology: effectiveTech,
        skill: skills.join(","),
      });
      onUpdate(index, { resourcePool: res.data || [], loading: false });
    } catch {
      onUpdate(index, { loading: false, resourcePool: [] });
    }
  }, [index, onUpdate]);

  // ✅ When technology changes — clear everything, no fetch yet (no skills)
  const handleTechChange = (tech) => {
    onUpdate(index, {
      technology: tech,
      customTech: "",
      skills: [],
      resourcePool: [],
      selectedResourceIds: [],
    });
  };

  // ✅ When skills change — pass CURRENT tech directly, not from closure
  // role.technology IS safe to read here since it's a prop (not setState result)
  const handleSkillChange = (newSkills) => {
    // Update skills in state first
    onUpdate(index, { skills: newSkills });
    // Pass role.technology directly — it's the current prop value, not stale
    const tech = role.technology;
    const customTech = role.customTech;
    const effectiveTech = tech === "Other" ? customTech.trim() : tech;
    // Only fetch if we have both technology and at least one skill
    if (effectiveTech && newSkills.length > 0) {
      fetchResources(tech, customTech, newSkills);
    }
  };

  // ✅ When custom tech loses focus — fetch if we have skills
  const handleCustomTechBlur = () => {
    const customTech = role.customTech.trim();
    if (customTech && role.skills.length > 0) {
      fetchResources("Other", customTech, role.skills);
    }
  };

  return (
    <div className={`border-2 rounded-lg overflow-visible ${roleError ? "border-red-400" : "border-yellow-400"}`}>

      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 rounded-t-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-full bg-white text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {index + 1}
          </div>
          <div className="flex flex-col min-w-0">
            {/* Technology name — main title */}
            <span className="font-bold text-white text-sm leading-tight">
              {role.technology
                ? (role.technology === "Other" ? role.customTech || "Custom Technology" : role.technology)
                : `Role ${index + 1} — Not configured`}
            </span>
            {/* Role label — shown below technology as a badge */}
            {role.roleLabel && (
              <span className="mt-1 inline-flex">
                <span className="text-xs font-semibold bg-white text-blue-700 px-2 py-0.5 rounded-full">
                  {role.roleLabel}
                </span>
              </span>
            )}
            {/* Placeholder when role label not set yet */}
            {!role.roleLabel && (
              <span className="text-xs text-blue-100 opacity-70 mt-0.5">No role type selected</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {role.selectedResourceIds.length > 0 && (
            <span className="text-xs font-bold bg-white text-green-700 px-3 py-1 rounded-full">
              ✓ {role.selectedResourceIds.length} assigned
            </span>
          )}
          {!isFirst && (
            <button type="button" onClick={() => onRemove(index)}
              className="w-7 h-7 rounded-full bg-white text-red-500 hover:bg-red-50 font-bold text-base flex items-center justify-center cursor-pointer transition-all">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Card Body — all fields stacked full-width for clarity */}
      <div className="p-4 bg-white space-y-4">

        {/* Row 1: Role Type + Technology — side by side */}
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="w-full md:w-[48%]">
            <label className="font-semibold mb-1 block">Role Type</label>
            <select value={role.roleLabel}
              onChange={(e) => onUpdate(index, { roleLabel: e.target.value })}
              className="border-2 border-yellow-400 p-2 rounded w-full text-sm">
              <option value="">Select role type...</option>
              {ROLE_LABELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="w-full md:w-[48%]">
            <label className="font-semibold mb-1 block">Technology <span className="text-pink-800">*</span></label>
            <select value={role.technology}
              onChange={(e) => handleTechChange(e.target.value)}
              className={`border-2 p-2 rounded w-full text-sm ${roleError?.technology ? "border-red-500" : "border-yellow-400"}`}>
              <option value="">Select Technology</option>
              {TECHNOLOGY_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            {roleError?.technology && <p className="text-red-600 text-sm mt-1">{roleError.technology}</p>}
            {role.technology === "Other" && (
              <div className="mt-2">
                <input type="text" value={role.customTech}
                  onChange={(e) => onUpdate(index, { customTech: e.target.value, resourcePool: [], selectedResourceIds: [] })}
                  onBlur={handleCustomTechBlur}
                  placeholder="Enter custom technology"
                  className={`border-2 p-2 rounded w-full text-sm ${roleError?.customTech ? "border-red-500" : "border-yellow-400"}`} />
                {roleError?.customTech && <p className="text-red-600 text-sm mt-1">{roleError.customTech}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Skills — full width so dropdown has room */}
        <div className="w-full">
          <label className="font-semibold mb-1 block">
            Skills <span className="text-pink-800">*</span>
            <span className="ml-1 text-xs font-normal text-gray-400">(select skills to load matching developers)</span>
          </label>
          <SkillTagInput
            selected={role.skills}
            onChange={handleSkillChange}
            technology={role.technology}
            error={roleError?.skills}
          />
          {roleError?.skills && <p className="text-red-600 text-sm mt-1">{roleError.skills}</p>}
        </div>

        {/* Row 3: Assign Developers — full width so dropdown has room */}
        <div className="w-full">
          <label className="font-semibold mb-1 block">
            Assign Developers <span className="text-pink-800">*</span>
            {role.selectedResourceIds.length > 0 && (
              <span className="ml-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                {role.selectedResourceIds.length} selected
              </span>
            )}
          </label>
          <ResourceTreeSelect
            resourcePool={role.resourcePool}
            selectedIds={role.selectedResourceIds}
            onChange={(ids) => onUpdate(index, { selectedResourceIds: ids })}
            error={roleError?.developers}
            loading={role.loading}
          />
          {roleError?.developers && <p className="text-red-600 text-sm mt-1">{roleError.developers}</p>}
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Addproject() {
  const [projectName, setProjectName]           = useState("");
  const [clientName, setClientName]             = useState("");
  const [totalAmount, setTotalAmount]           = useState("");
  const [developerAmount, setDeveloperAmount]   = useState("");
  const [startDate, setStartDate]               = useState("");
  const [endDate, setEndDate]                   = useState("");
  const [amount, setAmount]                     = useState("");
  const [status, setStatus]                     = useState("");
  const [roles, setRoles]                       = useState([createEmptyRole()]);
  const [errors, setErrors]                     = useState({});
  const [roleErrors, setRoleErrors]             = useState([]);
  const [loading, setLoading]                   = useState(false);
  const [creatorName]                           = useState(localStorage.getItem("resourceName") || "");
  const navigate = useNavigate();

  const calcAmount = () => {
    const t = Number(totalAmount), d = Number(developerAmount);
    if (t > 0 && d > 0) setAmount(String(t + d));
  };

  const updateRole = useCallback((index, patch) => {
    setRoles((prev) => prev.map((r, i) => i === index ? { ...r, ...patch } : r));
  }, []);

  const removeRole = (index) => {
    setRoles((prev) => prev.filter((_, i) => i !== index));
    setRoleErrors((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!projectName.trim())                              e.projectName     = "Project name is required";
    if (!clientName.trim())                               e.clientName      = "Client name is required";
    if (!totalAmount || Number(totalAmount) <= 0)         e.totalAmount     = "Enter a valid amount";
    if (!developerAmount || Number(developerAmount) <= 0) e.developerAmount = "Enter a valid amount";
    if (!startDate)                                       e.startDate       = "Start date is required";
    if (!endDate)                                         e.endDate         = "End date is required";
    if (!status)                                          e.status          = "Status is required";

    const re = roles.map((role) => {
      const err = {};
      if (!role.technology)                                        err.technology = "Required";
      if (role.technology === "Other" && !role.customTech.trim()) err.customTech = "Please specify";
      if (!role.skills.length)                                     err.skills     = "Add at least one skill";
      if (!role.selectedResourceIds.length)                        err.developers = "Assign at least one developer";
      return Object.keys(err).length ? err : null;
    });

    setErrors(e);
    setRoleErrors(re);
    return !Object.keys(e).length && re.every((x) => x === null);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    const payload = {
      name: projectName, clientName, totalAmount, developerAmount,
      startDate, endDate, amount, status,
      createdAt: new Date(), createdBy: creatorName,
      updatedAt: new Date(), updatedBy: creatorName,
      projectRoles: roles.map((r) => ({
        roleLabel:   r.roleLabel,
        technology:  r.technology === "Other" ? r.customTech : r.technology,
        skills:      r.skills,
        resourceIds: r.selectedResourceIds,
      })),
    };
    axios.post("http://localhost:8098/api/v1/projects/createproject", payload)
      .then(() => navigate("/manageprojects"))
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const fieldClass = (errKey) =>
    `border-2 p-2 rounded w-full ${errors[errKey] ? "border-red-500" : "border-yellow-400"}`;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-300">
          <Header />
        </header>

        <main className="flex-1 bg-white p-8">
          <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">

            {/* Page Header */}
            <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
              Add Project
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <ClipLoader size={60} color="#FACC15" />
              </div>
            ) : (
              <div className="space-y-6">

                {/* Row 1 — Project Name + Client Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Project Name <span className="text-pink-800">*</span></label>
                    <input type="text" value={projectName} placeholder="Enter project name"
                      onChange={(e) => { setProjectName(e.target.value); if (errors.projectName) setErrors((p) => ({ ...p, projectName: "" })); }}
                      className={fieldClass("projectName")} />
                    {errors.projectName && <p className="text-red-600 text-sm mt-1">{errors.projectName}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Client Name <span className="text-pink-800">*</span></label>
                    <input type="text" value={clientName} placeholder="Enter client name"
                      onChange={(e) => { setClientName(e.target.value); if (errors.clientName) setErrors((p) => ({ ...p, clientName: "" })); }}
                      className={fieldClass("clientName")} />
                    {errors.clientName && <p className="text-red-600 text-sm mt-1">{errors.clientName}</p>}
                  </div>
                </div>

                {/* Row 2 — Start Date + End Date */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Start Date <span className="text-pink-800">*</span></label>
                    <input type="date" value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((p) => ({ ...p, startDate: "" })); }}
                      className={fieldClass("startDate")} />
                    {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">End Date <span className="text-pink-800">*</span></label>
                    <input type="date" value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors((p) => ({ ...p, endDate: "" })); }}
                      className={fieldClass("endDate")} />
                    {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
                  </div>
                </div>

                {/* Row 3 — Buffer + Developer Allocation */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Buffer Allocation <span className="text-pink-800">*</span></label>
                    <div className={`flex items-center border-2 rounded ${errors.totalAmount ? "border-red-500" : "border-yellow-400"}`}>
                      <span className="px-3 py-2 bg-yellow-50 text-sm font-bold text-gray-600 border-r-2 border-yellow-400">$</span>
                      <input type="number" value={totalAmount} placeholder="0.00" onBlur={calcAmount}
                        onChange={(e) => { setTotalAmount(e.target.value); if (errors.totalAmount) setErrors((p) => ({ ...p, totalAmount: "" })); }}
                        className="flex-1 border-none outline-none bg-white text-sm px-2 py-2" />
                    </div>
                    {errors.totalAmount && <p className="text-red-600 text-sm mt-1">{errors.totalAmount}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Developer Allocation <span className="text-pink-800">*</span></label>
                    <div className={`flex items-center border-2 rounded ${errors.developerAmount ? "border-red-500" : "border-yellow-400"}`}>
                      <span className="px-3 py-2 bg-yellow-50 text-sm font-bold text-gray-600 border-r-2 border-yellow-400">$</span>
                      <input type="number" value={developerAmount} placeholder="0.00" onBlur={calcAmount}
                        onChange={(e) => { setDeveloperAmount(e.target.value); if (errors.developerAmount) setErrors((p) => ({ ...p, developerAmount: "" })); }}
                        className="flex-1 border-none outline-none bg-white text-sm px-2 py-2" />
                    </div>
                    {errors.developerAmount && <p className="text-red-600 text-sm mt-1">{errors.developerAmount}</p>}
                  </div>
                </div>

                {/* Row 4 — Total Amount + Status */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Total Amount</label>
                    <div className="flex items-center border-2 border-yellow-400 rounded bg-gray-50">
                      <span className="px-3 py-2 bg-yellow-50 text-sm font-bold text-gray-400 border-r-2 border-yellow-400">$</span>
                      <input type="number" value={amount} readOnly
                        className="flex-1 border-none outline-none bg-gray-50 text-sm px-2 py-2 text-gray-500 cursor-not-allowed" />
                    </div>
                    {/* {amount && <p className="text-green-600 text-xs mt-1 font-medium">= Buffer + Developer allocation</p>} */}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Status <span className="text-pink-800">*</span></label>
                    <select value={status}
                      onChange={(e) => { setStatus(e.target.value); if (errors.status) setErrors((p) => ({ ...p, status: "" })); }}
                      className={fieldClass("status")}>
                      <option value="">Select Status</option>
                      <option value="Yet to Start">Yet to Start</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
                  </div>
                </div>

                {/* ── Team Assignment ── */}
                <div>
                  <h3 className="text-xl font-bold p-4 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-4 shadow flex items-center justify-between">
                    <span>Team Assignment</span>
                    {roles.reduce((s, r) => s + r.selectedResourceIds.length, 0) > 0 && (
                      <span className="text-sm font-semibold bg-white text-blue-700 px-3 py-1 rounded-full">
                        {roles.reduce((s, r) => s + r.selectedResourceIds.length, 0)} developers assigned
                      </span>
                    )}
                  </h3>

                  <div className="space-y-4">
                    {roles.map((role, index) => (
                      <RoleCard
                        key={role.id}
                        role={role}
                        index={index}
                        isFirst={index === 0}
                        onUpdate={updateRole}
                        onRemove={removeRole}
                        roleError={roleErrors[index]}
                      />
                    ))}

                    <button type="button"
                      onClick={() => setRoles((p) => [...p, createEmptyRole()])}
                      className="w-full border-2 border-dashed border-yellow-400 hover:border-yellow-500 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-700 rounded-lg py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2">
                      <span className="text-lg leading-none font-bold">+</span> Add Another Role
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 p-4 items-center justify-center mt-8">
              <button onClick={() => navigate("/manageprojects")}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
                Back
              </button>
              <button onClick={handleSubmit}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
                Save
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Addproject;