import Header from "../Header";
import Sidebar from "../Sidebar";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";

// ─── Skill Options ────────────────────────────────────────────────────────────
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

// ─── SkillTagInput ────────────────────────────────────────────────────────────
function SkillTagInput({ value, onChange, error }) {
  const [inputValue, setInputValue]         = useState('');
  const [showDropdown, setShowDropdown]     = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef    = useRef(null);
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
        if (selected === '__OTHER__') addSkill(inputValue.trim());
        else addSkill(selected);
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
        className={`border-2 rounded p-2 flex flex-wrap items-center gap-2 cursor-text min-h-[42px] ${error ? 'border-red-500' : 'border-yellow-400'}`}
        onClick={() => { setShowDropdown(true); inputRef.current?.focus(); }}
      >
        {selectedSkills.map(skill => (
          <span key={skill} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
            {skill}
            <button type="button" onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
              className="text-gray-400 hover:text-red-500 font-bold leading-none cursor-pointer ml-1">×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={selectedSkills.length === 0 ? "Search and add skills..." : ""}
          onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); setHighlightedIndex(-1); }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="outline-none text-sm bg-transparent border-none focus:ring-0 focus:outline-none"
          style={{ width: selectedSkills.length === 0 ? '100%' : '0px', minWidth: selectedSkills.length === 0 ? '150px' : '0px' }}
        />
        {selectedSkills.length > 0 && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); setShowDropdown(true); setTimeout(() => inputRef.current?.focus(), 0); }}
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
            <li key={skill} id={`skill-option-${index}`}
              onMouseDown={(e) => { e.preventDefault(); if (skill === '__OTHER__') addSkill(inputValue.trim()); else addSkill(skill); setHighlightedIndex(-1); }}
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

// ─── Main Edit_opening Component ──────────────────────────────────────────────
function Edit_opening() {
  const [openingname, setOpeningname]       = useState('');
  const [hours, setHours]                   = useState('');
  const [shifttimings, setShifttimings]     = useState('');
  const [payment, setPayment]               = useState('');
  const [currency, setCurrency]             = useState('INR');
  const [paymenttype, setPaymenttype]       = useState('');
  const [technology, setTechnology]         = useState('');
  const [experience, setExperience]         = useState('');
  const [employmenttype, setEmploymenttype] = useState('');
  const [skills, setSkills]                 = useState('');
  const [status, setStatus]                 = useState('');
  const [location, setLocation]             = useState('');
  const [description, setDescription]       = useState('');
  const [customTech, setCustomTech]         = useState('');
  const [openingId, setOpeningId]           = useState('');
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);
  const [publicUrlKey, setPublicUrlKey]     = useState('');
  const [creatorId]                         = useState(Number(localStorage.getItem("employeeid")));

  const navigate = useNavigate();

  const parsePayment = (raw) => {
    if (!raw) return { amount: '', curr: 'INR' };
    const parts = raw.trim().split(' ');
    const knownCurrencies = ['INR', 'SEK', 'USD'];
    if (parts.length >= 2 && knownCurrencies.includes(parts[parts.length - 1])) {
      return { amount: parts.slice(0, parts.length - 1).join(' '), curr: parts[parts.length - 1] };
    }
    return { amount: raw, curr: 'INR' };
  };

  useEffect(() => {
    const openingid = localStorage.getItem("opening_id");
    axios
      .get(`http://localhost:8098/api/v1/openings/${openingid}`)
      .then((res) => {
        setOpeningId(openingid);
        setOpeningname(res.data.name);
        setHours(res.data.hours);
        setShifttimings(res.data.shiftTimings);

        const { amount, curr } = parsePayment(res.data.payment);
        setPayment(amount);
        setCurrency(curr);

        setPaymenttype(res.data.paymentType);
        setDescription(res.data.description || '');
        setSkills(res.data.skill);
        setEmploymenttype(res.data.employmentType);
        setExperience(res.data.experience);
        setStatus(res.data.status === 'TERMINATED' ? 'TERMINATED' : 'ACTIVE');
        setPublicUrlKey(res.data.publicUrlKey || '');
        setLocation(res.data.location || '');

        if (res.data.technology && !PREDEFINED_TECH_VALUES.includes(res.data.technology)) {
          setTechnology('Other');
          setCustomTech(res.data.technology);
        } else {
          setTechnology(res.data.technology);
        }
      });
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!openingname?.trim())        newErrors.openingname    = "Opening name is required.";
    if (!hours?.toString().trim())   newErrors.hours          = "Hours are required.";
    if (!shifttimings?.trim())       newErrors.shifttimings   = "Shift timings are required.";
    if (!payment?.toString().trim()) newErrors.payment        = "Payment is required.";
    if (!paymenttype?.trim())        newErrors.paymenttype    = "Payment type is required.";
    if (!technology?.trim())         newErrors.technology     = "Technology is required.";
    if (technology === 'Other' && !customTech?.trim()) newErrors.technology = "Please enter custom technology.";
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0)
      newErrors.experience = "Valid experience is required.";
    if (!employmenttype?.trim())     newErrors.employmenttype = "Employment type is required.";
    if (!skills?.trim())             newErrors.skills         = "Skills are required.";
    if (!location?.trim())           newErrors.location       = "Location is required.";
    if (!status?.trim())             newErrors.status         = "Status is required.";
    return newErrors;
  };

  const editopening = () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    // Dates sent silently — not shown in form
    const startDate = new Date();
    const endDate   = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    const finalTech = technology === 'Other' ? customTech : technology;

    const payload = {
      id: openingId,
      name: openingname,
      hours,
      payment: `${payment} ${currency}`,
      paymentType: paymenttype,
      shiftTimings: shifttimings,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      skill: skills,
      location,
      technology: finalTech,
      experience,
      employmentType: employmenttype,
      status,
      description,
      publicUrlKey,
      createdAt: new Date().toISOString(),
      createdBy: creatorId,
      updatedAt: new Date().toISOString(),
      updatedBy: creatorId,
    };

    axios
      .put("http://localhost:8098/api/v1/openings", payload)
      .then(() => navigate('/current_openings'))
      .catch((err) => { console.error("Edit failed:", err); setLoading(false); });
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

        <main className="flex-1 p-4 bg-white">
          <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
              Edit Opening
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <ClipLoader size={60} color="#FACC15" />
              </div>
            ) : (
              <div className="space-y-6">

                {/* Row 1: Opening Name + Hours */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Opening Name <span className="text-pink-800">*</span></label>
                    <input type="text" value={openingname} placeholder="Enter name"
                      onChange={(e) => { setOpeningname(e.target.value); setErrors(prev => ({ ...prev, openingname: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.openingname ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.openingname && <p className="text-red-600 text-sm">{errors.openingname}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Hours <span className="text-pink-800">*</span></label>
                    <input type="text" value={hours} placeholder="Enter hours"
                      onChange={(e) => { setHours(e.target.value); setErrors(prev => ({ ...prev, hours: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.hours ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.hours && <p className="text-red-600 text-sm">{errors.hours}</p>}
                  </div>
                </div>

                {/* Row 2: Shift Timings + Payment */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Shift Timings <span className="text-pink-800">*</span></label>
                    <input type="text" value={shifttimings} placeholder="Enter timings"
                      onChange={(e) => { setShifttimings(e.target.value); setErrors(prev => ({ ...prev, shifttimings: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.shifttimings ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.shifttimings && <p className="text-red-600 text-sm">{errors.shifttimings}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Payment <span className="text-pink-800">*</span></label>
                    <div className={`flex items-center border-2 rounded ${errors.payment ? 'border-red-500' : 'border-yellow-400'}`}>
                      <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                        className="border-none outline-none bg-yellow-50 text-sm font-medium px-2 py-2 cursor-pointer"
                        style={{ borderRight: '2px solid #facc15' }}>
                        <option value="INR">₹ INR</option>
                        <option value="SEK">kr SEK</option>
                        <option value="USD">$ USD</option>
                      </select>
                      <input type="text" value={payment} placeholder="Amount"
                        onChange={(e) => {
                          const val = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(val)) {
                            setPayment(val);
                            if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }));
                          }
                        }}
                        className="flex-1 border-none outline-none bg-white text-sm px-2 py-2"
                        style={{ boxShadow: 'none' }} />
                    </div>
                    {errors.payment && <p className="text-red-600 text-sm mt-1">{errors.payment}</p>}
                  </div>
                </div>

                {/* Row 3: Payment Type + Technology */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Payment Type <span className="text-pink-800">*</span></label>
                    <input type="text" value={paymenttype} placeholder="Enter type"
                      onChange={(e) => { setPaymenttype(e.target.value); setErrors(prev => ({ ...prev, paymenttype: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.paymenttype ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.paymenttype && <p className="text-red-600 text-sm">{errors.paymenttype}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Technology <span className="text-pink-800">*</span></label>
                    <select
                      value={technology}
                      onChange={(e) => {
                        setTechnology(e.target.value);
                        if (e.target.value !== 'Other') setCustomTech('');
                        setErrors(prev => ({ ...prev, technology: '' }));
                      }}
                      className={`border-2 p-2 rounded w-full ${errors.technology ? 'border-red-500' : 'border-yellow-400'}`}
                    >
                      <option value="">Select technology</option>
                      <optgroup label="Java Ecosystem">
                        <option value="JAVA">Java</option>
                        <option value="JAVA FULLSTACK ANGULAR">Java Full Stack + Angular</option>
                        <option value="JAVA FULLSTACK REACT">Java Full Stack + React</option>
                        <option value="JAVA SPRING BOOT">Java + Spring Boot</option>
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
                        <option value="MERN">MERN Stack</option>
                        <option value="MEAN">MEAN Stack</option>
                        <option value="MEVN">MEVN Stack</option>
                      </optgroup>
                      <optgroup label="Frontend">
                        <option value="ANGULAR">Angular</option>
                        <option value="REACTJS">React.js</option>
                        <option value="VUEJS">Vue.js</option>
                        <option value="NEXTJS">Next.js</option>
                        <option value="NUXTJS">Nuxt.js</option>
                        <option value="FRONTEND">Frontend (HTML / CSS / JS)</option>
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
                      <option value="Other">Other (Custom)</option>
                    </select>
                    {technology === 'Other' && (
                      <input type="text"
                        className="mt-2 border-2 border-yellow-400 p-2 rounded w-full text-sm"
                        placeholder="Enter custom technology"
                        value={customTech}
                        onChange={(e) => setCustomTech(e.target.value)} />
                    )}
                    {errors.technology && <p className="text-red-600 text-sm">{errors.technology}</p>}
                  </div>
                </div>

                {/* Row 4: Experience + Employment Type */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Experience <span className="text-pink-800">*</span></label>
                    <input type="text" value={experience} placeholder="Enter experience"
                      onChange={(e) => { setExperience(e.target.value); setErrors(prev => ({ ...prev, experience: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.experience ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.experience && <p className="text-red-600 text-sm">{errors.experience}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Employment Type <span className="text-pink-800">*</span></label>
                    <select value={employmenttype}
                      onChange={(e) => { setEmploymenttype(e.target.value); setErrors(prev => ({ ...prev, employmenttype: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.employmenttype ? 'border-red-500' : 'border-yellow-400'}`}>
                      <option value="">Select employment type</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Sweden-FullTime">Sweden-FullTime</option>
                      <option value="India-FullTime">India-FullTime</option>
                      <option value="USA-FullTime">USA-FullTime</option>
                    </select>
                    {errors.employmenttype && <p className="text-red-600 text-sm">{errors.employmenttype}</p>}
                  </div>
                </div>

                {/* Row 5: Skills + Location */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Skills <span className="text-pink-800">*</span></label>
                    <SkillTagInput
                      value={skills}
                      onChange={(val) => { setSkills(val); setErrors(prev => ({ ...prev, skills: '' })); }}
                      error={errors.skills}
                    />
                    {errors.skills && <p className="text-red-600 text-sm">{errors.skills}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1 block">Location <span className="text-pink-800">*</span></label>
                    <select value={location}
                      onChange={(e) => { setLocation(e.target.value); setErrors(prev => ({ ...prev, location: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.location ? 'border-red-500' : 'border-yellow-400'}`}>
                      <option value="">Select Location</option>
                      <option value="India">India</option>
                      <option value="Sweden">Sweden</option>
                      <option value="USA">USA</option>
                    </select>
                    {errors.location && <p className="text-red-600 text-sm">{errors.location}</p>}
                  </div>
                </div>

                {/* Row 6: Status (full width) */}
                <div className="w-full">
                  <label className="font-semibold mb-1 block">Status <span className="text-pink-800">*</span></label>
                  <select value={status}
                    onChange={(e) => { setStatus(e.target.value); setErrors(prev => ({ ...prev, status: '' })); }}
                    className={`border-2 p-2 rounded w-full ${errors.status ? 'border-red-500' : 'border-yellow-400'}`}>
                    <option value="">Select status</option>
                    <option value="ACTIVE">OPEN</option>
                    <option value="TERMINATED">CLOSE</option>
                  </select>
                  {errors.status && <p className="text-red-600 text-sm">{errors.status}</p>}
                </div>

                {/* Row 7: Description (full width) */}
                <div className="w-full">
                  <label className="font-semibold mb-1 block">Description</label>
                  <textarea value={description} placeholder="Enter job description"
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="border-2 border-yellow-400 p-2 rounded w-full resize-none" />
                </div>

              </div>
            )}

            <div className="flex gap-4 p-4 items-center justify-center mt-8">
              <button onClick={() => navigate('/current_openings')}
                className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer">
                Back
              </button>
              <button onClick={editopening}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition cursor-pointer">
                Save
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Edit_opening;