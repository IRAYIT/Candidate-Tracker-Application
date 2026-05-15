import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState, useRef } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ─── Skill Options ────────────────────────────────────────────────────────────
const SKILL_OPTIONS = [
  // Java Ecosystem
  "Java", "Spring Boot", "Spring MVC", "Spring Security", "Spring Cloud",
  "Hibernate", "JPA", "JDBC", "Maven", "Gradle", "JUnit", "Mockito",
  "Microservices", "REST API", "SOAP", "Apache Kafka", "RabbitMQ",
  // .NET Ecosystem
  "C#", ".NET", "ASP.NET", "ASP.NET Core", "Entity Framework", "LINQ",
  "WPF", "WCF", "Blazor", "NUnit", "SignalR",
  // Frontend
  "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Next.js",
  "Nuxt.js", "Redux", "MobX", "HTML", "CSS", "Sass", "Tailwind CSS",
  "Bootstrap", "Material UI", "Ant Design", "jQuery", "Webpack", "Vite",
  // Backend
  "Node.js", "Express.js", "NestJS", "FastAPI", "Django", "Flask",
  "Python", "Ruby on Rails", "PHP", "Laravel", "Go", "Golang",
  "Rust", "Kotlin", "Scala", "Groovy",
  // Mobile
  "Android", "iOS", "Swift", "Objective-C", "React Native", "Flutter",
  "Dart", "Xamarin", "Ionic",
  // Databases
  "SQL", "MySQL", "PostgreSQL", "SQL Server", "Oracle", "SQLite",
  "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
  "Firebase", "Neo4j", "CouchDB", "MariaDB",
  // Cloud & DevOps
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
  "Ansible", "Jenkins", "GitHub Actions", "GitLab CI/CD", "CI/CD",
  "Linux", "Bash", "Shell Scripting", "Nginx", "Apache",
  "Prometheus", "Grafana", "ELK Stack", "Splunk",
  // Testing
  "Selenium", "TestNG", "Cypress", "Playwright", "Jest",
  "Postman", "Swagger", "JMeter", "LoadRunner", "Appium",
  "Manual Testing", "Automation Testing", "Performance Testing",
  "API Testing", "UAT",
  // Data & AI
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-learn", "Pandas", "NumPy", "Power BI", "Tableau",
  "Data Analysis", "Data Science", "Big Data", "Apache Spark",
  "Hadoop", "Hive", "Airflow", "dbt",
  // Tools & Others
  "Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence",
  "Agile", "Scrum", "Kanban", "GraphQL", "gRPC",
  "WebSockets", "OAuth", "JWT", "Microservices Architecture",
  "Design Patterns", "System Design", "DevSecOps", "SonarQube",
];

const technologySkills = {
  JAVA: ["Core Java", "Spring Boot", "Hibernate", "Microservices"],
  DOTNET: [".NET Core", "ASP.NET", "C#", "Entity Framework"],
  TESTING: ["Manual Testing", "Selenium", "Cypress", "JMeter"],
  ANGULAR: ["Angular 15", "TypeScript", "RxJS", "NgRx"],
  REACTJS: ["React", "Redux", "JavaScript", "Tailwind CSS"],
  "AWS DEVOPS": ["AWS", "Docker", "Kubernetes", "Jenkins"],
  "AZURE DEVOPS": ["Azure", "CI/CD", "Terraform", "Pipelines"],
  "SQL DEVELOPER": ["SQL", "PL/SQL", "Stored Procedures", "Triggers"],
};

// ─── SkillTagInput Component ──────────────────────────────────────────────────
// Filters suggestions based on the selected technology's skill set when available,
// otherwise falls back to the full SKILL_OPTIONS list.
function SkillTagInput({ selectedSkills, onChange, error, technology }) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Pool of skills to suggest: technology-specific first, then full list
  const skillPool =
    technology && technologySkills[technology]
      ? [
          ...technologySkills[technology],
          ...SKILL_OPTIONS.filter(
            (s) => !technologySkills[technology].includes(s)
          ),
        ]
      : SKILL_OPTIONS;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = skillPool.filter(
    (skill) =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const showOtherOption =
    inputValue.trim().length > 0 &&
    !SKILL_OPTIONS.some(
      (s) => s.toLowerCase() === inputValue.trim().toLowerCase()
    ) &&
    !selectedSkills.includes(inputValue.trim());

  const allOptions = showOtherOption
    ? [...filteredOptions, "__OTHER__"]
    : filteredOptions;

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onChange([...selectedSkills, skill]);
    }
    setInputValue("");
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => {
    onChange(selectedSkills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (!allOptions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (highlightedIndex + 1) % allOptions.length;
      setHighlightedIndex(next);
      document
        .getElementById(`skill-option-${next}`)
        ?.scrollIntoView({ block: "nearest" });
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev =
        (highlightedIndex - 1 + allOptions.length) % allOptions.length;
      setHighlightedIndex(prev);
      document
        .getElementById(`skill-option-${prev}`)
        ?.scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && allOptions[highlightedIndex]) {
        const selected = allOptions[highlightedIndex];
        addSkill(selected === "__OTHER__" ? inputValue.trim() : selected);
        setHighlightedIndex(-1);
      } else if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
    }
    if (e.key === "Backspace" && !inputValue && selectedSkills.length > 0) {
      removeSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Tag box */}
      <div
        className={`border rounded p-2 flex flex-wrap items-center gap-2 cursor-text min-h-[46px] ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => {
          setShowDropdown(true);
          inputRef.current?.focus();
        }}
      >
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200"
          >
            {skill}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(skill);
              }}
              className="text-blue-400 hover:text-red-500 font-bold leading-none cursor-pointer ml-1"
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={
            selectedSkills.length === 0 ? "Search and add skills..." : ""
          }
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
          style={{
            width: selectedSkills.length === 0 ? "100%" : "0px",
            minWidth: selectedSkills.length === 0 ? "150px" : "0px",
          }}
        />

        {selectedSkills.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="w-6 h-6 rounded-full bg-blue-400 hover:bg-blue-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            +
          </button>
        )}
      </div>

      {/* Secondary search input when tags exist and dropdown is open */}
      {selectedSkills.length > 0 && showDropdown && (
        <input
          type="text"
          value={inputValue}
          placeholder="Search skills..."
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          className="mt-1 w-full border border-gray-300 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
        />
      )}

      {/* Dropdown list */}
      {showDropdown && allOptions.length > 0 && (
        <ul
          ref={dropdownRef}
          className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto mt-1"
          style={{ maxHeight: "180px" }}
        >
          {allOptions.map((skill, index) => (
            <li
              key={skill}
              id={`skill-option-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                addSkill(
                  skill === "__OTHER__" ? inputValue.trim() : skill
                );
                setHighlightedIndex(-1);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                skill === "__OTHER__"
                  ? highlightedIndex === index
                    ? "bg-blue-50 text-blue-700 font-semibold border-t border-gray-200"
                    : "text-blue-600 font-semibold border-t border-gray-200 hover:bg-blue-50"
                  : highlightedIndex === index
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {skill === "__OTHER__"
                ? `+ Add "${inputValue.trim()}" as custom skill`
                : skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main Addproject Component ────────────────────────────────────────────────
function Addproject() {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [creatorName] = useState(localStorage.getItem("resourceName"));
  const [developerAmount, setDeveloperAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [technology, setTechnology] = useState("");
  const [customTech, setCustomTech] = useState("");
  // FIX: skills is now an array of strings (not undefined)
  const [skills, setSkills] = useState([]);
  const [developerName, setDeveloperName] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [resourceNames, setResourceNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const getResNames = () => {
    if (!technology) return;
    const payload = { permissionId: 3, technology };
    axios
      .post(
        "http://localhost:8098/api/v1/projects/getResourceNames",
        payload
      )
      .then((res) => {
        if (res.status === 200) {
          setResourceNames(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  // Recalculate total amount whenever buffer or developer amount changes
  const allocation = () => {
    const total = Number(totalAmount);
    const dev = Number(developerAmount);
    if (total > 0 && dev > 0) {
      setAmount(total + dev);
    }
  };

  // Fetch resource names whenever skills selection changes
  useEffect(() => {
    if (skills.length > 0 && technology) {
      getResNames();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!projectName.trim()) newErrors.projectName = "Project Name is required";
    if (!clientName.trim()) newErrors.clientName = "Client Name is required";
    if (!totalAmount || Number(totalAmount) <= 0)
      newErrors.totalAmount = "Enter a valid Total Amount";
    if (!developerAmount || Number(developerAmount) <= 0)
      newErrors.developerAmount = "Enter a valid Developer Amount";
    if (!startDate) newErrors.startDate = "Start Date is required";
    if (!endDate) newErrors.endDate = "End Date is required";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Amount is required";
    if (!status || status === "Select Role")
      newErrors.status = "Status is required";
    if (!technology) newErrors.technology = "Technology is required";
    if (technology === "Other" && !customTech.trim())
      newErrors.customTech = "Please enter the custom technology";
    if (!skills || skills.length === 0)
      newErrors.skills = "Please select at least one skill";
    if (!resourceId) newErrors.resourceId = "Developer Name is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    const payload = {
      name: projectName,
      clientName,
      totalAmount,
      developerAmount,
      startDate,
      endDate,
      amount,
      status,
      technology: technology === "Other" ? customTech : technology,
      skills,
      developerName,
      resourceDto: {},
      resourceId,
      createdAt: new Date(),
      createdBy: creatorName,
      updatedAt: new Date(),
      updatedBy: creatorName,
    };

    axios
      .post("http://localhost:8098/api/v1/projects/createproject", payload)
      .then(() => {
        navigate("/manageprojects");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };

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
                    <label className="font-semibold mb-1 block">
                      Project Name <span className="text-pink-800">*</span>
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => {
                        setProjectName(e.target.value);
                        if (errors.projectName)
                          setErrors((prev) => ({ ...prev, projectName: "" }));
                      }}
                      placeholder="Enter Project Name"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.projectName
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    />
                    {errors.projectName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.projectName}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Client Name <span className="text-pink-800">*</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        if (errors.clientName)
                          setErrors((prev) => ({ ...prev, clientName: "" }));
                      }}
                      placeholder="Enter Client Name"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.clientName
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    />
                    {errors.clientName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.clientName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2 — Buffer Allocation + Developer Allocation */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Buffer Allocation <span className="text-pink-800">*</span>
                    </label>
                    <div className="flex">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                        $
                      </span>
                      <input
                        type="number"
                        value={totalAmount}
                        onBlur={allocation}
                        onChange={(e) => {
                          setTotalAmount(e.target.value);
                          if (errors.totalAmount)
                            setErrors((prev) => ({
                              ...prev,
                              totalAmount: "",
                            }));
                        }}
                        className={`border border-l-0 p-3 rounded-r w-full text-sm focus:outline-none focus:ring-2 ${
                          errors.totalAmount
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.totalAmount && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.totalAmount}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Developer Allocation{" "}
                      <span className="text-pink-800">*</span>
                    </label>
                    <div className="flex">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                        $
                      </span>
                      <input
                        type="number"
                        value={developerAmount}
                        onBlur={allocation}
                        onChange={(e) => {
                          setDeveloperAmount(e.target.value);
                          if (errors.developerAmount)
                            setErrors((prev) => ({
                              ...prev,
                              developerAmount: "",
                            }));
                        }}
                        className={`border border-l-0 p-3 rounded-r w-full text-sm focus:outline-none focus:ring-2 ${
                          errors.developerAmount
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.developerAmount && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.developerAmount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3 — Start Date + End Date */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Start Date <span className="text-pink-800">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (errors.startDate)
                          setErrors((prev) => ({ ...prev, startDate: "" }));
                      }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.startDate
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      End Date <span className="text-pink-800">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (errors.endDate)
                          setErrors((prev) => ({ ...prev, endDate: "" }));
                      }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.endDate
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    />
                    {errors.endDate && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 4 — Amount (read-only) + Status */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Amount <span className="text-pink-800">*</span>
                    </label>
                    <div className="flex">
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">
                        $
                      </span>
                      <input
                        type="number"
                        value={amount}
                        readOnly
                        className={`border border-l-0 p-3 rounded-r w-full text-sm bg-gray-50 focus:outline-none focus:ring-2 ${
                          errors.amount
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.amount}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Status <span className="text-pink-800">*</span>
                    </label>
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        if (errors.status)
                          setErrors((prev) => ({ ...prev, status: "" }));
                      }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.status
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    >
                      <option value="">Select Status</option>
                      <option>In Progress</option>
                      <option>Yet to Start</option>
                      <option>Completed</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 5 — Technology (+ custom if "Other") */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Technology <span className="text-pink-800">*</span>
                    </label>
                    <select
                      value={technology}
                      onChange={(e) => {
                        setTechnology(e.target.value);
                        // FIX: clear skills when technology changes
                        setSkills([]);
                        setCustomTech("");
                        setResourceNames([]);
                        setResourceId("");
                        if (errors.technology)
                          setErrors((prev) => ({ ...prev, technology: "" }));
                      }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.technology
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    >
                      <option value="">Select Technology</option>
                      <option value="JAVA">JAVA</option>
                      <option value="DOTNET">DOTNET</option>
                      <option value="TESTING">TESTING</option>
                      <option value="ANGULAR">ANGULAR</option>
                      <option value="REACTJS">REACTJS</option>
                      <option value="AWS DEVOPS">AWS DEVOPS</option>
                      <option value="AZURE DEVOPS">AZURE DEVOPS</option>
                      <option value="SQL DEVELOPER">SQL DEVELOPER</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.technology && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.technology}
                      </p>
                    )}
                  </div>

                  {technology === "Other" && (
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold mb-1 block">
                        Other Technology{" "}
                        <span className="text-pink-800">*</span>
                      </label>
                      <input
                        type="text"
                        value={customTech}
                        onChange={(e) => {
                          setCustomTech(e.target.value);
                          if (errors.customTech)
                            setErrors((prev) => ({
                              ...prev,
                              customTech: "",
                            }));
                        }}
                        placeholder="Enter Custom Technology"
                        className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                          errors.customTech
                            ? "border-red-500 focus:ring-red-300"
                            : "border-gray-300 focus:ring-blue-300"
                        }`}
                      />
                      {errors.customTech && (
                        <p className="text-red-600 text-sm mt-1">
                          {errors.customTech}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Row 6 — Skills (Tag Dropdown) + Developer Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Skills <span className="text-pink-800">*</span>
                    </label>
                    <SkillTagInput
                      selectedSkills={skills}
                      onChange={(updatedSkills) => {
                        setSkills(updatedSkills);
                        if (errors.skills)
                          setErrors((prev) => ({ ...prev, skills: "" }));
                      }}
                      error={errors.skills}
                      technology={technology}
                    />
                    {errors.skills && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.skills}
                      </p>
                    )}
                  </div>

                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">
                      Developer Name <span className="text-pink-800">*</span>
                    </label>
                    <select
                      value={resourceId}
                      name="developerName"
                      onChange={(e) => {
                        setResourceId(e.target.value);
                        setDeveloperName(e.target.value);
                        if (errors.resourceId)
                          setErrors((prev) => ({ ...prev, resourceId: "" }));
                      }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                        errors.resourceId
                          ? "border-red-500 focus:ring-red-300"
                          : "border-gray-300 focus:ring-blue-300"
                      }`}
                    >
                      <option value="">Select Resource Name</option>
                      {resourceNames.map((name) => (
                        <option key={name.id} value={name.id}>
                          {name.resourceName}
                        </option>
                      ))}
                    </select>
                    {errors.resourceId && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.resourceId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => navigate("/manageprojects")}
                  >
                    Back
                  </button>
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
                    onClick={handleSubmit}
                  >
                    Save
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

export default Addproject;