import Header from "../Header";
import Sidebar from "../Sidebar";
import { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── Skill options list ───────────────────────────────────────────────────────
const SKILL_OPTIONS = [
  "Java", "Spring Boot", "Spring MVC", "Spring Security", "Spring Cloud",
  "Hibernate", "JPA", "JDBC", "Maven", "Gradle", "JUnit", "Mockito",
  "Microservices", "REST API", "SOAP", "Apache Kafka", "RabbitMQ",
  "C#", ".NET", "ASP.NET", "ASP.NET Core", "Entity Framework", "LINQ",
  "WPF", "WCF", "Blazor", "NUnit", "SignalR",
  "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Next.js",
  "Nuxt.js", "Redux", "MobX", "HTML", "CSS", "Sass", "Tailwind CSS",
  "Bootstrap", "Material UI", "Ant Design", "jQuery", "Webpack", "Vite",
  "Node.js", "Express.js", "NestJS", "FastAPI", "Django", "Flask",
  "Python", "Ruby on Rails", "PHP", "Laravel", "Go", "Golang",
  "Rust", "Kotlin", "Scala", "Groovy",
  "Android", "iOS", "Swift", "Objective-C", "React Native", "Flutter",
  "Dart", "Xamarin", "Ionic",
  "SQL", "MySQL", "PostgreSQL", "SQL Server", "Oracle", "SQLite",
  "MongoDB", "Redis", "Elasticsearch", "Cassandra", "DynamoDB",
  "Firebase", "Neo4j", "CouchDB", "MariaDB",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
  "Ansible", "Jenkins", "GitHub Actions", "GitLab CI/CD", "CI/CD",
  "Linux", "Bash", "Shell Scripting", "Nginx", "Apache",
  "Prometheus", "Grafana", "ELK Stack", "Splunk",
  "Selenium", "TestNG", "Cypress", "Playwright", "Jest",
  "Postman", "Swagger", "JMeter", "LoadRunner", "Appium",
  "Manual Testing", "Automation Testing", "Performance Testing",
  "API Testing", "UAT",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-learn", "Pandas", "NumPy", "Power BI", "Tableau",
  "Data Analysis", "Data Science", "Big Data", "Apache Spark",
  "Hadoop", "Hive", "Airflow", "dbt",
  "Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence",
  "Agile", "Scrum", "Kanban", "GraphQL", "gRPC",
  "WebSockets", "OAuth", "JWT", "Microservices Architecture",
  "Design Patterns", "System Design", "DevSecOps", "SonarQube",
];

const PHONE_COUNTRIES = [
  { code: '+91', flag: '🇮🇳', label: '+91' },
  { code: '+46', flag: '🇸🇪', label: '+46' },
  { code: '+1',  flag: '🇺🇸', label: '+1'  },
];

// ─── SkillTagInput Component ──────────────────────────────────────────────────
function SkillTagInput({ value, onChange, error }) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value && selectedSkills.length === 0) {
      const arr = value.split(',').map(s => s.trim()).filter(Boolean);
      setSelectedSkills(arr);
    }
  }, [value]);

  useEffect(() => {
    onChange(selectedSkills.join(', '));
  }, [selectedSkills]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = SKILL_OPTIONS.filter(
    skill =>
      skill.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const showOtherOption =
    inputValue.trim().length > 0 &&
    !SKILL_OPTIONS.some(s => s.toLowerCase() === inputValue.trim().toLowerCase()) &&
    !selectedSkills.includes(inputValue.trim());

  const allOptions = showOtherOption ? [...filteredOptions, '__OTHER__'] : filteredOptions;

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
    setInputValue('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeSkill = (skill) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (highlightedIndex + 1) % allOptions.length;
      setHighlightedIndex(nextIndex);
      document.getElementById(`skill-option-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (highlightedIndex - 1 + allOptions.length) % allOptions.length;
      setHighlightedIndex(prevIndex);
      document.getElementById(`skill-option-${prevIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && allOptions[highlightedIndex]) {
        const selected = allOptions[highlightedIndex];
        addSkill(selected === '__OTHER__' ? inputValue.trim() : selected);
        setHighlightedIndex(-1);
      } else if (inputValue.trim()) {
        addSkill(inputValue.trim());
      }
    }
    if (e.key === 'Backspace' && !inputValue && selectedSkills.length > 0) {
      removeSkill(selectedSkills[selectedSkills.length - 1]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`border-2 rounded p-2 flex flex-wrap items-center gap-2 cursor-text min-h-[42px] transition-all ${
          error ? 'border-red-500' : isFocused ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-yellow-400'
        }`}
        onClick={() => { setShowDropdown(true); inputRef.current?.focus(); }}
      >
        {selectedSkills.map(skill => (
          <span key={skill} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
            {skill}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeSkill(skill); }} className="text-gray-400 hover:text-red-500 font-bold leading-none cursor-pointer ml-1">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={selectedSkills.length === 0 ? "Search and add skills..." : ""}
          onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); setHighlightedIndex(-1); }}
          onFocus={() => { setShowDropdown(true); setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
          style={{ width: selectedSkills.length === 0 ? '100%' : '0px', minWidth: selectedSkills.length === 0 ? '150px' : '0px' }}
        />
        {selectedSkills.length > 0 && (
          <button type="button" onClick={(e) => { e.stopPropagation(); setShowDropdown(true); setTimeout(() => inputRef.current?.focus(), 0); }} className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0">+</button>
        )}
      </div>

      {selectedSkills.length > 0 && showDropdown && (
        <input
          type="text"
          value={inputValue}
          placeholder="Search skills..."
          onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); setHighlightedIndex(-1); }}
          onKeyDown={handleKeyDown}
          autoFocus
          className="mt-1 w-full border-2 border-yellow-400 rounded p-2 text-sm outline-none"
        />
      )}

      {showDropdown && allOptions.length > 0 && (
        <ul ref={dropdownRef} className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto mt-1" style={{ maxHeight: '180px' }}>
          {allOptions.map((skill, index) => (
            <li
              key={skill}
              id={`skill-option-${index}`}
              onMouseDown={(e) => { e.preventDefault(); addSkill(skill === '__OTHER__' ? inputValue.trim() : skill); setHighlightedIndex(-1); }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                skill === '__OTHER__'
                  ? highlightedIndex === index ? 'bg-yellow-100 text-blue-700 font-semibold border-t border-gray-200' : 'text-blue-600 font-semibold border-t border-gray-200 hover:bg-yellow-50'
                  : highlightedIndex === index ? 'bg-yellow-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-yellow-50'
              }`}
            >
              {skill === '__OTHER__' ? `+ Add "${inputValue.trim()}" as custom skill` : skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── AssignedEmployeesInput Component ────────────────────────────────────────
function AssignedEmployeesInput({ assignedEmployees, onRemove, availableEmployees, onAdd, error }) {
  const [searchTerm, setSearchTerm]         = useState('');
  const [showDropdown, setShowDropdown]     = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef     = useRef(null);
  // Tracks whether the mouse is pressed inside the dropdown list.
  // Prevents the input's onBlur from closing the dropdown before onMouseDown fires.
  const mouseDownInsideDropdown = useRef(false);

  // Close on outside click only
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightedIdx(-1);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Filter available pool — exclude already assigned ones
  const filteredPool = availableEmployees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) &&
      !assignedEmployees.some(a => a.id === emp.id)
    );
  });

  const openDropdown = () => {
    setShowDropdown(true);
    setHighlightedIdx(-1);
    // Small delay so React has rendered the input before focusing
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAdd = (emp) => {
    onAdd(emp);
    setSearchTerm('');
    setHighlightedIdx(-1);
    // Keep dropdown open so user can keep adding
    setShowDropdown(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputBlur = () => {
    // If the user clicked inside the dropdown list, don't close —
    // let the onMouseDown handler on the list item fire first.
    if (mouseDownInsideDropdown.current) return;
    setShowDropdown(false);
    setHighlightedIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || filteredPool.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIdx(i => (i + 1) % filteredPool.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIdx(i => (i - 1 + filteredPool.length) % filteredPool.length);
    }
    if (e.key === 'Enter' && highlightedIdx >= 0) {
      e.preventDefault();
      handleAdd(filteredPool[highlightedIdx]);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
      setHighlightedIdx(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative">

      {/* ── Badge area — clicking opens the search ── */}
      <div
        className={`border-2 rounded p-2 min-h-[42px] flex flex-wrap gap-2 bg-white cursor-text ${
          error ? 'border-red-500' : 'border-yellow-400'
        }`}
        onClick={openDropdown}
      >
        {assignedEmployees.length === 0 ? (
          <span className="text-gray-400 text-sm self-center pointer-events-none">
            No employees assigned yet — click to search
          </span>
        ) : (
          assignedEmployees.map(emp => (
            <span
              key={emp.id}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 rounded-full"
            >
              {emp.firstName} {emp.lastName}
              <button
                type="button"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onRemove(emp.id); }}
                title="Remove employee"
                className="ml-1 text-blue-400 hover:text-red-500 font-bold leading-none cursor-pointer transition-colors"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* ── Search input — shown when dropdown is open ── */}
      {showDropdown && (
        <div className="mt-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            placeholder="Type to search employees..."
            autoFocus
            onChange={(e) => { setSearchTerm(e.target.value); setHighlightedIdx(-1); }}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className="w-full border-2 border-yellow-400 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-yellow-200"
          />

          {/* Dropdown list */}
          {filteredPool.length > 0 && (
            <ul
              className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto mt-1"
              style={{ maxHeight: '180px' }}
              onMouseDown={() => { mouseDownInsideDropdown.current = true; }}
              onMouseUp={() => { mouseDownInsideDropdown.current = false; }}
            >
              {filteredPool.map((emp, idx) => (
                <li
                  key={emp.id}
                  onMouseDown={(e) => { e.preventDefault(); handleAdd(emp); }}
                  onMouseEnter={() => setHighlightedIdx(idx)}
                  onMouseLeave={() => setHighlightedIdx(-1)}
                  className={`px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                    highlightedIdx === idx
                      ? 'bg-yellow-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-yellow-50'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {emp.firstName?.[0]?.toUpperCase()}
                  </span>
                  {emp.firstName} {emp.lastName}
                </li>
              ))}
            </ul>
          )}

          {/* No results */}
          {searchTerm.trim() && filteredPool.length === 0 && (
            <div className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow mt-1 px-3 py-2 text-sm text-gray-400">
              No matching employees found
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ─── Main Resource_edit Component ────────────────────────────────────────────
function Resource_edit() {
  const [resData, setResData]             = useState({});
  const [resourceName, setResourceName]   = useState("");
  const [firstName, setFirstName]         = useState("");
  const [customTechnology, setCustomTechnology] = useState('');
  const [lastName, setLastName]           = useState("");
  const [loading, setLoading]             = useState(false);
  const [email, setEmail]                 = useState("");
  const [phone, setPhone]                 = useState("");
  const [phoneDialCode, setPhoneDialCode] = useState('+91');
  const [errors, setErrors]               = useState({});
  const [technology, setTechnology]       = useState("");
  const [skill, setSkill]                 = useState("");
  const [employmenttype, setEmploymenttype] = useState("");
  const [experience, setExperience]       = useState("");
  const [status, setStatus]               = useState("");
  const [startdate, setStartdate]         = useState(new Date());
  const [enddate, setEnddate]             = useState(new Date());
  const [error, setError]                 = useState(false);
  const navigate                          = useNavigate();
  const [managerId, setManagerId]         = useState('');
  const [permissionid, setPermissionid]   = useState('');
  const [resourceId, setResourceid]       = useState(localStorage.getItem("rid"));
  const [creatorName, setCreatorName]     = useState(localStorage.getItem("resourceName"));
  const [comments, setComments]           = useState('');
  const [isClient, setIsClient]           = useState(false);

  // ─── Role & employee assignment state ───────────────────────────────────
  const [selectedRole, setSelectedRole]           = useState('');
  // Full employee objects that are currently assigned to this manager
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  // Full pool of unassigned employees fetched from backend
  const [employeePool, setEmployeePool]           = useState([]);

  // ── Step 1: fetch unassigned employees (the available pool) ─────────────
  useEffect(() => {
    axios.get('http://localhost:8098/api/v1/resource/getAllUnassignedResources')
      .then(res => {
        const onlyEmployees = (res.data || []).filter(emp => emp.permissionId === 4);
        setEmployeePool(onlyEmployees);
      })
      .catch(() => {});
  }, []);

  // ── Step 2: fetch this resource's data ──────────────────────────────────
  //   After loading, if this is a Manager and has assignedResourceIds,
  //   we need full employee objects for the badge display.
  //   Those employees are currently ASSIGNED (not in the unassigned pool),
  //   so we fetch them individually by ID.
  useEffect(() => {
    const resourceid = localStorage.getItem("temp_id_for_use");
    if (!resourceid) return;

    axios.get(`http://localhost:8098/api/v1/resource/${resourceid}`)
      .then((res) => {
        const data = res.data;
        setResData(data);
        setResourceName(data.resourceName || "");
        setResourceid(data.id);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setEmail(data.email || "");

        const rawPhone = data.phone || "";
        const matchedCountry = PHONE_COUNTRIES.find(c => rawPhone.startsWith(c.code));
        if (matchedCountry) {
          setPhoneDialCode(matchedCountry.code);
          setPhone(rawPhone.replace(matchedCountry.code, '').trim());
        } else {
          setPhone(rawPhone);
        }

        setTechnology(data.technology || "");
        setSkill(data.skill || "");
        setEmploymenttype(data.employmentType || "");
        setExperience(data.experience || "");
        setStatus(data.status || "");
        setStartdate(data.startDate?.split("T")[0] || "");
        setEnddate(data.endDate?.split("T")[0] || "");
        setManagerId(data.managerId);
        setPermissionid(data.permissionId);
        setComments(data.comments || "");

        const permissionToRole = { 1: 'Admin', 2: 'HR', 3: 'Manager', 4: 'Employee' };
        setSelectedRole(permissionToRole[data.permissionId] || '');

        // ── Fetch already-assigned employees via the same endpoint the view page uses ──
        if (data.permissionId === 3) {
          axios.get(`http://localhost:8098/api/v1/resource/getAllResourcesByManagerId/${resourceid}`)
            .then(empRes => setAssignedEmployees(empRes.data ?? []))
            .catch(() => {});
        }
      })
      .catch((err) => console.error("Error fetching resource:", err));
  }, []);

  // ── Role change: clear assigned list when role changes away from Manager ─
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role !== 'Manager') setAssignedEmployees([]);
  };

  // ── Add employee from dropdown → move into assignedEmployees ────────────
  const handleAddEmployee = (emp) => {
    setAssignedEmployees(prev => [...prev, emp]);
  };

  // ── Remove badge → employee goes back into available pool automatically ──
  // (filteredPool in AssignedEmployeesInput re-computes and will include them
  //  again since we only filter out ids present in assignedEmployees)
  const handleRemoveEmployee = (empId) => {
    setAssignedEmployees(prev => prev.filter(e => e.id !== empId));
  };

  // ── The available pool = fetched unassigned + any we removed this session ─
  // Employees who were already assigned when the page loaded are NOT in the
  // unassigned pool from the backend. When we remove them from assignedEmployees
  // we want them to appear in the dropdown so the user can re-add if needed.
  // We achieve this by merging employeePool with the enriched assigned list,
  // deduplicating by id.
  const [initialAssigned, setInitialAssigned] = useState([]);
  useEffect(() => {
    if (assignedEmployees.length > 0 && initialAssigned.length === 0) {
      setInitialAssigned(assignedEmployees);
    }
  }, [assignedEmployees]);

  const fullAvailablePool = [
    ...employeePool,
    ...initialAssigned.filter(a => !employeePool.some(e => e.id === a.id)),
  ];

  // ─── Validation ──────────────────────────────────────────────────────────
  const validateFields = () => {
    const newErrors = {};
    if (!firstName?.trim())   newErrors.firstName      = "First name is required.";
    if (!lastName?.trim())    newErrors.lastName       = "Last name is required.";
    if (!email?.trim())       newErrors.email          = "Email is required.";
    if (!phone?.trim())       newErrors.phone          = "Mobile is required.";
    if (!skill?.trim())       newErrors.skill          = "Skills are required.";
    if (!technology?.trim())  newErrors.technology     = "Technology is required.";
    if (!employmenttype?.trim()) newErrors.employmentType = "Employment type is required.";
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0)
                              newErrors.experience     = "Valid experience is required.";
    if (!selectedRole)        newErrors.selectedRole   = "Employment role is required.";
    if (!comments?.trim())    newErrors.comments       = "Comments are required.";
    if (!status)              newErrors.status         = "Status is required.";
    return newErrors;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    const roleToPermissionId = { Admin: 1, HR: 2, Manager: 3, Employee: 4 };

    const formData = new FormData();
    let finalTechnology = technology;
    if (technology === "OTHER") finalTechnology = `${technology},${customTechnology}`;

    const payload = {
      id: resourceId,
      permissionId: roleToPermissionId[selectedRole] ?? permissionid,
      managerId,
      resourceName,
      firstName,
      lastName,
      linkedin: "cns",
      startDate: startdate,
      endDate: enddate,
      skill,
      technology: finalTechnology,
      experience,
      employmentType: employmenttype,
      phone: `${phoneDialCode} ${phone}`,
      email,
      client: isClient,
      status,
      comments: comments || "cns",
      assignedResourceIds: selectedRole === 'Manager' ? assignedEmployees.map(e => e.id) : [],
      createdAt: new Date(),
      createdBy: creatorName,
      updatedAt: new Date(),
      updatedBy: creatorName,
    };
    formData.append("payload", JSON.stringify(payload));
    formData.append("attachments", new Blob([]), "empty.txt");

    axios
      .put("http://localhost:8098/api/v1/resource/update/upload", formData)
      .then(() => navigate('/manageresources'))
      .catch(() => {})
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
              Edit Resource
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <ClipLoader size={60} color="#FACC15" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Row 1: Resource Name + First Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Resource Name *</label>
                    <input type="text" value={resourceName} onChange={(e) => setResourceName(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">First Name *</label>
                    <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Row 2: Last Name + Email */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Last Name *</label>
                    <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Email *</label>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 3: Phone + Skill */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Phone *</label>
                    <div className={`flex border-2 rounded overflow-hidden ${errors.phone ? 'border-red-500' : 'border-yellow-400'}`}>
                      <select value={phoneDialCode} onChange={(e) => setPhoneDialCode(e.target.value)} className="bg-gray-50 border-r-2 border-yellow-400 px-2 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer">
                        {PHONE_COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.label}</option>)}
                      </select>
                      <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }} placeholder="Enter phone number" className="flex-1 p-2 text-sm outline-none bg-white" />
                    </div>
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Skill *</label>
                    <SkillTagInput value={skill} onChange={(val) => { setSkill(val); setErrors(p => ({ ...p, skill: '' })); }} error={errors.skill} />
                    {errors.skill && <p className="text-red-600 text-sm mt-1">{errors.skill}</p>}
                  </div>
                </div>

                {/* Row 4: Technology + Experience */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Technology *</label>
                    <select value={technology} onChange={(e) => { const v = e.target.value; setTechnology(v); if (v !== 'OTHER') setCustomTechnology(''); setErrors(p => ({ ...p, technology: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full">
                      <option value="">{technology || '-- Select Technology --'}</option>
                      <option value="JAVA">JAVA</option>
                      <option value="DOTNET">DOTNET</option>
                      <option value="TESTING">TESTING</option>
                      <option value="ANGULAR">ANGULAR</option>
                      <option value="REACTJS">REACTJS</option>
                      <option value="AWS DEVOPS">AWS DEVOPS</option>
                      <option value="AZURE DEVOPS">AZURE DEVOPS</option>
                      <option value="SQL DEVELOPER">SQL DEVELOPER</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                    {technology === 'OTHER' && (
                      <input type="text" value={customTechnology} onChange={(e) => setCustomTechnology(e.target.value.toUpperCase())} placeholder="Enter custom technology" className="mt-2 border-2 border-yellow-400 p-2 rounded w-full text-sm" />
                    )}
                    {errors.technology && <p className="text-red-600 text-sm">{errors.technology}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Experience *</label>
                    <input type="text" value={experience} onChange={(e) => { setExperience(e.target.value); setErrors(p => ({ ...p, experience: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.experience && <p className="text-red-600 text-sm">{errors.experience}</p>}
                  </div>
                </div>

                {/* Row 5: Employment Type + Employment Role */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Employment Type *</label>
                    <select value={employmenttype} onChange={(e) => { setEmploymenttype(e.target.value); setErrors(p => ({ ...p, employmentType: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full">
                      <option value="">-- Select Type --</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Sweden-FullTime">Sweden-FullTime</option>
                      <option value="India-FullTime">India-FullTime</option>
                      <option value="USA-FullTime">USA-FullTime</option>
                    </select>
                    {errors.employmentType && <p className="text-red-600 text-sm">{errors.employmentType}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Employment Role *</label>
                    <select value={selectedRole} onChange={(e) => { handleRoleChange(e.target.value); setErrors(p => ({ ...p, selectedRole: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full">
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="HR">HR</option>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </select>
                    {errors.selectedRole && <p className="text-red-600 text-sm mt-1">{errors.selectedRole}</p>}
                  </div>
                </div>

                {/* ── Assigned Employees — only when role is Manager ── */}
                {selectedRole === 'Manager' && (
                  <div>
                    <label className="font-semibold mb-1 block">
                      Assigned Employees
                      {assignedEmployees.length > 0 && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          ({assignedEmployees.length} assigned)
                        </span>
                      )}
                    </label>
                    <AssignedEmployeesInput
                      assignedEmployees={assignedEmployees}
                      onRemove={handleRemoveEmployee}
                      availableEmployees={fullAvailablePool}
                      onAdd={handleAddEmployee}
                      error={errors.assignedEmployees}
                    />
                  </div>
                )}

                {/* Row 6: Comments */}
                <div>
                  <label className="font-semibold mb-1 block">Comments *</label>
                  <textarea
                    value={comments}
                    onChange={(e) => { setComments(e.target.value); setErrors(p => ({ ...p, comments: '' })); }}
                    placeholder="Enter comments"
                    rows={3}
                    className={`border-2 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                      errors.comments ? 'border-red-500 focus:ring-red-200' : 'border-yellow-400 focus:ring-yellow-200'
                    }`}
                  />
                  {errors.comments && <p className="text-red-600 text-sm mt-1">{errors.comments}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                  <button onClick={() => navigate('/manageresources')} type="button" className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer">
                    Back
                  </button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition">
                    Save Changes
                  </button>
                </div>

              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Resource_edit;