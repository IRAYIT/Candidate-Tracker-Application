import Header from "../Header";
import Sidebar from "../Sidebar";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";

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
  "JAVA":                      ["Core Java","Spring Boot","Hibernate","Microservices","REST API","Spring Security","JPA","Maven"],
  "JAVA FULLSTACK":            ["Core Java","Spring Boot","React","Angular","REST API","JPA","Maven","HTML","CSS","JavaScript"],
  "JAVA FULLSTACK ANGULAR":    ["Core Java","Spring Boot","Angular","TypeScript","REST API","JPA","HTML","CSS","Maven"],
  "JAVA FULLSTACK REACT":      ["Core Java","Spring Boot","React","JavaScript","TypeScript","REST API","JPA","Redux","Maven"],
  "JAVA SPRING BOOT":          ["Spring Boot","Spring MVC","Spring Security","JPA","Hibernate","REST API","Maven","JUnit"],
  "JAVA MICROSERVICES":        ["Microservices","Spring Boot","Spring Cloud","Apache Kafka","Docker","Kubernetes","REST API","JPA"],
  "DOTNET":                    [".NET Core","ASP.NET","C#","Entity Framework","LINQ","Blazor","SignalR"],
  "DOTNET FULLSTACK":          ["C#","ASP.NET Core","React","Angular","Entity Framework","LINQ","HTML","CSS","JavaScript"],
  "DOTNET FULLSTACK ANGULAR":  ["C#","ASP.NET Core","Angular","TypeScript","Entity Framework","REST API","HTML","CSS"],
  "DOTNET FULLSTACK REACT":    ["C#","ASP.NET Core","React","JavaScript","TypeScript","Entity Framework","Redux","HTML","CSS"],
  "DOTNET CORE":               ["ASP.NET Core","C#","Entity Framework","LINQ","REST API","SignalR","NUnit"],
  "PYTHON":                    ["Python","Django","Flask","FastAPI","REST API","Pandas","NumPy","PostgreSQL"],
  "PYTHON FULLSTACK":          ["Python","Django","React","Angular","REST API","HTML","CSS","JavaScript","PostgreSQL"],
  "PYTHON FULLSTACK ANGULAR":  ["Python","Django","Angular","TypeScript","REST API","HTML","CSS","PostgreSQL"],
  "PYTHON FULLSTACK REACT":    ["Python","Django","React","JavaScript","TypeScript","REST API","Redux","PostgreSQL"],
  "PYTHON DJANGO":             ["Python","Django","REST API","PostgreSQL","Celery","Redis","HTML","CSS"],
  "PYTHON FASTAPI":            ["Python","FastAPI","REST API","PostgreSQL","SQLAlchemy","Docker","Pydantic"],
  "PYTHON FLASK":              ["Python","Flask","REST API","SQLAlchemy","PostgreSQL","HTML","CSS","Jinja2"],
  "NODE FULLSTACK":            ["Node.js","Express.js","JavaScript","TypeScript","MongoDB","REST API","HTML","CSS"],
  "NODE FULLSTACK ANGULAR":    ["Node.js","Express.js","Angular","TypeScript","MongoDB","REST API","HTML","CSS"],
  "NODE FULLSTACK REACT":      ["Node.js","Express.js","React","JavaScript","TypeScript","MongoDB","Redux","REST API"],
  "MERN":                      ["MongoDB","Express.js","React","Node.js","JavaScript","TypeScript","Redux","REST API","HTML","CSS"],
  "MEAN":                      ["MongoDB","Express.js","Angular","Node.js","TypeScript","REST API","RxJS","HTML","CSS"],
  "MEVN":                      ["MongoDB","Express.js","Vue.js","Node.js","JavaScript","REST API","Vuex","HTML","CSS"],
  "ANGULAR":                   ["Angular","TypeScript","RxJS","NgRx","HTML","CSS","Material UI"],
  "REACTJS":                   ["React","Redux","JavaScript","TypeScript","Tailwind CSS","Next.js","Vite"],
  "VUEJS":                     ["Vue.js","JavaScript","TypeScript","Vuex","HTML","CSS","Nuxt.js"],
  "NEXTJS":                    ["Next.js","React","TypeScript","JavaScript","Tailwind CSS","REST API","HTML","CSS"],
  "NUXTJS":                    ["Nuxt.js","Vue.js","TypeScript","JavaScript","Tailwind CSS","REST API","HTML","CSS"],
  "FRONTEND":                  ["HTML","CSS","JavaScript","TypeScript","React","Angular","Vue.js","Bootstrap","Tailwind CSS"],
  "ANDROID":                   ["Android","Kotlin","Java","REST API","Firebase","SQLite","Jetpack Compose"],
  "IOS SWIFT":                 ["iOS","Swift","Objective-C","Xcode","REST API","Firebase","SwiftUI","CoreData"],
  "REACT NATIVE":              ["React Native","JavaScript","TypeScript","React","Redux","REST API","Firebase"],
  "FLUTTER":                   ["Flutter","Dart","REST API","Firebase","SQLite","Provider","Riverpod"],
  "SQL DEVELOPER":             ["SQL","PL/SQL","MySQL","PostgreSQL","Oracle","SQL Server","MongoDB"],
  "DATA ENGINEER":             ["Python","Apache Spark","Hadoop","Airflow","dbt","PostgreSQL","AWS","GCP","SQL"],
  "DATA SCIENCE":              ["Python","Machine Learning","Pandas","NumPy","Scikit-learn","TensorFlow","Tableau","Power BI"],
  "ML AI":                     ["Machine Learning","Deep Learning","TensorFlow","PyTorch","Scikit-learn","Python","Pandas","NumPy"],
  "POWER BI":                  ["Power BI","Tableau","DAX","SQL","Excel","Data Analysis","Python"],
  "AWS DEVOPS":                ["AWS","Docker","Kubernetes","Jenkins","Terraform","Ansible","GitHub Actions","Linux"],
  "AZURE DEVOPS":              ["Azure","CI/CD","Terraform","GitHub Actions","Docker","Kubernetes","PowerShell"],
  "GCP DEVOPS":                ["GCP","Docker","Kubernetes","Terraform","CI/CD","Linux","GitHub Actions"],
  "DEVOPS":                    ["Docker","Kubernetes","Jenkins","Terraform","Ansible","Linux","Bash","CI/CD","GitHub Actions"],
  "CLOUD ARCHITECT":           ["AWS","Azure","GCP","Terraform","Docker","Kubernetes","Microservices Architecture","System Design"],
  "TESTING":                   ["Manual Testing","Selenium","Cypress","JMeter","Playwright","Postman","TestNG","Appium"],
  "AUTOMATION TESTING":        ["Selenium","Cypress","Playwright","TestNG","JUnit","Appium","Jest","Postman"],
  "PERFORMANCE TESTING":       ["JMeter","LoadRunner","Gatling","Postman","API Testing","Performance Testing"],
  "API TESTING":               ["Postman","Swagger","REST API","Selenium","TestNG","API Testing","JWT"],
};

const TECHNOLOGY_GROUPS = [
  { label: "Java Ecosystem", options: [
    { value: "JAVA", label: "Java" },
    { value: "JAVA FULLSTACK ANGULAR", label: "Java Full Stack + Angular" },
    { value: "JAVA FULLSTACK REACT", label: "Java Full Stack + React" },
    { value: "JAVA SPRING BOOT", label: "Java + Spring Boot" },
  ]},
  { label: ".NET Ecosystem", options: [
    { value: "DOTNET", label: "ASP.NET" },
    { value: "DOTNET FULLSTACK ANGULAR", label: "ASP.NET Full Stack + Angular" },
    { value: "DOTNET FULLSTACK REACT", label: "ASP.NET Full Stack + React" },
  ]},
  { label: "Python Ecosystem", options: [
    { value: "PYTHON", label: "Python" },
    { value: "PYTHON FULLSTACK ANGULAR", label: "Python Full Stack + Angular" },
    { value: "PYTHON FULLSTACK REACT", label: "Python Full Stack + React" },
    { value: "PYTHON DJANGO", label: "Python + Django" },
    { value: "PYTHON FASTAPI", label: "Python + FastAPI" },
    { value: "PYTHON FLASK", label: "Python + Flask" },
  ]},
  { label: "Node.js Ecosystem", options: [
    { value: "NODE FULLSTACK ANGULAR", label: "Node.js Full Stack + Angular" },
    { value: "NODE FULLSTACK REACT", label: "Node.js Full Stack + React" },
    { value: "MERN", label: "MERN Stack (MongoDB, Express, React, Node)" },
    { value: "MEAN", label: "MEAN Stack (MongoDB, Express, Angular, Node)" },
    { value: "MEVN", label: "MEVN Stack (MongoDB, Express, Vue, Node)" },
  ]},
  { label: "Frontend", options: [
    { value: "ANGULAR", label: "Angular" },
    { value: "REACTJS", label: "React.js" },
    { value: "VUEJS", label: "Vue.js" },
    { value: "NEXTJS", label: "Next.js" },
    { value: "NUXTJS", label: "Nuxt.js" },
  ]},
  { label: "Mobile Development", options: [
    { value: "ANDROID", label: "Android" },
    { value: "IOS SWIFT", label: "iOS (Swift)" },
    { value: "REACT NATIVE", label: "React Native" },
    { value: "FLUTTER", label: "Flutter" },
  ]},
  { label: "Database & Data Engineering", options: [
    { value: "SQL DEVELOPER", label: "SQL Developer" },
    { value: "DATA ENGINEER", label: "Data Engineer" },
    { value: "DATA SCIENCE", label: "Data Science" },
    { value: "ML AI", label: "Machine Learning / AI" },
    { value: "POWER BI", label: "Power BI / Tableau" },
  ]},
  { label: "DevOps & Cloud", options: [
    { value: "AWS DEVOPS", label: "AWS DevOps" },
    { value: "AZURE DEVOPS", label: "Azure DevOps" },
    { value: "GCP DEVOPS", label: "GCP DevOps" },
    { value: "DEVOPS", label: "DevOps (General)" },
    { value: "CLOUD ARCHITECT", label: "Cloud Architect" },
  ]},
  { label: "Testing", options: [
    { value: "TESTING", label: "Manual Testing" },
    { value: "AUTOMATION TESTING", label: "Automation Testing" },
    { value: "PERFORMANCE TESTING", label: "Performance Testing" },
    { value: "API TESTING", label: "API Testing" },
  ]},
];

const PREDEFINED_TECHNOLOGIES = TECHNOLOGY_GROUPS.flatMap((g) => g.options.map((o) => o.value));
const ROLE_LABELS = ["Backend","Frontend","Testing","DevOps","Database","Mobile","AI/ML","Full Stack","Other"];

const createEmptyRole = () => ({
  id: Date.now() + Math.random(),
  dbId: null,
  roleLabel: "",
  technology: "",
  customTech: "",
  skills: [],
  resourcePool: [],
  selectedResourceIds: [],
  selectedResourceNames: [],
  loading: false,
});

const buildRoleFromAPI = (apiRole) => {
  const tech = apiRole.technology || "";
  const isPredefined = PREDEFINED_TECHNOLOGIES.includes(tech);
  const skills = Array.isArray(apiRole.skills)
    ? apiRole.skills.map((s) => s.trim()).filter(Boolean)
    : (apiRole.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
  return {
    id: Date.now() + Math.random(),
    dbId: apiRole.id || null,
    roleLabel: apiRole.roleLabel || "",
    technology: isPredefined ? tech : (tech ? "Other" : ""),
    customTech: isPredefined ? "" : tech,
    skills,
    resourcePool: [],
    selectedResourceIds: apiRole.resourceIds || [],
    selectedResourceNames: apiRole.resourceNames || [],
    loading: false,
  };
};

// ─── Hook: smart dropdown direction ──────────────────────────────────────────
function useDropdownDirection(triggerRef, open) {
  const [direction, setDirection] = useState("down");
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDirection(window.innerHeight - rect.bottom < 260 ? "up" : "down");
  }, [open, triggerRef]);
  return direction;
}

const toDateString = (d) => {
  try { return new Date(d).toISOString().split("T")[0]; }
  catch { return ""; }
};

// ─── SkillTagInput ────────────────────────────────────────────────────────────
function SkillTagInput({ selected, onChange, technology, error }) {
  const [input, setInput] = useState("");
  const [open, setOpen]   = useState(false);
  const [hi, setHi]       = useState(-1);
  const inputRef          = useRef(null);
  const containerRef      = useRef(null);
  const triggerRef        = useRef(null);
  const direction         = useDropdownDirection(triggerRef, open);

  useEffect(() => {
    const h = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const pool = technology && TECHNOLOGY_SKILLS[technology]
    ? [...TECHNOLOGY_SKILLS[technology], ...SKILL_OPTIONS.filter((s) => !TECHNOLOGY_SKILLS[technology].includes(s))]
    : SKILL_OPTIONS;
  const filtered  = pool.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !selected.includes(s));
  const showOther = input.trim() && !SKILL_OPTIONS.some((s) => s.toLowerCase() === input.trim().toLowerCase()) && !selected.includes(input.trim());
  const options   = showOther ? [...filtered, "__OTHER__"] : filtered;

  const add    = (s) => { if (!selected.includes(s)) onChange([...selected, s]); setInput(""); setOpen(false); setHi(-1); inputRef.current?.focus(); };
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

  const dropStyle = direction === "up" ? { bottom: "100%", marginBottom: 4, top: "auto" } : { top: "100%", marginTop: 4 };

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
              className="text-gray-400 hover:text-red-500 font-bold leading-none ml-1">×</button>
          </span>
        ))}
        <input ref={inputRef} value={input} placeholder={selected.length === 0 ? "Search and add skills..." : ""}
          onChange={(e) => { setInput(e.target.value); setOpen(true); setHi(-1); }}
          onFocus={() => setOpen(true)} onKeyDown={onKey}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 flex-1" style={{ minWidth: 120 }} />
        {selected.length > 0 && (
          <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}
            className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0">+</button>
        )}
      </div>
      {open && options.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto" style={{ maxHeight: 200, ...dropStyle }}>
          {options.map((s, i) => (
            <li key={s}
              onMouseDown={(e) => { e.preventDefault(); add(s === "__OTHER__" ? input.trim() : s); }}
              onMouseEnter={() => setHi(i)} onMouseLeave={() => setHi(-1)}
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

// ─── ResourceFlatSelect ───────────────────────────────────────────────────────
// Flat skill-match list. Replaces ResourceTreeSelect + groupResources.
// Backend returns: id, resourceName, matchCount, matchedSkills (no managerId).
// Sorted best-match first by backend.
function ResourceFlatSelect({ resourcePool, selectedIds, onChange, error, loading: poolLoading, totalSkillCount }) {
  const [open, setOpen]  = useState(false);
  const containerRef     = useRef(null);
  const triggerRef       = useRef(null);
  const direction        = useDropdownDirection(triggerRef, open);

  useEffect(() => {
    const h = (e) => { if (!containerRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const toggle = (id) =>
    onChange(selectedIds.includes(id)
      ? selectedIds.filter((s) => s !== id)
      : [...selectedIds, id]);

  const selectedNames = resourcePool
    .filter((r) => selectedIds.includes(r.id))
    .map((r) => r.resourceName);

  const isEmpty  = resourcePool.length === 0;
  const dropStyle = direction === "up"
    ? { bottom: "100%", marginBottom: 4, top: "auto" }
    : { top: "100%", marginTop: 4 };

  return (
    <div ref={containerRef} className="relative">

      {/* ── Trigger box ── */}
      <div ref={triggerRef}
        onClick={() => !poolLoading && !isEmpty && setOpen((p) => !p)}
        className={`border-2 rounded p-2 min-h-[42px] flex flex-wrap gap-2 items-center transition-all
          ${error ? "border-red-500" : "border-yellow-400"}
          ${poolLoading || isEmpty ? "bg-gray-50 cursor-not-allowed" : "bg-white cursor-pointer"}`}
      >
        {poolLoading ? (
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
                onClick={(e) => {
                  e.stopPropagation();
                  const id = resourcePool.find((r) => r.resourceName === name)?.id;
                  if (id) toggle(id);
                }}
                className="text-gray-400 hover:text-red-500 font-bold leading-none ml-1">×
              </button>
            </span>
          ))
        )}
        {!poolLoading && !isEmpty && (
          <span className="ml-auto text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
        )}
      </div>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto"
          style={{ maxHeight: 260, ...dropStyle }}
        >
          {/* Column headers */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Developer</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Matched Skills</span>
          </div>

          {/* One row per developer — sorted best-match first by backend */}
          {resourcePool.map((emp) => {
            const isPerfect = emp.matchCount === totalSkillCount;
            return (
              <label key={emp.id}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-yellow-50 cursor-pointer border-b border-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(emp.id)}
                  onChange={() => toggle(emp.id)}
                  className="w-4 h-4 accent-yellow-500 cursor-pointer flex-shrink-0"
                />
                {/* Developer name */}
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {emp.resourceName}
                </span>
                {/* Match score + matched skill names */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    isPerfect
                      ? "text-green-700 bg-green-50 border-green-200"
                      : "text-yellow-700 bg-yellow-50 border-yellow-200"
                  }`}>
                    {emp.matchCount}/{totalSkillCount}
                  </span>
                  <span className="text-xs text-gray-500 max-w-[180px] truncate" title={emp.matchedSkills}>
                    {emp.matchedSkills}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── RoleCard ─────────────────────────────────────────────────────────────────
function RoleCard({ role, index, isFirst, onUpdate, onRemove, roleError }) {

  const fetchResources = useCallback(async (skills) => {
    if (!skills || skills.length === 0) return;
    onUpdate(index, { loading: true, resourcePool: [] });
    try {
      const res = await axios.post("https://candidate-tracker-app-f9bsavbvf8anayfy.centralindia-01.azurewebsites.net/api/v1/projects/getResourceNames", {
        permissionId: 3,
        skill: skills.join(","),
        technology: role.technology === "Other" ? role.customTech : role.technology,
      });
      onUpdate(index, { resourcePool: res.data || [], loading: false });
    } catch {
      onUpdate(index, { loading: false, resourcePool: [] });
    }
  }, [index, onUpdate, role.technology, role.customTech]);

  // On mount: if this role already has skills (loaded from API), fetch matching developers
  useEffect(() => {
    if (role.skills.length > 0 && role.resourcePool.length === 0 && !role.loading) {
      fetchResources(role.skills);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTechChange = (tech) => {
    onUpdate(index, { technology: tech, customTech: "", skills: [], resourcePool: [], selectedResourceIds: [] });
  };

  const handleSkillChange = (newSkills) => {
    onUpdate(index, { skills: newSkills });
    if (newSkills.length > 0) fetchResources(newSkills);
    else onUpdate(index, { resourcePool: [], selectedResourceIds: [] });
  };

  const handleCustomTechBlur = () => {
    if (role.skills.length > 0) fetchResources(role.skills);
  };

  return (
    <div className={`border-2 rounded-lg overflow-visible ${roleError ? "border-red-400" : "border-yellow-400"}`}>

      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 rounded-t-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-full bg-white text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{index + 1}</div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-white text-sm leading-tight">
              {role.technology ? (role.technology === "Other" ? role.customTech || "Custom Technology" : role.technology) : `Role ${index + 1} — Not configured`}
            </span>
            {role.roleLabel
              ? <span className="mt-1 inline-flex"><span className="text-xs font-semibold bg-white text-blue-700 px-2 py-0.5 rounded-full">{role.roleLabel}</span></span>
              : <span className="text-xs text-blue-100 opacity-70 mt-0.5">No role type selected</span>
            }
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {role.selectedResourceIds.length > 0 && (
            <span className="text-xs font-bold bg-white text-green-700 px-3 py-1 rounded-full">✓ {role.selectedResourceIds.length} assigned</span>
          )}
          {!isFirst && (
            <button type="button" onClick={() => onRemove(index)}
              className="w-7 h-7 rounded-full bg-white text-red-500 hover:bg-red-50 font-bold text-base flex items-center justify-center cursor-pointer transition-all">×</button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 bg-white space-y-4">

        {/* Row 1: Role Type + Technology */}
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="w-full md:w-[48%]">
            <label className="font-semibold mb-1 block">Role Type</label>
            <select value={role.roleLabel} onChange={(e) => onUpdate(index, { roleLabel: e.target.value })}
              className="border-2 border-yellow-400 p-2 rounded w-full text-sm">
              <option value="">Select role type...</option>
              {ROLE_LABELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="w-full md:w-[48%]">
            <label className="font-semibold mb-1 block">Technology <span className="text-pink-800">*</span></label>
            <select value={role.technology} onChange={(e) => handleTechChange(e.target.value)}
              className={`border-2 p-2 rounded w-full text-sm ${roleError?.technology ? "border-red-500" : "border-yellow-400"}`}>
              <option value="">Select Technology</option>
              {TECHNOLOGY_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </optgroup>
              ))}
              <option value="Other">Other (Custom)</option>
            </select>
            {roleError?.technology && <p className="text-red-600 text-sm mt-1">{roleError.technology}</p>}
            {role.technology === "Other" && (
              <div className="mt-2">
                <input type="text" value={role.customTech}
                  onChange={(e) => onUpdate(index, { customTech: e.target.value, resourcePool: [], selectedResourceIds: [] })}
                  onBlur={handleCustomTechBlur} placeholder="Enter custom technology"
                  className={`border-2 p-2 rounded w-full text-sm ${roleError?.customTech ? "border-red-500" : "border-yellow-400"}`} />
                {roleError?.customTech && <p className="text-red-600 text-sm mt-1">{roleError.customTech}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Skills */}
        <div className="w-full">
          <label className="font-semibold mb-1 block">
            Skills <span className="text-pink-800">*</span>
            <span className="ml-1 text-xs font-normal text-gray-400">(select skills to load matching developers)</span>
          </label>
          <SkillTagInput selected={role.skills} onChange={handleSkillChange} technology={role.technology} error={roleError?.skills} />
          {roleError?.skills && <p className="text-red-600 text-sm mt-1">{roleError.skills}</p>}
        </div>

        {/* Row 3: Assign Developers */}
        <div className="w-full">
          <label className="font-semibold mb-1 block">
            Assign Developers <span className="text-pink-800">*</span>
            {role.selectedResourceIds.length > 0 && (
              <span className="ml-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                {role.selectedResourceIds.length} selected
              </span>
            )}
          </label>
          {/* ResourceFlatSelect: flat ranked list, no manager grouping.
              totalSkillCount drives the X/Y match badge per developer. */}
          <ResourceFlatSelect
            resourcePool={role.resourcePool}
            selectedIds={role.selectedResourceIds}
            onChange={(ids) => onUpdate(index, { selectedResourceIds: ids })}
            error={roleError?.developers}
            loading={role.loading}
            totalSkillCount={role.skills.length}
          />
          {roleError?.developers && <p className="text-red-600 text-sm mt-1">{roleError.developers}</p>}
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Edit_project() {
  const [projectId, setProjectId]   = useState(0);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName]   = useState("");
  // const [bufferAllocation, setBufferAllocation] = useState("");  // Buffer Allocation — comment in DTO too
  // const [developerAmount, setDeveloperAmount]   = useState("");  // Developer Allocation — comment in DTO too
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [status, setStatus]           = useState("");
  const [roles, setRoles]             = useState([createEmptyRole()]);
  const [errors, setErrors]           = useState({});
  const [roleErrors, setRoleErrors]   = useState([]);
  const [loading, setLoading]         = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [creatorName]                 = useState(localStorage.getItem("resourceName") || "");
  const navigate = useNavigate();

  // const computedTotal = (Number(bufferAllocation) || 0) + (Number(developerAmount) || 0);  // Total Amount — comment in DTO too

  useEffect(() => {
    const pid = localStorage.getItem("projectid");
    if (pid) fetchProject(pid);
  }, []);

  const fetchProject = async (pid) => {
    try {
      const res  = await axios.get(`https://candidate-tracker-app-f9bsavbvf8anayfy.centralindia-01.azurewebsites.net/api/v1/projects/${pid}`);
      const data = res.data;
      setProjectId(data.id || 0);
      setProjectName(data.name || "");
      setClientName(data.clientName || "");
      setStartDate(toDateString(data.startDate));
      setEndDate(toDateString(data.endDate));
      // setBufferAllocation(data.totalAmount ?? data.bufferAllocation ?? "");  // Buffer Allocation
      // setDeveloperAmount(data.developerAmount ?? "");                         // Developer Allocation
      setStatus(data.status || "");
      const apiRoles = data.projectRoles || [];
      if (apiRoles.length > 0) setRoles(apiRoles.map(buildRoleFromAPI));
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setPageLoading(false);
    }
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
    if (!projectName.trim()) e.projectName = "Project name is required";
    if (!clientName.trim())  e.clientName  = "Client name is required";
    // if (!bufferAllocation || Number(bufferAllocation) <= 0) e.bufferAllocation = "Enter a valid amount";  // Buffer Allocation
    // if (!developerAmount  || Number(developerAmount)  <= 0) e.developerAmount  = "Enter a valid amount";  // Developer Allocation
    if (!startDate)          e.startDate   = "Start date is required";
    if (!endDate)            e.endDate     = "End date is required";
    if (!status)             e.status      = "Status is required";

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

  const handleUpdate = () => {
    if (!validate()) return;
    setLoading(true);

    const payload = {
      id: projectId,
      name: projectName,
      clientName,
      // totalAmount: bufferAllocation,  // Buffer Allocation — comment in DTO too
      // developerAmount,                // Developer Allocation — comment in DTO too
      // amount: computedTotal,          // Total Amount — comment in DTO too
      startDate,
      endDate,
      status,
      updatedAt: new Date(),
      updatedBy: creatorName,
      createdAt: new Date(),
      createdBy: creatorName,
      projectRoles: roles.map((r) => ({
        id:          r.dbId || null,
        roleLabel:   r.roleLabel,
        technology:  r.technology === "Other" ? r.customTech : r.technology,
        skills:      r.skills,
        resourceIds: r.selectedResourceIds,
      })),
    };

    axios.put("https://candidate-tracker-app-f9bsavbvf8anayfy.centralindia-01.azurewebsites.net/api/v1/projects", payload)
      .then(() => navigate("/manageprojects"))
      .catch((err) => console.error("Update failed:", err))
      .finally(() => setLoading(false));
  };

  const fieldClass = (errKey) =>
    `border-2 p-2 rounded w-full text-sm focus:outline-none transition-colors ${
      errors[errKey] ? "border-red-500" : "border-yellow-400"
    }`;

  const totalAssigned = roles.reduce((s, r) => s + r.selectedResourceIds.length, 0);

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

            <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
              Edit Project
            </h2>

            {pageLoading || loading ? (
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

                {/* Row 3 — Buffer Allocation + Developer Allocation (commented out — also comment in DTO) */}
                {/* <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Buffer Allocation <span className="text-pink-800">*</span></label>
                    <div className={`flex items-center border-2 rounded ${errors.bufferAllocation ? "border-red-500" : "border-yellow-400"}`}>
                      <span className="px-3 py-2 bg-yellow-50 text-sm font-bold text-gray-600 border-r-2 border-yellow-400">$</span>
                      <input type="number" value={bufferAllocation} placeholder="0.00"
                        onChange={(e) => { setBufferAllocation(e.target.value); if (errors.bufferAllocation) setErrors((p) => ({ ...p, bufferAllocation: "" })); }}
                        className="flex-1 border-none outline-none bg-white text-sm px-2 py-2" />
                    </div>
                    {errors.bufferAllocation && <p className="text-red-600 text-sm mt-1">{errors.bufferAllocation}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Developer Allocation <span className="text-pink-800">*</span></label>
                    <div className={`flex items-center border-2 rounded ${errors.developerAmount ? "border-red-500" : "border-yellow-400"}`}>
                      <span className="px-3 py-2 bg-yellow-50 text-sm font-bold text-gray-600 border-r-2 border-yellow-400">$</span>
                      <input type="number" value={developerAmount} placeholder="0.00"
                        onChange={(e) => { setDeveloperAmount(e.target.value); if (errors.developerAmount) setErrors((p) => ({ ...p, developerAmount: "" })); }}
                        className="flex-1 border-none outline-none bg-white text-sm px-2 py-2" />
                    </div>
                    {errors.developerAmount && <p className="text-red-600 text-sm mt-1">{errors.developerAmount}</p>}
                  </div>
                </div> */}

                {/* Row 4 — Total Amount (commented out — also comment in DTO) */}
                {/* <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Total Amount
                      <span className="ml-2 text-xs font-normal text-gray-400">(Buffer + Developer)</span>
                    </label>
                    <div className="flex items-center border-2 border-yellow-400 rounded bg-gray-50">
                      <span className="px-3 py-2 bg-yellow-50 text-sm font-bold text-gray-400 border-r-2 border-yellow-400">$</span>
                      <input type="text" value={computedTotal} readOnly
                        className="flex-1 border-none outline-none bg-gray-50 text-sm px-2 py-2 text-gray-600 cursor-not-allowed font-semibold" />
                    </div>
                  </div>
                </div> */}

                {/* Row 5 — Status (full width) */}
                <div className="w-full">
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

                {/* ── Team Assignment ── */}
                <div>
                  <h3 className="text-xl font-bold p-4 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-4 shadow flex items-center justify-between">
                    <span>Team Assignment</span>
                    {totalAssigned > 0 && (
                      <span className="text-sm font-semibold bg-white text-blue-700 px-3 py-1 rounded-full">
                        {totalAssigned} developers assigned
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

                {/* Action Buttons */}
                <div className="flex gap-4 p-4 items-center justify-center mt-4">
                  <button type="button" onClick={() => navigate("/manageprojects")}
                    className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer">
                    Back
                  </button>
                  <button type="button" onClick={handleUpdate}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition cursor-pointer">
                    Update
                  </button>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Edit_project;