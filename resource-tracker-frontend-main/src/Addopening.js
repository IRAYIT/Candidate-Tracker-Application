import Header from "./Header";
import Sidebar from "./Sidebar";
import { useEffect, useState, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

// ─── SkillTagInput ────────────────────────────────────────────────────────────
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

// ─── ShareUrlPopup ────────────────────────────────────────────────────────────
function ShareUrlPopup({ publicUrl, onClose, onGoToOpenings }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '16px',
        padding: '32px', maxWidth: '480px', width: '90%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#dcfce7', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '28px'
          }}>
            ✅
          </div>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          Opening Created Successfully!
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.85rem', marginBottom: '24px' }}>
          Share this link with candidates on LinkedIn, Naukri, Indeed, or any platform.
        </p>
        <div style={{
          background: '#f9fafb', border: '2px solid #facc15', borderRadius: '8px',
          padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'
        }}>
          <span style={{ fontSize: '0.82rem', color: '#374151', flex: 1, wordBreak: 'break-all' }}>
            {publicUrl}
          </span>
          <button onClick={handleCopy} style={{
            padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem',
            fontWeight: '600', cursor: 'pointer', border: 'none', flexShrink: 0,
            backgroundColor: copied ? '#22c55e' : '#facc15',
            color: copied ? 'white' : '#111827'
          }}>
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '24px' }}>
          📋 Copy the link and post it on LinkedIn, Naukri, Indeed, WhatsApp, or email.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={onGoToOpenings} style={{
            padding: '10px 24px', backgroundColor: '#2563eb', color: 'white',
            borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem',
            border: 'none', cursor: 'pointer'
          }}>
            Go to Openings
          </button>
          <button onClick={onClose} style={{
            padding: '10px 24px', backgroundColor: 'white', color: '#374151',
            borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem',
            border: '2px solid #d1d5db', cursor: 'pointer'
          }}>
            Add Another
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Addopening Component ────────────────────────────────────────────────
function Addopening() {
  const [openingname, setOpeningname]       = useState('');
  const [hours, setHours]                   = useState('');
  const [shifttimings, setShifttimings]     = useState('');
  const [payment, setPayment]               = useState('');
  const [paymenttype, setPaymenttype]       = useState('');
  const [technology, setTechnology]         = useState('');
  const [experience, setExperience]         = useState('');
  const [employmenttype, setEmploymenttype] = useState('Freelancing');
  const [skills, setSkills]                 = useState('');
  const [location, setLocation]             = useState('');
  const [status, setStatus]                 = useState('');
  const [description, setDescription]       = useState('');
  const [creatorId]                         = useState(Number(localStorage.getItem("employeeid")));
  const [startdate, setStartdate]           = useState(new Date());
  const [enddate, setEnddate]               = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d;
  });
  const [customTech, setCustomTech]         = useState('');
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [createdPublicUrl, setCreatedPublicUrl] = useState('');
  const [currency, setCurrency]             = useState('INR');

  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (!openingname?.trim())    newErrors.openingname    = "Opening name is required.";
    if (!hours?.trim())          newErrors.hours          = "Hours are required.";
    if (!shifttimings?.trim())   newErrors.shifttimings   = "Shift timings are required.";
    if (!payment?.trim())        newErrors.payment        = "Payment is required.";
    if (!paymenttype?.trim())    newErrors.paymenttype    = "Payment type is required.";
    if (!technology?.trim())     newErrors.technology     = "Technology is required.";
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0)
                                 newErrors.experience     = "Valid experience is required.";
    if (!employmenttype?.trim()) newErrors.employmenttype = "Employment type is required.";
    if (!skills?.trim())         newErrors.skills         = "Skills are required.";
    if (!location?.trim())       newErrors.location       = "Location is required.";
    if (!status?.trim())         newErrors.status         = "Status is required.";
    if (!startdate)              newErrors.startdate      = "Start date is required.";
    if (!enddate)                newErrors.enddate        = "End date is required.";
    return newErrors;
  };

  const resetForm = () => {
    setOpeningname(''); setHours(''); setShifttimings(''); setPayment('');
    setPaymenttype(''); setTechnology(''); setExperience('');
    setEmploymenttype('Freelancing'); setSkills(''); setLocation('');
    setStatus(''); setDescription(''); setCustomTech('');
    setCurrency('INR');
    setStartdate(new Date());
    const d = new Date(); d.setFullYear(d.getFullYear() + 1);
    setEnddate(d);
    setErrors({});
  };

  const createopening = () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    const payload = {
      name:           openingname,
      hours:          hours,
      payment:        `${payment} ${currency}`,
      paymentType:    paymenttype,
      shiftTimings:   shifttimings,
      startDate:      startdate,
      endDate:        enddate,
      skill:          skills,
      location:       location,
      technology:     technology === 'Other' ? customTech : technology,
      experience:     experience,
      employmentType: employmenttype,
      status:         status,
      description:    description,
      createdAt:      new Date(),
      createdBy:      creatorId,
      updatedAt:      new Date(),
      updatedBy:      creatorId,
    };

    axios.post("http://localhost:8098/api/v1/openings", payload)
      .then((response) => {
        const publicUrlKey = response.data?.publicUrlKey;
        const publicUrl    = `http://localhost:3000/apply/${publicUrlKey}`;
        setCreatedPublicUrl(publicUrl);
        setShowSharePopup(true);
      })
      .catch((error) => {
        if (
          error?.response?.data?.errorMessage?.includes('Mail') ||
          error?.response?.data?.details?.toString().includes('Failed to send email')
        ) {
          axios.get("http://localhost:8098/api/v1/openings")
            .then((res) => {
              const latest = res.data[res.data.length - 1];
              if (latest?.publicUrlKey) {
                const publicUrl = `http://localhost:3000/apply/${latest.publicUrlKey}`;
                setCreatedPublicUrl(publicUrl);
                setShowSharePopup(true);
              }
            })
            .catch(() => {
              setErrors({ general: "Opening created but could not retrieve the link. Please check Current Openings." });
            });
        } else {
          setErrors({ general: "Failed to create opening. Please try again." });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Popup ── */}
      {showSharePopup && (
        <ShareUrlPopup
          publicUrl={createdPublicUrl}
          onClose={() => { setShowSharePopup(false); resetForm(); }}
          onGoToOpenings={() => navigate('/current_openings')}
        />
      )}

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
              Add Opening
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <ClipLoader size={60} color="#FACC15" />
              </div>
            ) : (
              <div className="space-y-6">

                {errors.general && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded">
                    {errors.general}
                  </div>
                )}

                {/* Opening Name + Hours */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Opening Name <span className="text-pink-800">*</span></label>
                    <input type="text" value={openingname} placeholder="Enter name"
                      onChange={(e) => { setOpeningname(e.target.value); if (errors.openingname) setErrors(prev => ({ ...prev, openingname: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.openingname ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.openingname && <p className="text-red-600 text-sm mt-1">{errors.openingname}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Hours <span className="text-pink-800">*</span></label>
                    <input type="text" value={hours} placeholder="Enter hours"
                      onChange={(e) => { setHours(e.target.value); if (errors.hours) setErrors(prev => ({ ...prev, hours: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.hours ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.hours && <p className="text-red-600 text-sm mt-1">{errors.hours}</p>}
                  </div>
                </div>

                {/* Shift Timings + Payment */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Shift Timings <span className="text-pink-800">*</span></label>
                    <input type="text" value={shifttimings} placeholder="Enter timings"
                      onChange={(e) => { setShifttimings(e.target.value); if (errors.shifttimings) setErrors(prev => ({ ...prev, shifttimings: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.shifttimings ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.shifttimings && <p className="text-red-600 text-sm mt-1">{errors.shifttimings}</p>}
                  </div>

                  {/* ── Payment Field ── */}
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Payment <span className="text-pink-800">*</span></label>
                    <div className={`flex items-center border-2 rounded ${errors.payment ? 'border-red-500' : 'border-yellow-400'}`}>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="border-none outline-none bg-yellow-50 text-sm font-medium px-2 py-2 cursor-pointer"
                        style={{ borderRight: '2px solid #facc15' }}
                      >
                        <option value="INR">₹ INR</option>
                        <option value="SEK">kr SEK</option>
                        <option value="USD">$ USD</option>
                      </select>
                      <input
                        type="text"
                        value={payment}
                        placeholder="Amount"
onChange={(e) => {
  const val = e.target.value;
  if (/^[a-zA-Z0-9]*$/.test(val)) {
    setPayment(val);
    if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }));
  }
}}
                        className="flex-1 border-none outline-none bg-white text-sm px-2 py-2"
                        style={{ boxShadow: 'none' }}
                      />
                    </div>
                    {errors.payment && <p className="text-red-600 text-sm mt-1">{errors.payment}</p>}
                  </div>
                </div>

                {/* Payment Type + Technology */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Payment Type <span className="text-pink-800">*</span></label>
                    <input type="text" value={paymenttype} placeholder="Enter type"
                      onChange={(e) => { setPaymenttype(e.target.value); if (errors.paymenttype) setErrors(prev => ({ ...prev, paymenttype: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.paymenttype ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.paymenttype && <p className="text-red-600 text-sm mt-1">{errors.paymenttype}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Technology <span className="text-pink-800">*</span></label>
                    <select value={technology}
                      onChange={(e) => { setTechnology(e.target.value); if (errors.technology) setErrors(prev => ({ ...prev, technology: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.technology ? 'border-red-500' : 'border-yellow-400'}`}>
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
                    {errors.technology && <p className="text-red-600 text-sm mt-1">{errors.technology}</p>}
                    {technology === 'Other' && (
                      <div className="p-2">
                        <input type="text" className="border-2 border-yellow-400 p-2 rounded w-full"
                          placeholder="Enter custom technology" value={customTech}
                          onChange={(e) => setCustomTech(e.target.value)} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience + Employment Type */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Experience <span className="text-pink-800">*</span></label>
                    <input type="text" value={experience} placeholder="Enter experience"
                      onChange={(e) => { setExperience(e.target.value); if (errors.experience) setErrors(prev => ({ ...prev, experience: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.experience ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Employment Type <span className="text-pink-800">*</span></label>
                    <select value={employmenttype}
                      onChange={(e) => { setEmploymenttype(e.target.value); if (errors.employmenttype) setErrors(prev => ({ ...prev, employmenttype: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.employmenttype ? 'border-red-500' : 'border-yellow-400'}`}>
                      <option value="">Select Employment Type</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Sweden-FullTime">Sweden-FullTime</option>
                      <option value="India-FullTime">India-FullTime</option>
                      <option value="USA-FullTime">USA-FullTime</option>
                    </select>
                    {errors.employmenttype && <p className="text-red-600 text-sm mt-1">{errors.employmenttype}</p>}
                  </div>
                </div>

                {/* Skills + Location */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Skills <span className="text-pink-800">*</span></label>
                    <SkillTagInput value={skills}
                      onChange={(val) => { setSkills(val); if (errors.skills) setErrors(prev => ({ ...prev, skills: '' })); }}
                      error={errors.skills} />
                    {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Location <span className="text-pink-800">*</span></label>
                    <select value={location}
                      onChange={(e) => { setLocation(e.target.value); if (errors.location) setErrors(prev => ({ ...prev, location: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.location ? 'border-red-500' : 'border-yellow-400'}`}>
                      <option value="">Select Location</option>
                      <option value="India">India</option>
                      <option value="Sweden">Sweden</option>
                      <option value="USA">USA</option>
                    </select>
                    {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                  </div>
                </div>

                {/* Status */}
                <div className="w-full">
                  <label className="font-semibold mb-1">Status <span className="text-pink-800">*</span></label>
                  <select value={status}
                    onChange={(e) => { setStatus(e.target.value); if (errors.status) setErrors(prev => ({ ...prev, status: '' })); }}
                    className={`border-2 p-2 rounded w-full ${errors.status ? 'border-red-500' : 'border-yellow-400'}`}>
                    <option value="">Select Status</option>
                    <option value="Open">OPEN</option>
                    <option value="Close">CLOSE</option>
                  </select>
                  {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
                </div>

                {/* Start Date + End Date */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">Start Date <span className="text-pink-800">*</span></label>
                    <input type="date" value={startdate.toISOString().split('T')[0]}
                      onChange={(e) => { setStartdate(new Date(e.target.value)); if (errors.startdate) setErrors(prev => ({ ...prev, startdate: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.startdate ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.startdate && <p className="text-red-600 text-sm mt-1">{errors.startdate}</p>}
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold mb-1">End Date <span className="text-pink-800">*</span></label>
                    <input type="date" value={enddate.toISOString().split('T')[0]}
                      onChange={(e) => { setEnddate(new Date(e.target.value)); if (errors.enddate) setErrors(prev => ({ ...prev, enddate: '' })); }}
                      className={`border-2 p-2 rounded w-full ${errors.enddate ? 'border-red-500' : 'border-yellow-400'}`} />
                    {errors.enddate && <p className="text-red-600 text-sm mt-1">{errors.enddate}</p>}
                  </div>
                </div>

                {/* Description */}
                <div className="w-full">
                  <label className="font-semibold mb-1">Description</label>
                  <textarea
                    value={description}
                    placeholder="Describe the job role, responsibilities, requirements..."
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="border-2 border-yellow-400 p-2 rounded w-full resize-y text-sm"
                  />
                </div>

              </div>
            )}

            <div className="flex gap-4 p-4 items-center justify-center mt-8">
              <button onClick={() => navigate('/current_openings')}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
                Back
              </button>
              <button onClick={createopening}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
                Create
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Addopening;