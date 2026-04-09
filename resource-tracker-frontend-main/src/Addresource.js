import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// ─── Skill options list ───────────────────────────────────────────────────────
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

// ─── SkillTagInput Component ──────────────────────────────────────────────────
function SkillTagInput({ value, onChange, error }) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value && selectedSkills.length === 0) {
      const arr = value.split(',').map(s => s.trim()).filter(Boolean);
      setSelectedSkills(arr);
    }
  }, []);

  useEffect(() => {
    onChange(selectedSkills.join(', '));
  }, [selectedSkills]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
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

  const allOptions = showOtherOption
    ? [...filteredOptions, '__OTHER__']
    : filteredOptions;

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

      {/* Tag box */}
      <div
        className={`border rounded p-2 flex flex-wrap items-center gap-2 cursor-text min-h-[42px] ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        onClick={() => {
          setShowDropdown(true);
          inputRef.current?.focus();
        }}
      >
        {selectedSkills.map(skill => (
          <span
            key={skill}
            className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300"
          >
            {skill}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
              className="text-gray-400 hover:text-red-500 font-bold leading-none cursor-pointer ml-1"
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={selectedSkills.length === 0 ? "Search and add skills..." : ""}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowDropdown(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
          style={{
            width: selectedSkills.length === 0 ? '100%' : '0px',
            minWidth: selectedSkills.length === 0 ? '150px' : '0px'
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

      {/* Search input shown below tags when + clicked */}
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
          style={{ maxHeight: '180px' }}
        >
          {allOptions.map((skill, index) => (
            <li
              key={skill}
              id={`skill-option-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                addSkill(skill === '__OTHER__' ? inputValue.trim() : skill);
                setHighlightedIndex(-1);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                skill === '__OTHER__'
                  ? highlightedIndex === index
                    ? 'bg-blue-50 text-blue-700 font-semibold border-t border-gray-200'
                    : 'text-blue-600 font-semibold border-t border-gray-200 hover:bg-blue-50'
                  : highlightedIndex === index
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {skill === '__OTHER__'
                ? `+ Add "${inputValue.trim()}" as custom skill`
                : skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main Addresource Component ───────────────────────────────────────────────
function Addresource() {
  const [isClient, setIsClient] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [disableFlag, setDisableFlag] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [customTechnology, setCustomTechnology] = useState('');
  const [successPopUp, setSuccessPopUp] = useState(false);
  const [emailCheck, setEmailCheck] = useState("");
  const [resourceNameCheck, setResourceNameCheck] = useState("");
  const [pagetype, setPageType] = useState("add");
  const [resourceid, setResourceId] = useState();
  const [resourceName, setResourceName] = useState();
  const [employeeId, setEmployeeId] = useState();
  const [linkedIn, setLinkedIn] = useState('');
  const [name, setName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState("");
  const [technology, setTechnology] = useState();
  const [skill, setSkill] = useState('');
  const [employmentType, setEmploymentType] = useState('Freelancing');
  const [experience, setExperience] = useState('');
  const [file, setFile] = useState([]);
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState("ACTIVE");
  const [permissionid, setPermissionId] = useState('');
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(true);
  const [experiencePopup, setexperiencePopup] = useState(false);
  const [upload, setUpload] = useState(false);
  const [payload, setPayLoad] = useState({});
  const [id, setId] = useState();
  const [crctskill, setCrctskill] = useState(false);
  const [resid, setResId] = useState();
  const [buttonFlag, setButtonFlag] = useState("SAVE");
  const navigate = useNavigate();
  const [phoneerror, setPhoneerror] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [mappedResources, setMappedResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [candidateSource, setCandidateSource] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8098/api/v1/resource/getAllUnassignedResources')
      .then(res => { setEmployeeList(res.data || []); })
      .catch(err => {});
    setPermissionId(localStorage.getItem("permissionid"));
    setEmployeeId(localStorage.getItem("employeeid"));
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setMappedResources([]);
    setSearchTerm('');
  };

  const handleSelect = (emp) => {
    setMappedResources([...mappedResources, emp]);
  };

  const handleRemove = (empId) => {
    setMappedResources(mappedResources.filter(e => e.id !== empId));
  };

  const filteredEmployees = employeeList.filter(
    emp =>
      (`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !mappedResources.some(e => e.id === emp.id)
  );

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value === 'yes';
    setIsClient(selectedValue);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!firstName?.trim()) newErrors.firstName = "First name is required.";
    if (!lastName?.trim()) newErrors.lastName = "Last name is required.";
    if (!email?.trim()) newErrors.email = "Email is required.";
    if (!phone?.trim()) {
      newErrors.phone = "Mobile is required.";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Mobile must be exactly 10 digits.";
    }
    if (!skill?.trim()) newErrors.skill = "Skills are required.";
    if (!technology?.trim()) newErrors.technology = "Technology is required.";
    if (!employmentType?.trim()) newErrors.employmentType = "Employment type is required.";
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0) newErrors.experience = "Valid experience is required.";
    if (!candidateSource?.trim()) newErrors.candidateSource = "Candidate source is required.";
    if (!file || file.length === 0) newErrors.file = "Resume file is required.";
    if (!comments?.trim()) newErrors.comments = "Comments are required.";
    if (!status) newErrors.status = "Status is required.";
    return newErrors;
  };

  const checkEmail = () => {
    if (!email?.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      return;
    }
    axios.get(`http://localhost:8098/api/v1/resource/emailCheck/${email}`)
      .then((res) => {
        if (res.status === 200) {
          if (res.data === "Email Available") {
            setErrors((prev) => ({ ...prev, email: "" }));
          } else {
            setErrors((prev) => ({ ...prev, email: res.data }));
          }
        }
      })
      .catch(() => {
        setErrors((prev) => ({ ...prev, email: "Error checking email." }));
      });
  };

  const checkResourceName = () => {
    if (!firstName?.trim()) {
      setErrors((prev) => ({ ...prev, firstName: "FirstName is required." }));
      return;
    }
    if (!lastName?.trim()) {
      setErrors((prev) => ({ ...prev, lastName: "LastName is required." }));
      return;
    }
    axios.get(`http://localhost:8098/api/v1/resource/nameCheck/${firstName + "_" + lastName}`)
      .then((res) => {
        if (res.status == 200) {
          if (res.data === "ResourceName Available") {
            setErrors((prev) => ({ ...prev, lastName: "" }));
          } else {
            setErrors((prev) => ({ ...prev, lastName: res.data }));
          }
        }
      });
  };

  const save = () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    if ((firstName && lastName && email && phone && skill && technology || customTechnology && employmentType && experience && file && status) != "") {
      if (experience >= 0) {
        setErrors(false);
        const formData = new FormData();
        if (file.length > 0) {
          for (let i = 0; i < file.length; i++) {
            formData.append("attachments", file[i]);
          }
        } else {
          formData.append("attachments", file);
        }
let basedonrole;

if (selectedRole === 'Admin') {
  basedonrole = 1;
} else if (selectedRole === 'HR') {
  basedonrole = 2;
} else if (selectedRole === 'Manager') {
  basedonrole = 3;
} else if (selectedRole === 'Employee') {
  basedonrole = 4;
}

        let finalTechnology = technology;
        if (technology == "OTHER") {
          finalTechnology = `${technology},${customTechnology}`;
        }

        let payload = {
          permissionId: basedonrole,
          managerId: null,
          resourceName: `${firstName}_${lastName}`,
          linkedin: linkedIn,
          firstName,
          lastName,
          name,
          startDate: startdate,
          endDate: enddate,
          skill,
          technology: finalTechnology,
          experience,
          assignedResourceIds: [],
          selectedRole,
          comments,
          employmentType: employmentType,
          phone,
          manager: null,
          permission: null,
          resourceAttachments: null,
          email,
          projects: [],
          status,
          createdAt: new Date(),
          createdBy: "parasuram",
          updatedAt: new Date(),
          updatedBy: "parasuram",
          client: isClient,
          resourceType: '',
          candidateSource,
        };

        let localpermission = localStorage.getItem("permissionid");
        if (localpermission == "2" && selectedRole == "Employee") {
          payload.managerId = employeeId;
        }
        if (selectedRole == "Manager") {
          payload = {
            ...payload,
            assignedResourceIds: mappedResources.map(resource => resource.id),
          };
        }
        formData.append("payload", JSON.stringify(payload));
        axios.post("http://localhost:8098/api/v1/resource/upload", formData)
          .then(() => { navigate('/manageresources'); })
          .catch(() => {})
          .finally(() => {});
      } else {
        setexperiencePopup(true);
      }
    } else {
      setErrors(true);
    }
  };

  return (
    <div className="min-h-full flex">
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
              Add Resource
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <ClipLoader size={60} color="#FACC15" />
              </div>
            ) : (
              <div className="space-y-6">

                {/* First Name + Last Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">First Name <span className="text-pink-800">*</span></label>
                    <input
                      type="text"
                      onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' })); }}
                      value={firstName}
                      placeholder="Enter first name"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.firstName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Last Name <span className="text-pink-800">*</span></label>
                    <input
                      type="text"
                      onBlur={checkResourceName}
                      onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' })); }}
                      value={lastName}
                      placeholder="Enter last name"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.lastName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email + Mobile */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Email <span className="text-pink-800">*</span></label>
                    <input
                      type="email"
                      onBlur={checkEmail}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                      value={email}
                      placeholder="Enter email"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Mobile <span className="text-pink-800">*</span></label>
                    <input
                      type="text"
                      onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: '' })); }}
                      value={phone}
                      placeholder="Enter mobile"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Skills (Tag Input) + Experience */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Skills <span className="text-pink-800">*</span></label>
                    <SkillTagInput
                      value={skill}
                      onChange={(val) => { setSkill(val); if (errors.skill) setErrors(prev => ({ ...prev, skill: '' })); }}
                      error={errors.skill}
                    />
                    {errors.skill && <p className="text-red-600 text-sm mt-1">{errors.skill}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Experience <span className="text-pink-800">*</span></label>
                    <input
                      type="text"
                      onChange={(e) => { setExperience(e.target.value); if (errors.experience) setErrors(prev => ({ ...prev, experience: '' })); }}
                      value={experience}
                      placeholder="Enter experience"
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.experience ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    />
                    {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
                  </div>
                </div>

                {/* Technology + Employment Type */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Technology <span className="text-pink-800">*</span></label>
                    <select
                      value={technology}
                      onChange={(e) => { const value = e.target.value; setTechnology(value); if (value !== 'OTHER') setCustomTechnology(''); if (errors.technology) setErrors(prev => ({ ...prev, technology: '' })); }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.technology ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    >
                      <option value="">-- Select Technology --</option>
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
                      <input
                        type="text"
                        value={customTechnology}
                        onChange={(e) => setCustomTechnology(e.target.value.toUpperCase())}
                        placeholder="Enter custom technology"
                        className="mt-2 border border-gray-300 p-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      />
                    )}
                    {errors.technology && <p className="text-red-600 text-sm mt-1">{errors.technology}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Employment Type <span className="text-pink-800">*</span></label>
                    <select
                      value={employmentType}
                      onChange={(e) => { setEmploymentType(e.target.value); if (errors.employmentType) setErrors(prev => ({ ...prev, employmentType: '' })); }}
                      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.employmentType ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Sweden-FullTime">Sweden-FullTime</option>
                      <option value="India FullTime">India-FullTime</option>
                      <option value="USA-FullTime">USA-FullTime</option>
                    </select>
                    {errors.employmentType && <p className="text-red-600 text-sm mt-1">{errors.employmentType}</p>}
                  </div>
                </div>

                {/* Employment Role */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1 block">Employment Role <span className="text-pink-800">*</span></label>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="border border-gray-300 p-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>

                {/* Manager Mapping */}
                {selectedRole === 'Manager' && (
                  <div className="mt-4">
                    <label className="font-semibold mb-1 block">Map Resource</label>
                    <div className="w-64">
                      <input
                        type="text"
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 p-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2"
                      />
                      {filteredEmployees.length > 0 && (
                        <div className="mt-2 border rounded-lg p-2 bg-white shadow-md max-h-40 overflow-y-auto">
                          {filteredEmployees.map((emp, idx) => (
                            <div
                              key={idx}
                              onClick={() => handleSelect(emp)}
                              className="cursor-pointer px-3 py-2 rounded-md hover:bg-blue-100 transition-all text-sm text-gray-800"
                            >
                              {`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {mappedResources.length > 0 && (
                      <div className="mt-4">
                        <strong className="block mb-1">Selected:</strong>
                        <ul className="list-disc list-inside text-sm">
                          {mappedResources.map((emp) => (
                            <li key={emp.id} className="flex justify-between items-center mb-1">
                              {`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`}
                              <button onClick={() => handleRemove(emp.id)} className="text-red-600 ml-2 text-sm">✕</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                   {/* Candidate Source */}
                <div className="flex flex-col mt-4">
                  <label className="font-semibold mb-1 block">Candidate Source <span className="text-pink-800">*</span></label>
                  <select
                    value={candidateSource}
                    onChange={(e) => { setCandidateSource(e.target.value); if (errors.candidateSource) setErrors(prev => ({ ...prev, candidateSource: '' })); }}
                    className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.candidateSource ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                  >
                    <option value="">-- Select Source --</option>
                    <option value="EXISTING">Existing Candidate</option>
                    <option value="NEW">New Candidate</option>
                  </select>
                  {errors.candidateSource && <p className="text-red-600 text-sm mt-1">{errors.candidateSource}</p>}
                </div>


                {/* Resume Upload */}
                <div>
                  <label className="font-semibold mb-1 block">Upload Resume <span className="text-pink-800">*</span></label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => { setFile(e.target.files); if (errors.file) setErrors(prev => ({ ...prev, file: '' })); }}
                    className={`border p-3 rounded w-full mt-2 text-sm ${errors.file ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
                </div>

                {/* Comments */}
                <div>
                  <label className="font-semibold mb-1 block">Comments <span className="text-pink-800">*</span></label>
                  <textarea
                    value={comments}
                    onChange={(e) => { setComments(e.target.value); if (errors.comments) setErrors(prev => ({ ...prev, comments: '' })); }}
                    placeholder="Enter comments"
                    rows={3}
                    className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.comments ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                  />
                  {errors.comments && <p className="text-red-600 text-sm mt-1">{errors.comments}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 p-4 items-center justify-center mt-8">
                  <button
                    onClick={() => navigate('/manageresources')}
                    className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={save}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
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

export default Addresource;