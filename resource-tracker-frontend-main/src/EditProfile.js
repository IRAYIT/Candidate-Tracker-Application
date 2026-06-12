import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Sidebar from "./Sidebar";
import Header from "./Header";

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

const PREDEFINED_TECH_VALUES = [
  "JAVA", "JAVA FULLSTACK", "JAVA FULLSTACK ANGULAR", "JAVA FULLSTACK REACT",
  "JAVA SPRING BOOT", "JAVA MICROSERVICES",
  "DOTNET", "DOTNET FULLSTACK", "DOTNET FULLSTACK ANGULAR", "DOTNET FULLSTACK REACT", "DOTNET CORE",
  "PYTHON", "PYTHON FULLSTACK", "PYTHON FULLSTACK ANGULAR", "PYTHON FULLSTACK REACT",
  "PYTHON DJANGO", "PYTHON FASTAPI", "PYTHON FLASK",
  "NODE FULLSTACK", "NODE FULLSTACK ANGULAR", "NODE FULLSTACK REACT",
  "MERN", "MEAN", "MEVN",
  "ANGULAR", "REACTJS", "VUEJS", "NEXTJS", "NUXTJS", "FRONTEND",
  "ANDROID", "IOS SWIFT", "REACT NATIVE", "FLUTTER",
  "SQL DEVELOPER", "DATA ENGINEER", "DATA SCIENCE", "ML AI", "POWER BI",
  "AWS DEVOPS", "AZURE DEVOPS", "GCP DEVOPS", "DEVOPS", "CLOUD ARCHITECT",
  "TESTING", "AUTOMATION TESTING", "PERFORMANCE TESTING", "API TESTING",
];

function TechnologySelect({ value, onChange, className }) {
  return (
    <select value={value} onChange={onChange} className={className || "border-2 border-yellow-400 p-2 rounded w-full"}>
      <option value="">-- Select Technology --</option>
      <optgroup label="Java Ecosystem">
        <option value="JAVA">Java</option>
        <option value="JAVA FULLSTACK ANGULAR">Java Full Stack + Angular</option>
        <option value="JAVA FULLSTACK REACT">Java Full Stack + React</option>
        <option value="JAVA SPRING BOOT">Java + Spring Boot</option>
        <option value="JAVA MICROSERVICES">Java Microservices</option>
      </optgroup>
      <optgroup label=".NET Ecosystem">
        <option value="DOTNET">ASP.NET</option>
        <option value="DOTNET FULLSTACK ANGULAR">ASP.NET Full Stack + Angular</option>
        <option value="DOTNET FULLSTACK REACT">ASP.NET Full Stack + React</option>
        <option value="DOTNET CORE">ASP.NET Core</option>
      </optgroup>
      <optgroup label="Python Ecosystem">
        <option value="PYTHON">Python</option>
        <option value="PYTHON FULLSTACK ANGULAR">Python Full Stack + Angular</option>
        <option value="PYTHON FULLSTACK REACT">Python Full Stack + React</option>
        <option value="PYTHON DJANGO">Python + Django</option>
        <option value="PYTHON FASTAPI">Python + FastAPI</option>
        <option value="PYTHON FLASK">Python + Flask</option>
      </optgroup>
      <optgroup label="Node.js Ecosystem">
        <option value="NODE FULLSTACK ANGULAR">Node.js Full Stack + Angular</option>
        <option value="NODE FULLSTACK REACT">Node.js Full Stack + React</option>
        <option value="MERN">MERN Stack (MongoDB, Express, React, Node)</option>
        <option value="MEAN">MEAN Stack (MongoDB, Express, Angular, Node)</option>
        <option value="MEVN">MEVN Stack (MongoDB, Express, Vue, Node)</option>
      </optgroup>
      <optgroup label="Frontend">
        <option value="ANGULAR">Angular</option>
        <option value="REACTJS">React.js</option>
        <option value="VUEJS">Vue.js</option>
        <option value="NEXTJS">Next.js</option>
        <option value="NUXTJS">Nuxt.js</option>
      </optgroup>
      <optgroup label="Mobile Development">
        <option value="ANDROID">Android</option>
        <option value="IOS SWIFT">iOS (Swift)</option>
        <option value="REACT NATIVE">React Native</option>
        <option value="FLUTTER">Flutter</option>
      </optgroup>
      <optgroup label="Database &amp; Data Engineering">
        <option value="SQL DEVELOPER">SQL Developer</option>
        <option value="DATA ENGINEER">Data Engineer</option>
        <option value="DATA SCIENCE">Data Science</option>
        <option value="ML AI">Machine Learning / AI</option>
        <option value="POWER BI">Power BI / Tableau</option>
      </optgroup>
      <optgroup label="DevOps &amp; Cloud">
        <option value="AWS DEVOPS">AWS DevOps</option>
        <option value="AZURE DEVOPS">Azure DevOps</option>
        <option value="GCP DEVOPS">GCP DevOps</option>
        <option value="DEVOPS">DevOps (General)</option>
        <option value="CLOUD ARCHITECT">Cloud Architect</option>
      </optgroup>
      <optgroup label="Testing">
        <option value="TESTING">Manual Testing</option>
        <option value="AUTOMATION TESTING">Automation Testing</option>
        <option value="PERFORMANCE TESTING">Performance Testing</option>
        <option value="API TESTING">API Testing</option>
      </optgroup>
      <option value="OTHER">Other (Custom)</option>
    </select>
  );
}

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
    skill => skill.toLowerCase().includes(inputValue.toLowerCase()) && !selectedSkills.includes(skill)
  );
  const showOtherOption =
    inputValue.trim().length > 0 &&
    !SKILL_OPTIONS.some(s => s.toLowerCase() === inputValue.trim().toLowerCase()) &&
    !selectedSkills.includes(inputValue.trim());
  const allOptions = showOtherOption ? [...filteredOptions, '__OTHER__'] : filteredOptions;

  const addSkill = (skill) => {
    if (!selectedSkills.includes(skill)) setSelectedSkills(prev => [...prev, skill]);
    setInputValue('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };
  const removeSkill = (skill) => setSelectedSkills(prev => prev.filter(s => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (highlightedIndex + 1) % allOptions.length;
      setHighlightedIndex(nextIndex);
      document.getElementById(`skill-option-ep-${nextIndex}`)?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (highlightedIndex - 1 + allOptions.length) % allOptions.length;
      setHighlightedIndex(prevIndex);
      document.getElementById(`skill-option-ep-${prevIndex}`)?.scrollIntoView({ block: 'nearest' });
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
          <button type="button" onClick={(e) => { e.stopPropagation(); setShowDropdown(true); setTimeout(() => inputRef.current?.focus(), 0); }}
            className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0">+</button>
        )}
      </div>

      {selectedSkills.length > 0 && showDropdown && (
        <input type="text" value={inputValue} placeholder="Search skills..."
          onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); setHighlightedIndex(-1); }}
          onKeyDown={handleKeyDown} autoFocus
          className="mt-1 w-full border-2 border-yellow-400 rounded p-2 text-sm outline-none" />
      )}

      {showDropdown && allOptions.length > 0 && (
        <ul ref={dropdownRef} className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto mt-1" style={{ maxHeight: '180px' }}>
          {allOptions.map((skill, index) => (
            <li key={skill} id={`skill-option-ep-${index}`}
              onMouseDown={(e) => { e.preventDefault(); addSkill(skill === '__OTHER__' ? inputValue.trim() : skill); setHighlightedIndex(-1); }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                skill === '__OTHER__'
                  ? highlightedIndex === index ? 'bg-yellow-100 text-blue-700 font-semibold border-t border-gray-200' : 'text-blue-600 font-semibold border-t border-gray-200 hover:bg-yellow-50'
                  : highlightedIndex === index ? 'bg-yellow-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-yellow-50'
              }`}>
              {skill === '__OTHER__' ? `+ Add "${inputValue.trim()}" as custom skill` : skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditProfile() {
  const [resourceName, setResourceName]         = useState("");
  const [creatorName]                           = useState(localStorage.getItem("resourceName"));
  const [firstName, setFirstName]               = useState("");
  const [lastName, setLastName]                 = useState("");
  const [email, setEmail]                       = useState("");
  const [phoneDialCode, setPhoneDialCode]       = useState('+91');
  const [phone, setPhone]                       = useState("");
  const [technology, setTechnology]             = useState("");
  const [customTechnology, setCustomTechnology] = useState('');
  const [skill, setSkill]                       = useState("");
  const [employmenttype, setEmploymenttype]     = useState("");
  const [experience, setExperience]             = useState("");
  const [status, setStatus]                     = useState("");
  const [startdate, setStartdate]               = useState("");
  const [enddate, setEnddate]                   = useState("");
  const [loading, setLoading]                   = useState(false);
  const [errors, setErrors]                     = useState({});
  const navigate                                = useNavigate();
  const loggedInRole                            = parseInt(localStorage.getItem("permissionid")); // ✅ NEW
  const [managerId, setManagerId]               = useState('');
  const [permissionid, setPermissionid]         = useState('');
  const [resourceId, setResourceid]             = useState(localStorage.getItem("rid"));
  const [mappedResources, setMappedResources]   = useState([]);
  const [comments, setComments]                 = useState('');
  const [isClient, setIsClient]                 = useState(false);
  const [selectedRole, setSelectedRole]         = useState('');
  const [employeeList, setEmployeeList]         = useState([]);
  const [searchTerm, setSearchTerm]             = useState('');

  useEffect(() => {
    axios.get('http://localhost:8098/api/v1/resource/getAllUnassignedResources')
      .then(res => {
        const onlyEmployees = (res.data || []).filter(emp => emp.permissionId === 4);
        setEmployeeList(onlyEmployees);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const resourceid = localStorage.getItem("employeeid");
    if (resourceid) {
      axios.get(`http://localhost:8098/api/v1/resource/${resourceid}`)
        .then((res) => {
          const data = res.data;
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

          setSkill(data.skill || "");
          setEmploymenttype(data.employmentType || "");
          setExperience(data.experience || "");
          setStatus(data.status || "");
          setStartdate(data.startDate?.split("T")[0] || "");
          setEnddate(data.endDate?.split("T")[0] || "");
          setManagerId(data.managerId);
          setPermissionid(data.permissionId);
          setComments(data.comments || "");
          setIsClient(data.client || false);

          const savedTech = data.technology || "";
          if (savedTech && !PREDEFINED_TECH_VALUES.includes(savedTech)) {
            setTechnology('OTHER');
            setCustomTechnology(savedTech);
          } else {
            setTechnology(savedTech);
          }

          const permissionToRole = { 1: 'Admin', 2: 'HR', 3: 'Manager', 4: 'Employee' };
          setSelectedRole(permissionToRole[data.permissionId] || '');

          if (data.assignedResourceIds?.length) {
            setMappedResources(data.assignedResourceIds.map(id => ({ id })));
          }
        })
        .catch((err) => console.error("Error fetching resource:", err));
    }
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setMappedResources([]);
    setSearchTerm('');
  };

  const handleSelect = (emp) => setMappedResources(prev => [...prev, emp]);
  const handleRemove = (empId) => setMappedResources(prev => prev.filter(e => e.id !== empId));

  const filteredEmployees = employeeList.filter(
    emp =>
      (`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !mappedResources.some(e => e.id === emp.id)
  );

  const validateFields = () => {
    const newErrors = {};
    if (!firstName?.trim())      newErrors.firstName     = "First name is required.";
    if (!lastName?.trim())       newErrors.lastName      = "Last name is required.";
    if (!email?.trim())          newErrors.email         = "Email is required.";
    if (!phone?.trim())          newErrors.phone         = "Mobile is required.";
    if (!skill?.trim())          newErrors.skill         = "Skills are required.";
    if (!technology?.trim())     newErrors.technology    = "Technology is required.";
    if (!employmenttype?.trim()) newErrors.employmentType = "Employment type is required.";
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0)
      newErrors.experience = "Valid experience is required.";
    if (loggedInRole !== 4 && !selectedRole)
      newErrors.selectedRole = "Employment role is required.";
    if (!status)                 newErrors.status        = "Status is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);

    const roleToPermissionId = { Admin: 1, HR: 2, Manager: 3, Employee: 4 };
    let finalTechnology = technology;
    if (technology === "OTHER") finalTechnology = `${technology},${customTechnology}`;

    const formData = new FormData();
    const payload = {
      id: resourceId,
      permissionId: roleToPermissionId[selectedRole] ?? permissionid,
      managerId,
      resourceName,
      firstName,
      lastName,
      linkedin: "",
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
      comments: comments || "",
      assignedResourceIds: selectedRole === 'Manager' ? mappedResources.map(r => r.id) : [],
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
      .catch((error) => console.error("Error updating resource:", error))
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
              Edit Profile
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
                    <label className="font-semibold mb-1 block">Employee Name *</label>
                    <input type="text" value={resourceName} onChange={(e) => setResourceName(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">First Name *</label>
                    <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.firstName && <p className="text-red-600 text-sm">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Row 2: Last Name + Email */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Last Name *</label>
                    <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.lastName && <p className="text-red-600 text-sm">{errors.lastName}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Email *</label>
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                  </div>
                </div>

                {/* Row 3: Phone + Skill */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Phone *</label>
                    <div className={`flex border-2 rounded overflow-hidden ${errors.phone ? 'border-red-500' : 'border-yellow-400'}`}>
                      <select value={phoneDialCode} onChange={(e) => setPhoneDialCode(e.target.value)} className="bg-gray-50 border-r-2 border-yellow-400 px-2 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer">
                        {PHONE_COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>{country.flag} {country.label}</option>
                        ))}
                      </select>
                      <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }} placeholder="Enter phone number" className="flex-1 p-2 text-sm outline-none bg-white" />
                    </div>
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Skill *</label>
                    <SkillTagInput value={skill} onChange={(val) => { setSkill(val); setErrors(prev => ({ ...prev, skill: '' })); }} error={errors.skill} />
                    {errors.skill && <p className="text-red-600 text-sm mt-1">{errors.skill}</p>}
                  </div>
                </div>

                {/* Row 4: Technology + Experience */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Technology *</label>
                    <TechnologySelect
                      value={technology}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTechnology(val);
                        if (val !== 'OTHER') setCustomTechnology('');
                        setErrors(prev => ({ ...prev, technology: '' }));
                      }}
                      className={`border-2 p-2 rounded w-full ${errors.technology ? 'border-red-500' : 'border-yellow-400'}`}
                    />
                    {technology === 'OTHER' && (
                      <input type="text" value={customTechnology}
                        onChange={(e) => setCustomTechnology(e.target.value.toUpperCase())}
                        placeholder="Enter custom technology"
                        className="mt-2 border-2 border-yellow-400 p-2 rounded w-full text-sm" />
                    )}
                    {errors.technology && <p className="text-red-600 text-sm">{errors.technology}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Experience *</label>
                    <input type="text" value={experience} onChange={(e) => { setExperience(e.target.value); setErrors(prev => ({ ...prev, experience: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                    {errors.experience && <p className="text-red-600 text-sm">{errors.experience}</p>}
                  </div>
                </div>

                {/* Row 5: Employment Type + Employment Role */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Employment Type *</label>
                    <select value={employmenttype} onChange={(e) => { setEmploymenttype(e.target.value); setErrors(prev => ({ ...prev, employmentType: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full">
                      <option value="">-- Select Type --</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Internship">Internship</option>
                      <option value="Sweden-FullTime">Sweden-FullTime</option>
                      <option value="India-FullTime">India-FullTime</option>
                    </select>
                    {errors.employmentType && <p className="text-red-600 text-sm">{errors.employmentType}</p>}
                  </div>

                  {/* ✅ Employment Role — read-only for role 4, editable for others */}
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Employment Role {loggedInRole !== 4 && '*'}</label>
                    {loggedInRole === 4 ? (
                      <div className="border-2 border-yellow-400 p-2 rounded w-full bg-gray-50 text-gray-700 min-h-[42px] flex items-center">
                        {selectedRole || <span className="text-gray-400">—</span>}
                      </div>
                    ) : (
                      <select
                        value={selectedRole}
                        onChange={(e) => { handleRoleChange(e.target.value); setErrors(prev => ({ ...prev, selectedRole: '' })); }}
                        className="border-2 border-yellow-400 p-2 rounded w-full"
                      >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                      </select>
                    )}
                    {errors.selectedRole && loggedInRole !== 4 && (
                      <p className="text-red-600 text-sm mt-1">{errors.selectedRole}</p>
                    )}
                  </div>
                </div>

                {/* Manager Mapping — only for non-role-4 managers */}
                {selectedRole === 'Manager' && loggedInRole !== 4 && (
                  <div className="mt-2">
                    <label className="font-semibold mb-1 block">Map Resource</label>
                    <div className="w-64">
                      <input type="text" placeholder="Type to search..." value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-yellow-400 p-2 rounded w-full text-sm mt-2" />
                      {filteredEmployees.length > 0 && (
                        <div className="mt-2 border rounded-lg p-2 bg-white shadow-md max-h-40 overflow-y-auto">
                          {filteredEmployees.map((emp, idx) => (
                            <div key={idx} onClick={() => handleSelect(emp)}
                              className="cursor-pointer px-3 py-2 rounded-md hover:bg-yellow-100 transition-all text-sm text-gray-800">
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
                              {emp.firstName
                                ? `${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`
                                : `Resource ID: ${emp.id}`}
                              <button type="button" onClick={() => handleRemove(emp.id)} className="text-red-600 ml-2 text-sm cursor-pointer">✕</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="font-semibold mb-1 block">Status *</label>
                  <input type="text" value={status} onChange={(e) => { setStatus(e.target.value); setErrors(prev => ({ ...prev, status: '' })); }} className="border-2 border-yellow-400 p-2 rounded w-full" />
                  {errors.status && <p className="text-red-600 text-sm">{errors.status}</p>}
                </div>

                {/* Comments */}
                <div>
                  <label className="font-semibold mb-1 block">Comments</label>
                  <textarea value={comments} onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter comments" rows={3}
                    className="border-2 border-yellow-400 p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-200" />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-center mt-8">
                  <button type="button" onClick={() => navigate('/manageresources')} className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer">Back</button>
                  <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition">Save Changes</button>
                </div>

              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditProfile;