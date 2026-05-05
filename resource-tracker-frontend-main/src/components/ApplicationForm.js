import React, { useState, useRef, useEffect } from 'react';
import { submitApplication } from '../api/jobApi';
import './ApplicationForm.css';

const INITIAL_STATE = {
  firstName: '', lastName: '', email: '', phone: '',
  location: '', experience: '',currentSalary: '', expectedSalary: '',
  languagesKnown: '', noticePeriod: '', visaStatus: '',
  applicationStatus: 'APPLIED', employmentType: '', source: '',
  phoneDialCode: '+91',
  expectedSalaryCurrency: '₹',currentSalaryCurrency: '₹',
};

const PHONE_COUNTRIES = [
  { code: '+91', flag: '🇮🇳', label: '+91' },
  { code: '+46', flag: '🇸🇪', label: '+46' },
  { code: '+1',  flag: '🇺🇸', label: '+1'  },
];

const CURRENCIES = [
  { symbol: '₹', label: '₹ INR' },
  { symbol: 'kr', label: 'kr SEK' },
  { symbol: '$',  label: '$ USD'  },
];

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
  "Selenium", "TestNG", "Cypress", "Playwright", "Jest",
  "Postman", "Swagger", "JMeter", "LoadRunner", "Appium",
  "Manual Testing", "Automation Testing", "Performance Testing", "API Testing", "UAT",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "Scikit-learn", "Pandas", "NumPy", "Power BI", "Tableau",
  "Data Analysis", "Data Science", "Big Data", "Apache Spark",
  "Hadoop", "Hive", "Airflow", "dbt",
  "Git", "GitHub", "GitLab", "Bitbucket", "JIRA", "Confluence",
  "Agile", "Scrum", "Kanban", "GraphQL", "gRPC",
  "WebSockets", "OAuth", "JWT", "Design Patterns", "System Design",
];

function SkillTagInput({ value, onChange, error }) {
  const [inputValue, setInputValue]             = useState('');
  const [showDropdown, setShowDropdown]         = useState(false);
  const [selectedSkills, setSelectedSkills]     = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef     = useRef(null);
  const dropdownRef  = useRef(null);
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
      const next = (highlightedIndex + 1) % allOptions.length;
      setHighlightedIndex(next);
      document.getElementById(`skill-option-${next}`)?.scrollIntoView({ block: 'nearest' });
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (highlightedIndex - 1 + allOptions.length) % allOptions.length;
      setHighlightedIndex(prev);
      document.getElementById(`skill-option-${prev}`)?.scrollIntoView({ block: 'nearest' });
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
    <div style={{ position: 'relative' }} ref={containerRef}>

      {/* Tags + input box */}
      <div
        className={`af-input ${error ? 'af-input--error' : ''}`}
        style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          gap: '6px', cursor: 'text', minHeight: '42px', padding: '6px 10px'
        }}
        onClick={() => { setShowDropdown(true); inputRef.current?.focus(); }}
      >
        {selectedSkills.map(skill => (
          <span key={skill} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: '#e0f2fe', color: '#0369a1', fontSize: '0.78rem',
            fontWeight: '600', padding: '3px 10px', borderRadius: '999px',
            border: '1px solid #7dd3fc'
          }}>
            {skill}
            <button type="button"
              onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#0369a1', fontWeight: 'bold', fontSize: '0.9rem',
                lineHeight: 1, padding: 0, marginLeft: '2px'
              }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={selectedSkills.length === 0 ? 'Search and add skills...' : ''}
          onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); setHighlightedIndex(-1); }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none', outline: 'none', background: 'transparent',
            fontSize: '0.9rem', flex: 1, minWidth: '120px'
          }}
        />
        {selectedSkills.length > 0 && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); setShowDropdown(true); setTimeout(() => inputRef.current?.focus(), 0); }}
            style={{
              width: '22px', height: '22px', borderRadius: '50%',
              background: '#4f8ef7', color: 'white', border: 'none',
              fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>+</button>
        )}
      </div>

      {/* Search box shown below tags when dropdown is open */}
      {selectedSkills.length > 0 && showDropdown && (
        <input
          type="text"
          value={inputValue}
          placeholder="Search skills..."
          onChange={(e) => { setInputValue(e.target.value); setShowDropdown(true); setHighlightedIndex(-1); }}
          onKeyDown={handleKeyDown}
          autoFocus
          className="af-input"
          style={{ marginTop: '4px', width: '100%' }}
        />
      )}

      {/* Dropdown list */}
      {showDropdown && allOptions.length > 0 && (
        <ul ref={dropdownRef} style={{
          position: 'absolute', zIndex: 50, width: '100%',
          background: 'white', border: '1px solid #e2e8f0',
          borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflowY: 'auto', maxHeight: '180px', marginTop: '4px',
          padding: 0, listStyle: 'none'
        }}>
          {allOptions.map((skill, index) => (
            <li key={skill} id={`skill-option-${index}`}
              onMouseDown={(e) => {
                e.preventDefault();
                if (skill === '__OTHER__') addSkill(inputValue.trim());
                else addSkill(skill);
                setHighlightedIndex(-1);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseLeave={() => setHighlightedIndex(-1)}
              style={{
                padding: '8px 14px', fontSize: '0.88rem', cursor: 'pointer',
                color: skill === '__OTHER__' ? '#2563eb' : highlightedIndex === index ? '#2563eb' : '#374151',
                background: highlightedIndex === index ? '#eff6ff' : 'white',
                fontWeight: skill === '__OTHER__' ? '600' : '400',
                borderTop: skill === '__OTHER__' ? '1px solid #f1f5f9' : 'none',
              }}>
              {skill === '__OTHER__' ? `+ Add "${inputValue.trim()}" as custom skill` : skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ApplicationForm({ publicUrlKey }) {
  const [form, setForm]               = useState(INITIAL_STATE);
  const [resume, setResume]           = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [additionalDocs, setAdditionalDocs] = useState(null);
  const [errors, setErrors]           = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [serverError, setServerError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleFileChange(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [type]: 'Only PDF, DOC, or DOCX files allowed.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [type]: 'File size must be under 5 MB.' }));
      return;
    }

    if (type === 'resume')         setResume(file);
    if (type === 'coverLetter')    setCoverLetter(file);
    if (type === 'additionalDocs') setAdditionalDocs(file);

    setErrors((prev) => ({ ...prev, [type]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim())     e.firstName      = 'First name is required.';
    if (!form.lastName.trim())      e.lastName       = 'Last name is required.';
    if (!form.email.trim())         e.email          = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.phone.trim())         e.phone          = 'Phone is required.';
    if (!form.location.trim())      e.location       = 'Location is required.';
    if (form.experience === '')     e.experience     = 'Experience is required.';
    if (form.currentSalary === '')  e.currentSalary  = 'Current salary is required.';
    if (form.expectedSalary === '') e.expectedSalary = 'Expected salary is required.';
    if (form.noticePeriod === '')   e.noticePeriod   = 'Notice period is required.';
    if (!resume)                    e.resume         = 'Please upload your resume.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = JSON.stringify({
      firstName:         form.firstName,
      lastName:          form.lastName,
      email:             form.email,
      phone: `${form.phoneDialCode} ${form.phone}`,
      location:          form.location,
      experience:        form.experience,
      currentSalary:     form.currentSalary,
     currentSalaryCurrency: form.currentSalaryCurrency,
     expectedSalary: form.expectedSalary,
     expectedSalaryCurrency: form.expectedSalaryCurrency,
      languagesKnown:    form.languagesKnown,
      noticePeriod:      form.noticePeriod,
      visaStatus:        form.visaStatus,
      applicationStatus: form.applicationStatus,
      employmentType:    form.employmentType,
      source:            form.source,
    });

    const formData = new FormData();
    formData.append('payload', payload);
    formData.append('cv', resume);
    if (coverLetter)    formData.append('coverLetter', coverLetter);
    if (additionalDocs) formData.append('additionalDocuments', additionalDocs);

    try {
      setSubmitting(true);
      const response = await fetch(
        `http://localhost:8098/api/public/apply/${publicUrlKey}`,
        { method: 'POST', body: formData }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Submission failed (status ${response.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────
  if (submitted) {
    return (
      <div className="af-success">
        <div className="af-success__icon">✓</div>
        <h2>Application Submitted!</h2>
        <p>Thank you, <strong>{form.firstName}</strong>! We'll contact you at <strong>{form.email}</strong> soon.</p>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────
  return (
    <form className="af-form" onSubmit={handleSubmit} noValidate>
      <div className="af-form__header">
        <h2 className="af-form__title">Apply for this Position</h2>
        <p className="af-form__subtitle">Fields marked <span style={{color:'#4f8ef7'}}>*</span> are required.</p>
      </div>

      {/* ── Personal Information ── */}
      <div className="af-section-title">Personal Information</div>
      <div className="af-grid">
        <Field label="First Name" required error={errors.firstName}>
          <input className={`af-input ${errors.firstName ? 'af-input--error' : ''}`}
            type="text" name="firstName" value={form.firstName}
            onChange={handleChange} placeholder="e.g. Ravi" />
        </Field>

        <Field label="Last Name" required error={errors.lastName}>
          <input className={`af-input ${errors.lastName ? 'af-input--error' : ''}`}
            type="text" name="lastName" value={form.lastName}
            onChange={handleChange} placeholder="e.g. Kumar" />
        </Field>

        <Field label="Email Address" required error={errors.email}>
          <input className={`af-input ${errors.email ? 'af-input--error' : ''}`}
            type="email" name="email" value={form.email}
            onChange={handleChange} placeholder="you@example.com" />
        </Field>

<Field label="Phone Number" required error={errors.phone}>
  <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}
       className={errors.phone ? 'af-input--error' : ''}>
    <select
      name="phoneDialCode"
      value={form.phoneDialCode}
      onChange={handleChange}
      style={{ border: 'none', outline: 'none', background: '#f8fafc', padding: '0 8px',
               borderRight: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer' }}>
      {PHONE_COUNTRIES.map(c => (
        <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
      ))}
    </select>
    <input
      className="af-input"
      style={{ border: 'none', borderRadius: 0, flex: 1 }}
      type="tel" name="phone" value={form.phone}
      onChange={handleChange} placeholder="98765 43210" />
  </div>
</Field>

        <Field label="Current Location" required error={errors.location}>
          <input className={`af-input ${errors.location ? 'af-input--error' : ''}`}
            type="text" name="location" value={form.location}
            onChange={handleChange} placeholder="e.g. Hyderabad" />
        </Field>

        <Field label="Visa / Work Authorization" error={errors.visaStatus}>
          <select className="af-input" name="visaStatus" value={form.visaStatus} onChange={handleChange}>
            <option value="">Select visa status</option>
            {['Citizen', 'Permanent Resident', 'H1B', 'L1', 'OPT / CPT', 'Other'].map(v =>
              <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>

      {/* ── Professional Details ── */}
      <div className="af-section-title">Professional Details</div>
      <div className="af-grid">
       
       <Field label="Current Salary" required error={errors.currentSalary}>
  <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}
       className={errors.currentSalary ? 'af-input--error' : ''}>
    <select
      name="currentSalaryCurrency"
      value={form.currentSalaryCurrency}
      onChange={handleChange}
      style={{ border: 'none', outline: 'none', background: '#f8fafc', padding: '0 10px',
               borderRight: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer' }}>
      {CURRENCIES.map(c => (
        <option key={c.symbol} value={c.symbol}>{c.label}</option>
      ))}
    </select>
    <input
      className="af-input"
      style={{ border: 'none', borderRadius: 0, flex: 1 }}
      type="text"
      name="currentSalary"
      value={form.currentSalary}
      onChange={(e) => {
        const val = e.target.value;
        if (/^[a-zA-Z0-9]*$/.test(val)) {
          handleChange({ target: { name: 'currentSalary', value: val } });
        }
      }}
      placeholder="50000"
    />
  </div>
</Field>



      <Field label="Expected Salary" required error={errors.expectedSalary}>
  <div style={{ display: 'flex', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}
       className={errors.expectedSalary ? 'af-input--error' : ''}>
    <select
      name="expectedSalaryCurrency"
      value={form.expectedSalaryCurrency}
      onChange={handleChange}
      style={{ border: 'none', outline: 'none', background: '#f8fafc', padding: '0 10px',
               borderRight: '1px solid #e2e8f0', fontSize: '0.9rem', cursor: 'pointer' }}>
      {CURRENCIES.map(c => (
        <option key={c.symbol} value={c.symbol}>{c.label}</option>
      ))}
    </select>
    <input
      className="af-input"
      style={{ border: 'none', borderRadius: 0, flex: 1 }}
      type="text"
      name="expectedSalary"
      value={form.expectedSalary}
      onChange={(e) => {
        const val = e.target.value;
        if (/^[a-zA-Z0-9]*$/.test(val)) {
          handleChange({ target: { name: 'expectedSalary', value: val } });
        }
      }}
      placeholder="50000"
    />
  </div>
</Field>


 <Field label="Years of Experience" required error={errors.experience}>
          <input className={`af-input ${errors.experience ? 'af-input--error' : ''}`}
            type="number" name="experience" value={form.experience}
            onChange={handleChange} placeholder="e.g. 3" min="0" />
        </Field>


        <Field label="Notice Period (days)" required error={errors.noticePeriod}>
          <input className={`af-input ${errors.noticePeriod ? 'af-input--error' : ''}`}
            type="number" name="noticePeriod" value={form.noticePeriod}
            onChange={handleChange} placeholder="e.g. 30" min="0" />
        </Field>

        <Field label="Employment Type" error={errors.employmentType}>
          <select className="af-input" name="employmentType" value={form.employmentType} onChange={handleChange}>
            <option value="">Select type</option>
            {['Full-Time', 'Part-Time', 'Freelancing', 'Contract', 'Internship'].map(t =>
              <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>


        <Field label="How did you hear about us?" error={errors.source}>
          <select className="af-input" name="source" value={form.source} onChange={handleChange}>
            <option value="">Select source</option>
            {['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Other'].map(s =>
              <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>


      <Field label="Skills" error={errors.languagesKnown} hint="Search and select your skills">
          <SkillTagInput
            value={form.languagesKnown}
            onChange={(val) => {
              setForm(prev => ({ ...prev, languagesKnown: val }));
              if (errors.languagesKnown) setErrors(prev => ({ ...prev, languagesKnown: '' }));
            }}
            error={errors.languagesKnown}
          />
        </Field>


      {/* ── Documents ── */}
      <div className="af-section-title">Documents</div>

      {/* Resume — Required */}
      <Field label="Resume / CV" required error={errors.resume} hint="PDF, DOC or DOCX · Max 5MB">
        <label className={`af-file-label ${resume ? 'af-file-label--has-file' : ''} ${errors.resume ? 'af-file-label--error' : ''}`}>
          <span style={{fontSize:'1.4rem'}}>{resume ? '📄' : '⬆️'}</span>
          <div style={{flex:1}}>
            <span className="af-file-text">
              {resume ? resume.name : 'Click to upload Resume / CV'}
            </span>
            {resume && (
              <span style={{display:'block', fontSize:'0.72rem', color:'#38e8c5'}}>
                {(resume.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          <input type="file" accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'resume')} style={{display:'none'}} />
        </label>
      </Field>

      {/* Cover Letter — Optional */}
      <Field label="Cover Letter" error={errors.coverLetter} hint="Optional · PDF, DOC or DOCX · Max 5MB">
        <label className={`af-file-label ${coverLetter ? 'af-file-label--has-file' : ''} ${errors.coverLetter ? 'af-file-label--error' : ''}`}>
          <span style={{fontSize:'1.4rem'}}>{coverLetter ? '📄' : '📝'}</span>
          <div style={{flex:1}}>
            <span className="af-file-text">
              {coverLetter ? coverLetter.name : 'Click to upload Cover Letter (optional)'}
            </span>
            {coverLetter && (
              <span style={{display:'block', fontSize:'0.72rem', color:'#38e8c5'}}>
                {(coverLetter.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          <input type="file" accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'coverLetter')} style={{display:'none'}} />
        </label>
      </Field>

      {/* Additional Documents — Optional */}
      <Field label="Additional Documents" error={errors.additionalDocs} hint="Optional · PDF, DOC or DOCX · Max 5MB">
        <label className={`af-file-label ${additionalDocs ? 'af-file-label--has-file' : ''} ${errors.additionalDocs ? 'af-file-label--error' : ''}`}>
          <span style={{fontSize:'1.4rem'}}>{additionalDocs ? '📄' : '📎'}</span>
          <div style={{flex:1}}>
            <span className="af-file-text">
              {additionalDocs ? additionalDocs.name : 'Click to upload Additional Documents (optional)'}
            </span>
            {additionalDocs && (
              <span style={{display:'block', fontSize:'0.72rem', color:'#38e8c5'}}>
                {(additionalDocs.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
          <input type="file" accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'additionalDocs')} style={{display:'none'}} />
        </label>
      </Field>

      {serverError && <div className="af-server-error">⚠ {serverError}</div>}

      <button type="submit" className="af-submit-btn" disabled={submitting}>
        {submitting ? '⏳ Submitting…' : 'Submit Application →'}
      </button>
    </form>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div className={`af-field ${error ? 'af-field--error' : ''}`}>
      <label className="af-label">
        {label}{required && <span style={{color:'#4f8ef7'}}> *</span>}
      </label>
      {children}
      {hint && !error && <span className="af-hint">{hint}</span>}
      {error && <span className="af-error-msg">● {error}</span>}
    </div>
  );
}

export default ApplicationForm;
