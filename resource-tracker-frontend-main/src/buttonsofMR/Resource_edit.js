import Header from "../Header";
import Sidebar from "../Sidebar";
import { useState, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Load existing skills from value prop (for edit mode)
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
        className={`border-2 rounded p-2 flex flex-wrap items-center gap-2 cursor-text min-h-[42px] transition-all ${
          error
            ? 'border-red-500'
            : isFocused
              ? 'border-yellow-400 ring-2 ring-yellow-200'
              : 'border-yellow-400'
        }`}
        onClick={() => {
          setShowDropdown(true);
          inputRef.current?.focus();
        }}
      >
        {/* Skill tags */}
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

        {/* Search input */}
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
          onFocus={() => { setShowDropdown(true); setIsFocused(true); }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
          style={{
            width: selectedSkills.length === 0 ? '100%' : '0px',
            minWidth: selectedSkills.length === 0 ? '150px' : '0px'
          }}
        />

        {/* + button */}
        {selectedSkills.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0"
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
          className="mt-1 w-full border-2 border-yellow-400 rounded p-2 text-sm outline-none"
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
                    ? 'bg-yellow-100 text-blue-700 font-semibold border-t border-gray-200'
                    : 'text-blue-600 font-semibold border-t border-gray-200 hover:bg-yellow-50'
                  : highlightedIndex === index
                    ? 'bg-yellow-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-yellow-50'
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

// ─── Main Resource_edit Component ────────────────────────────────────────────
function Resource_edit() {
  const [resData, setResData] = useState({});
  const [resourceName, setResourceName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [customTechnology, setCustomTechnology] = useState('');
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState('');
  const [technology, setTechnology] = useState("");
  const [skill, setSkill] = useState("");
  const [employmenttype, setEmploymenttype] = useState("");
  const [experience, setExperience] = useState("");
  const [status, setStatus] = useState("");
  const [startdate, setStartdate] = useState(new Date());
  const [enddate, setEnddate] = useState(new Date());
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [managerId, setManagerId] = useState('');
  const [permissionid, setPermissionid] = useState('');
  const [resourceId, setResourceid] = useState(localStorage.getItem("rid"));
  const [creatorName, setCreatorName] = useState(localStorage.getItem("resourceName"));
  const [mappedResources, setMappedResources] = useState([]);
  const [comments, setComments] = useState('cns');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const resourceid = localStorage.getItem("temp_id_for_use");
    if (resourceid) {
      axios
        .get(`http://localhost:8098/api/v1/resource/${resourceid}`)
        .then((res) => {
          const data = res.data;
          setResData(data);
          setResourceName(data.resourceName || "");
          setResourceid(data.id);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setTechnology(data.technology || "");
          setSkill(data.skill || "");
          setEmploymenttype(data.employmentType || "");
          setExperience(data.experience || "");
          setStatus(data.status || "");
          setStartdate(data.startDate?.split("T")[0] || "");
          setEnddate(data.endDate?.split("T")[0] || "");
          setManagerId(data.managerId);
          setPermissionid(data.permissionId);
          setMappedResources(data.assignedResourceIds);
          setComments(data.comments);
        })
        .catch((err) => {
          console.error("Error fetching resource:", err);
        });
    }
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!firstName?.trim()) newErrors.firstName = "First name is required.";
    if (!lastName?.trim()) newErrors.lastName = "Last name is required.";
    if (!email?.trim()) newErrors.email = "Email is required.";
    if (!phone?.trim()) newErrors.phone = "Mobile is required.";
    if (!skill?.trim()) newErrors.skill = "Skills are required.";
    if (!technology?.trim()) newErrors.technology = "Technology is required.";
    if (!employmenttype?.trim()) newErrors.employmentType = "Employment type is required.";
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0) newErrors.experience = "Valid experience is required.";
    if (!file || file.length === 0) newErrors.file = "Resume file is required.";
    if (!comments?.trim()) newErrors.comments = "Comments are required.";
    if (!status) newErrors.status = "Status is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    if (resourceName && firstName && lastName && email && phone && skill && technology && employmenttype && experience && status != "") {
      setError(false);
      const formData = new FormData();
      let finalTechnology = technology;
      if (technology === "OTHER") {
        finalTechnology = `${technology},${customTechnology}`;
      }
      var payload = {
        id: resourceId,
        permissionId: permissionid,
        managerId: managerId,
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
        phone,
        email,
        client: isClient,
        status,
        comments: "cns",
        createdAt: new Date(),
        createdBy: creatorName,
        updatedAt: new Date(),
        updatedBy: creatorName,
      };
      formData.append("payload", JSON.stringify(payload));
      if (file != null || file != undefined) {
        if (file.length > 0) {
          for (let i = 0; i < file.length; i++) {
            formData.append("attachments", file[i]);
          }
        } else {
          formData.append("attachments", file);
        }
      }
      axios
        .put("http://localhost:8098/api/v1/resource/update/upload", formData)
        .then(() => { navigate('/manageresources'); })
        .catch(() => {})
        .finally(() => {});
    }
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

                {/* Resource Name + First Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Resource Name *</label>
                    <input
                      type="text"
                      value={resourceName}
                      onChange={(e) => setResourceName(e.target.value)}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Last Name + Email */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Email *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                  </div>
                </div>

                {/* Phone + Skills (Tag Input) */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Phone *</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                    {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Skill *</label>
                    <SkillTagInput
                      value={skill}
                      onChange={(val) => { setSkill(val); setErrors(prev => ({ ...prev, skill: '' })); }}
                      error={errors.skill}
                    />
                    {errors.skill && <p className="text-red-600 text-sm mt-1">{errors.skill}</p>}
                  </div>
                </div>

                {/* Technology + Employment Type */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Technology *</label>
                    <select
                      value={technology}
                      onChange={(e) => {
                        const value = e.target.value;
                        setTechnology(value);
                        if (value !== 'OTHER') setCustomTechnology('');
                        if (errors.technology) setErrors(prev => ({ ...prev, technology: '' }));
                      }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    >
                      <option value="">{technology}</option>
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
                        className="mt-2 border-2 border-yellow-400 p-2 rounded w-full text-sm"
                      />
                    )}
                    {errors.technology && <p className="text-red-600 text-sm">{errors.technology}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Employment Type *</label>
                    <select
                      value={employmenttype}
                      onChange={(e) => { setEmploymenttype(e.target.value); setErrors(prev => ({ ...prev, employmentType: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    >
                      <option value="">-- Select Type --</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Sweden-FullTime">Sweden-FullTime</option>
                      <option value="India FullTime">India-FullTime</option>
                      <option value="USA-FullTime">USA-FullTime</option>
                    </select>
                    {errors.employmentType && <p className="text-red-600 text-sm">{errors.employmentType}</p>}
                  </div>
                </div>

                {/* Experience + Status */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Experience *</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => { setExperience(e.target.value); setErrors(prev => ({ ...prev, experience: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                    {errors.experience && <p className="text-red-600 text-sm">{errors.experience}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Status *</label>
                    <input
                      type="text"
                      value={status}
                      onChange={(e) => { setStatus(e.target.value); setErrors(prev => ({ ...prev, status: '' })); }}
                      className="border-2 border-yellow-400 p-2 rounded w-full"
                    />
                    {errors.status && <p className="text-red-600 text-sm">{errors.status}</p>}
                  </div>
                </div>

                {/* Attachments */}
                <div>
                  <label className="font-semibold mb-1">Attachments *</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => { setFile(e.target.files); setErrors(prev => ({ ...prev, file: '' })); }}
                    className="border-2 border-yellow-400 p-2 rounded w-full mt-2"
                  />
                  {errors.file && <p className="text-red-600 text-sm">{errors.file}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={() => navigate('/manageresources')}
                    type="button"
                    className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition"
                  >
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