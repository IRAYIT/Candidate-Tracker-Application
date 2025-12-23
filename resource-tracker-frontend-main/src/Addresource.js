import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
function Addresource()
{ const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState("Add Resource");
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
  const [employeeId,setEmployeeId]=useState();
  const [linkedIn, setLinkedIn] = useState('');
  const [name, setName] = useState('')
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
  const [resourcenameError, setResourcenameError] = useState(false);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(true);
  const [experiencePopup, setexperiencePopup] = useState(false);
  const [upload ,setUpload]=useState(false);
  const onDismiss = () => setVisible(false);
  const [payload, setPayLoad] = useState({});
  const [id, setId] = useState();
  const [crctskill,setCrctskill]=useState(false);
  const [resid, setResId] = useState();
  const [buttonFlag, setButtonFlag] = useState("SAVE");
  const navigate=useNavigate();
 const [phoneerror,setPhoneerror]=useState(false);
   const [selectedRole, setSelectedRole] = useState('');
  const [mappedResources, setMappedResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    //axios.get('https://resourcetracker.gotracrat.in:8098/api/v1/resource/getAllUnassignedResources')
    axios.get('http://localhost:8098/api/v1/resource/getAllUnassignedResources')
      .then(res => {
        //console.log(res);
        setEmployeeList(res.data || []);
      })
      .catch(err => {
      });
    setPermissionId(localStorage.getItem("permissionid"));
    setEmployeeId(localStorage.getItem("employeeid"))
  }, []);

 const handleRoleChange = (role) => {
    setSelectedRole(role);
    setMappedResources([]);
    setSearchTerm('');
  };
  const handleSelect = (emp) => { 
    setMappedResources([...mappedResources,emp])
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
  }
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

  axios
    .get(`http://localhost:8098/api/v1/resource/emailCheck/${email}`)
    .then((res) => {
      if (res.status === 200) {
        if (res.data === "Email Available") {
          setErrors((prev) => ({ ...prev, email: "" }));
        } else {
          setErrors((prev) => ({ ...prev, email: res.data }));
        }
      }
    })
    .catch((error) => {
      setErrors((prev) => ({ ...prev, email: "Error checking email." }));
      console.error("Email check failed:", error);
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
    axios.get(`http://localhost:8098/api/v1/resource/nameCheck/${firstName + "_" + lastName}`).then((res) => {

      if (res.status == 200) {
        if (res.data === "ResourceName Available") {
          setErrors((prev) => ({ ...prev, lastName: "" }));
        }
        else {
          setErrors((prev) => ({ ...prev, lastName: res.data }));
        }

      }

    });
  }
  const save = () =>
   {
      const newErrors = validateFields();
    setErrors(newErrors);
    console.log("errors",errors);
   if (Object.keys(newErrors).length > 0) {
     return; // stop submission
   }
setLoading(true);
     if (
        ( 
          firstName &&
          lastName && 
          email &&
          phone &&
          skill &&
          technology || customTechnology &&
          employmentType &&
          experience &&
          file &&
          status) != ""
      ) {
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
if(selectedRole=='Admin')
{
  basedonrole=1;
}
else if(selectedRole=='Manager')
{
  basedonrole=2;
}
else
{
  basedonrole=3;
}
let finalTechnology = technology;
if (technology == "OTHER") {
  finalTechnology = `${technology},${customTechnology}`;
}
console.log(finalTechnology);
let payload = {
  permissionId:basedonrole,
  managerId: null,
  resourceName: `${firstName}_${lastName}`,
  linkedin: linkedIn,
  firstName,
  lastName,
  name,
  startDate: startdate,
  endDate: enddate,
  skill,
  technology:finalTechnology,
  experience,
  assignedResourceIds:[],
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
  resourceType: ''
};
let localpermission=localStorage.getItem("permissionid");
console.log("permission",localpermission);
if (localpermission == "2" && selectedRole == "Employee") {
  payload.managerId = employeeId; 
}
if (selectedRole=="Manager") {
  payload = {
    ...payload,
    assignedResourceIds: mappedResources.map( resource => resource.id),
  };
}
formData.append("payload", JSON.stringify(payload));
console.log(payload);
          axios
  .post("http://localhost:8098/api/v1/resource/upload", formData)
  .then((res) => {
    console.log(res);
    navigate('/manageresources');
  })
  .catch((error) => {
  })
  .finally(() => {
  });}
        else {
          setexperiencePopup(true);
        }
      }
      else {
        setErrors(true);
        console.log("hiiii");
      }
  }
  return(<div className="min-h-full flex">
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
          {/* Name Fields */}
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1 block">First Name <span className="text-pink-800">*</span></label>
              <input
                type="text"
                onChange={(e) => {
  setFirstName(e.target.value);
  if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
}}
                value={firstName}
                placeholder="Enter first name"
                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.firstName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1 block">Last Name <span className="text-pink-800">*</span></label>
              <input
                type="text"
                onBlur={checkResourceName}
                onChange={(e) => {
  setLastName(e.target.value);
  if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
}}

                value={lastName}
                placeholder="Enter last name"
                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.lastName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1 block">Email <span className="text-pink-800">*</span></label>
              <input
                type="email"
                onBlur={checkEmail}
                onChange={(e) => {
  setEmail(e.target.value);
  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
}}

                value={email}
                placeholder="Enter email"
                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1 block">Mobile <span className="text-pink-800">*</span></label>
              <input
                type="text"
                onChange={(e) => {
  setPhone(e.target.value);
  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
}}

                value={phone}
                placeholder="Enter mobile"
                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Skill & Experience */}
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1 block">Skills <span className="text-pink-800">*</span></label>
              <input
                type="text"
                onChange={(e) => {
  setSkill(e.target.value);
  if (errors.skill) setErrors(prev => ({ ...prev, skill: '' }));
}}

                value={skill}
                placeholder="Enter skills"
                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.skill ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.skill && <p className="text-red-600 text-sm mt-1">{errors.skill}</p>}
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1 block">Experience <span className="text-pink-800">*</span></label>
              <input
                type="text"
                onChange={(e) => {
  setExperience(e.target.value);
  if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
}}

                value={experience}
                placeholder="Enter experience"
                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.experience ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
              {errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
            </div>
          </div>

          {/* Technology & Employment Type */}
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

                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.technology ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
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
                onChange={(e) => {
  setEmploymentType(e.target.value);
  if (errors.employmentType) setErrors(prev => ({ ...prev, employmentType: '' }));
}}

                className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                  errors.employmentType ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
                }`}
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

          {/* Role and Manager Mapping */}
          <div className="flex flex-col">
  <label className="font-semibold mb-1 block">
    Employment Role <span className="text-pink-800">*</span>
  </label>
  <select
    value={selectedRole}
    onChange={(e) => handleRoleChange(e.target.value)}
    className="border border-gray-300 p-3 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
  >
    <option value="">Select Role</option>
    <option value="Admin">Admin</option>
    <option value="Manager">Manager</option>
    <option value="Employee">Employee</option>
  </select>
</div>

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
            <li
              key={emp.id}
              className="flex justify-between items-center mb-1"
            >
              {`${emp.firstName}_${emp.lastName}_${emp.firstName[0]}`}
              <button
                onClick={() => handleRemove(emp.id)}
                className="text-red-600 ml-2 text-sm"
              >
                ✕
              </button>
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
              onChange={(e) => {
  setFile(e.target.files);
  if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
}}

              className={`border p-3 rounded w-full mt-2 text-sm ${
                errors.file ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.file && <p className="text-red-600 text-sm mt-1">{errors.file}</p>}
          </div>

          {/* Comments */}
          <div>
            <label className="font-semibold mb-1 block">Comments <span className="text-pink-800">*</span></label>
            <textarea
              value={comments}
              onChange={(e) => {
  setComments(e.target.value);
  if (errors.comments) setErrors(prev => ({ ...prev, comments: '' }));
}}

              placeholder="Enter comments"
              rows={3}
              className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${
                errors.comments ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
              }`}
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