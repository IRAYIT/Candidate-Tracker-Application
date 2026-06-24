import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

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

// ─── Portal Modal Component ───────────────────────────────────────────────────
function Modal({ children }) {
  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(2px)',
      }}
    >
      {children}
    </div>,
    document.body
  );
}

// ─── Duplicate Email Popup ────────────────────────────────────────────────────
function DuplicateEmailPopup({ email, onClose }) {
  return (
    <Modal>
      <div
        style={{ animation: 'fadeInUp 0.2s ease' }}
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm text-center overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-blue-600" />
        <div className="px-8 py-8">
          <p className="text-gray-900 font-bold text-lg mb-3">Email Already Exists</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            The email address{' '}
            <span className="font-semibold text-gray-700">{email}</span>{' '}
            is already registered. Please use a different email address.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition"
          >
            OK, Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Generic Error Popup ──────────────────────────────────────────────────────
function ErrorPopup({ message, onClose }) {
  return (
    <Modal>
      <div
        style={{ animation: 'fadeInUp 0.2s ease' }}
        className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm text-center overflow-hidden"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-600" />
        <div className="px-8 py-8">
          <div className="flex justify-center mb-4">
            <span style={{ fontSize: '2.5rem' }}>⚠️</span>
          </div>
          <p className="text-gray-900 font-bold text-lg mb-3">Save Failed</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 whitespace-pre-line">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition"
          >
            OK, Got it
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── SkillTagInput Component ──────────────────────────────────────────────────
function SkillTagInput({ value, onChange, error }) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const initialized = useRef(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!initialized.current && value) {
      const arr = value.split(',').map(s => s.trim()).filter(Boolean);
      setSelectedSkills(arr);
      initialized.current = true;
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
          <span key={skill}
            className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
            {skill}
            <button type="button"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
              className="text-gray-400 hover:text-red-500 font-bold leading-none cursor-pointer ml-1">
              ×
            </button>
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
          style={{
            width: selectedSkills.length === 0 ? '100%' : '0px',
            minWidth: selectedSkills.length === 0 ? '150px' : '0px',
          }}
        />
        {selectedSkills.length > 0 && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); setShowDropdown(true); setTimeout(() => inputRef.current?.focus(), 0); }}
            className="w-6 h-6 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-base flex items-center justify-center cursor-pointer flex-shrink-0">
            +
          </button>
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
          className="mt-1 w-full border-2 border-yellow-400 rounded p-2 text-sm outline-none focus:ring-2 focus:ring-yellow-200"
        />
      )}

      {showDropdown && allOptions.length > 0 && (
        <ul ref={dropdownRef}
          className="absolute z-50 w-full bg-white border border-gray-200 rounded shadow-lg overflow-y-auto mt-1"
          style={{ maxHeight: '180px' }}>
          {allOptions.map((skill, index) => (
            <li key={skill} id={`skill-option-${index}`}
              onMouseDown={(e) => { e.preventDefault(); addSkill(skill === '__OTHER__' ? inputValue.trim() : skill); setHighlightedIndex(-1); }}
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
              }`}>
              {skill === '__OTHER__' ? `+ Add "${inputValue.trim()}" as custom skill` : skill}
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
  const [customTechnology, setCustomTechnology] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [linkedIn, setLinkedIn] = useState('');
  const [name, setName] = useState('');
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneDialCode, setPhoneDialCode] = useState('+91');
  const [technology, setTechnology] = useState('');
  const [skill, setSkill] = useState('');
  const [employmentType, setEmploymentType] = useState('Freelancing');
  const [experience, setExperience] = useState('');
  const [file, setFile] = useState([]);
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [errors, setErrors] = useState({});
  const [experiencePopup, setexperiencePopup] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [mappedResources, setMappedResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionid, setPermissionId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  // ── Popup states ─────────────────────────────────────────────────────────
  const [showDuplicateEmailPopup, setShowDuplicateEmailPopup] = useState(false);
  const [duplicateEmail, setDuplicateEmail] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.netapi/v1/resource/getAllUnassignedResources')
      .then(res => {
        const onlyEmployees = (res.data || []).filter(emp => emp.permissionId === 4);
        setEmployeeList(onlyEmployees);
      })
      .catch(() => {});
    setPermissionId(localStorage.getItem('permissionid'));
    setEmployeeId(localStorage.getItem('employeeid'));
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setMappedResources([]);
    setSearchTerm('');
  };

  const handleSelect = (emp) => {
    setMappedResources(prev => [...prev, emp]);
  };

  const handleRemove = (empId) => {
    setMappedResources(prev => prev.filter(e => e.id !== empId));
  };

  const filteredEmployees = employeeList.filter(
    emp =>
      (`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      !mappedResources.some(e => e.id === emp.id)
  );

  const validateFields = () => {
    const newErrors = {};
    if (!firstName?.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName?.trim()) newErrors.lastName = 'Last name is required.';
    if (!email?.trim()) newErrors.email = 'Email is required.';
    if (!phone?.trim()) {
      newErrors.phone = 'Mobile is required.';
    } else if (!/^\d{7,15}$/.test(phone.trim())) {
      newErrors.phone = 'Mobile must be between 7 and 15 digits.';
    }
    if (!skill?.trim()) newErrors.skill = 'Skills are required.';
    if (!technology?.trim()) newErrors.technology = 'Technology is required.';
    if (!employmentType?.trim()) newErrors.employmentType = 'Employment type is required.';
    if (!experience?.toString().trim() || isNaN(experience) || experience < 0)
      newErrors.experience = 'Valid experience is required.';
    if (!file || file.length === 0) newErrors.file = 'Resume file is required.';
    if (!status) newErrors.status = 'Status is required.';
    return newErrors;
  };

  const checkEmail = () => {
    if (!email?.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required.' }));
      return;
    }
    axios.get(`https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.netapi/v1/resource/emailCheck/${email}`)
      .then(res => {
        if (res.status === 200) {
          setErrors(prev => ({
            ...prev,
            email: res.data === 'Email Available' ? '' : res.data,
          }));
        }
      })
      .catch(() => {
        setErrors(prev => ({ ...prev, email: 'Error checking email.' }));
      });
  };

  const save = () => {
    const newErrors = validateFields();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (Number(experience) < 0) {
      setexperiencePopup(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    if (file.length > 0) {
      for (let i = 0; i < file.length; i++) {
        formData.append('attachments', file[i]);
      }
    } else {
      formData.append('attachments', file);
    }

    const roleToPermissionId = { Admin: 1, HR: 2, Manager: 3, Employee: 4 };
    const basedonrole = roleToPermissionId[selectedRole] ?? null;

    let finalTechnology = technology;
    if (technology === 'OTHER') {
      finalTechnology = `${technology},${customTechnology}`;
    }

    let payload = {
      permissionId: basedonrole,
      managerId: null,
      resourceName: `${firstName}_${lastName}`, // backend will auto-suffix if duplicate
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
      employmentType,
      phone: `${phoneDialCode} ${phone}`,
      manager: null,
      permission: null,
      resourceAttachments: null,
      email,
      projects: [],
      status,
      createdAt: new Date(),
      createdBy: 'parasuram',
      updatedAt: new Date(),
      updatedBy: 'parasuram',
      client: isClient,
      resourceType: '',
    };

    if (permissionid === '2' && selectedRole === 'Employee') {
      payload.managerId = employeeId;
    }
    if (selectedRole === 'Manager') {
      payload = {
        ...payload,
        assignedResourceIds: mappedResources.map(r => r.id),
      };
    }

    formData.append('payload', JSON.stringify(payload));

    axios.post('https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.netapi/v1/resource/upload', formData)
      .then(() => { navigate('/manageresources'); })
      .catch((err) => {
        const data = err.response?.data;
        const httpStatus = err.response?.status;

        const details = Array.isArray(data?.details) ? data.details : [];
        const detailsText = details.join(' ').toLowerCase();
        const errorMsgText = (
          typeof data === 'string' ? data : (data?.errorMessage ?? '')
        ).toLowerCase();
        const combined = `${detailsText} ${errorMsgText}`;

        const isEmailDuplicate =
          httpStatus === 409 ||
          combined.includes('email already exists') ||
          (combined.includes('email') && combined.includes('exist')) ||
          combined.includes('duplicate');

        if (isEmailDuplicate) {
          setDuplicateEmail(email);
          setShowDuplicateEmailPopup(true);
        } else {
          const displayMsg =
            details.length > 0
              ? details.join('\n')
              : typeof data === 'string'
                ? data
                : data?.errorMessage || err.message || 'Something went wrong. Please try again.';
          setErrorMessage(displayMsg);
          setShowErrorPopup(true);
        }
      })
      .finally(() => { setLoading(false); });
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ar-field {
          border: 2px solid #FACC15 !important;
          border-radius: 4px;
          padding: 8px 12px;
          width: 100%;
          font-size: 14px;
          box-sizing: border-box;
          background: #fff;
        }
        .ar-field:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(250,204,21,0.35);
        }
        .ar-field.ar-error {
          border-color: #ef4444 !important;
        }
        .ar-phone-wrap {
          display: flex;
          border: 2px solid #FACC15;
          border-radius: 4px;
          overflow: hidden;
        }
        .ar-phone-wrap.ar-error {
          border-color: #ef4444 !important;
        }
        .ar-phone-wrap select {
          background: #f9fafb;
          border-right: 2px solid #FACC15;
          padding: 8px;
          font-size: 14px;
          outline: none;
          cursor: pointer;
        }
        .ar-phone-wrap input {
          flex: 1;
          padding: 8px 12px;
          font-size: 14px;
          border: none;
          outline: none;
          background: #fff;
        }
        .ar-skill-wrap {
          border: 2px solid #FACC15 !important;
          border-radius: 4px;
        }
        .ar-skill-wrap.ar-error {
          border-color: #ef4444 !important;
        }
      `}</style>

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
                Add User
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
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' })); }}
                        placeholder="Enter first name"
                        className={`ar-field${errors.firstName ? ' ar-error' : ''}`}
                      />
                      {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold mb-1 block">Last Name <span className="text-pink-800">*</span></label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' })); }}
                        placeholder="Enter last name"
                        className={`ar-field${errors.lastName ? ' ar-error' : ''}`}
                      />
                      {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="flex flex-wrap gap-4 justify-between">
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold mb-1 block">Email <span className="text-pink-800">*</span></label>
                      <input
                        type="email"
                        value={email}
                        onBlur={checkEmail}
                        onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                        placeholder="Enter email"
                        className={`ar-field${errors.email ? ' ar-error' : ''}`}
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold mb-1 block">Phone Number <span className="text-pink-800">*</span></label>
                      <div className={`ar-phone-wrap${errors.phone ? ' ar-error' : ''}`}>
                        <select
                          value={phoneDialCode}
                          onChange={(e) => setPhoneDialCode(e.target.value)}
                        >
                          {PHONE_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(prev => ({ ...prev, phone: '' })); }}
                          placeholder="9876543210"
                        />
                      </div>
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Skills + Experience */}
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
                        value={experience}
                        onChange={(e) => { setExperience(e.target.value); if (errors.experience) setErrors(prev => ({ ...prev, experience: '' })); }}
                        placeholder="Enter experience"
                        className={`ar-field${errors.experience ? ' ar-error' : ''}`}
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
                        onChange={(e) => {
                          const value = e.target.value;
                          setTechnology(value);
                          if (value !== 'OTHER') setCustomTechnology('');
                          if (errors.technology) setErrors(prev => ({ ...prev, technology: '' }));
                        }}
                        className={`ar-field${errors.technology ? ' ar-error' : ''}`}
                      >
                        <option value="">-- Select Technology --</option>
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
                        <option value="OTHER">Other (Custom)</option>
                      </select>
                      {technology === 'OTHER' && (
                        <input
                          type="text"
                          value={customTechnology}
                          onChange={(e) => setCustomTechnology(e.target.value.toUpperCase())}
                          placeholder="Enter custom technology"
                          className="ar-field mt-2"
                        />
                      )}
                      {errors.technology && <p className="text-red-600 text-sm mt-1">{errors.technology}</p>}
                    </div>

                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold mb-1 block">Employment Type <span className="text-pink-800">*</span></label>
                      <select
                        value={employmentType}
                        onChange={(e) => { setEmploymentType(e.target.value); if (errors.employmentType) setErrors(prev => ({ ...prev, employmentType: '' })); }}
                        className={`ar-field${errors.employmentType ? ' ar-error' : ''}`}
                      >
                        <option value="">-- Select Type --</option>
                        <option value="Freelancing">Freelancing</option>
                        <option value="Consultant">Consultant</option>
                        <option value="Sweden-FullTime">Sweden-FullTime</option>
                        <option value="India-FullTime">India-FullTime</option>
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
                      className="ar-field"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="HR">HR</option>
                      {/* <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option> */}
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
                          className="ar-field mt-2"
                        />
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
                                {`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`}
                                <button onClick={() => handleRemove(emp.id)} className="text-red-600 ml-2 text-sm">✕</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Resume Upload */}
                  <div>
                    <label className="font-semibold mb-1 block">Upload Resume <span className="text-pink-800">*</span></label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => { setFile(e.target.files); if (errors.file) setErrors(prev => ({ ...prev, file: '' })); }}
                      className={`ar-field mt-2${errors.file ? ' ar-error' : ''}`}
                    />
                    {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="font-semibold mb-1 block">Comments</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Enter comments (optional)"
                      rows={3}
                      className="ar-field"
                    />
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

      {/* ── Portaled Popups ── */}
      {showDuplicateEmailPopup && (
        <DuplicateEmailPopup
          email={duplicateEmail}
          onClose={() => setShowDuplicateEmailPopup(false)}
        />
      )}

      {showErrorPopup && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      )}
    </>
  );
}

export default Addresource;