import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useState } from "react";
import {ClipLoader} from "react-spinners";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
function Addproject() {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [totalAmount, setTotalAmount] = useState();
   const [creatorName,setCreatorName]=useState(localStorage.getItem("resourceName"));
  const [developerAmount, setDeveloperAmount] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [amount, setAmount] = useState();
  const [status, setStatus] = useState("");
  const [technology, setTechnology] = useState("");
  const [customTech, setCustomTech] = useState("");
  const [skills, setSkills] = useState("");
  const [developerName, setDeveloperName] = useState("DEV");
  const [resourceId, setResourceId] = useState(""); 
  const [error, setError] = useState("");
  const [resourceNames,setResourceNames]=useState([]);
  const [loading,setLoading]=useState(false);

  const [errors, setErrors] = useState({});
  const navigate=useNavigate();
  useEffect(() =>
  {
  },[]);
  const getResNames = () => {


      var payload = {
        permissionId:3,
        technology: technology
      };

      axios.post(`http://localhost:8098/api/v1/projects/getResourceNames`, payload).then((res) => {
        if (res.status == 200) {
          console.log("DATA:",res.data);
          
          setResourceNames(res.data);
        }
        else {
        //console.log(res.status);
        }

      }).catch((err) =>console.log(err))

  }
  const allocation = () =>
  {
    if(totalAmount>0 && developerAmount >0)
    {
      setAmount(Number(totalAmount)+Number(developerAmount));
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();

  const newErrors = {};

  if (!projectName.trim()) newErrors.projectName = "Project Name is required";
  if (!clientName.trim()) newErrors.clientName = "Client Name is required";
  if (!totalAmount || totalAmount <= 0) newErrors.totalAmount = "Enter a valid Total Amount";
  if (!developerAmount || developerAmount <= 0) newErrors.developerAmount = "Enter a valid Developer Amount";
  if (!startDate) newErrors.startDate = "Start Date is required";
  if (!endDate) newErrors.endDate = "End Date is required";
  if (!amount || amount <= 0) newErrors.amount = "Amount is required";
  if (!status || status === "Select Role") newErrors.status = "Status is required";
  if (!technology) newErrors.technology = "Technology is required";
  if (technology === "Other" && !customTech.trim()) newErrors.customTech = "Please enter the custom technology";
  if (!skills.trim()) newErrors.skills = "Skills are required";
  if (!resourceId) newErrors.resourceId = "Developer Name is required";
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0)
  {
    setLoading(true);
     if (
        projectName &&
        clientName &&
        totalAmount &&
        developerAmount &&
        startDate &&
        endDate &&
        amount &&
        status &&
        technology &&
        skills &&
        developerName != ""
      ) {
        var payload = {
          name: projectName,
          clientName: clientName,
          totalAmount: totalAmount,
          developerAmount: developerAmount,
          startDate: startDate,
          endDate: endDate,
          amount: amount,
          status: status,
          technology: technology,
          skills: skills,
          resourceDto: {},
          resourceId: resourceId,
          createdAt: new Date(),
          createdBy: creatorName,
          updatedAt: new Date(),
          updatedBy: creatorName
        };
        axios
          .post("http://localhost:8098/api/v1/projects/createproject", payload)
          .then((res) => {
            console.log(payload);
            navigate('/manageprojects');
          });
      }
      else {
        setError(true);
      }
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
          Add Project
        </h2>

{loading ? (
      <div className="flex justify-center items-center h-[400px]">
    <ClipLoader size={60} color="#FACC15" />
  </div>
    ) : (

        <div className="space-y-6">
         {/* Row 1 */}
<div className="flex flex-wrap gap-4 justify-between">
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Project Name <span className="text-pink-800">*</span></label>
    <input
      type="text"
      value={projectName}
      onChange={(e) => {
        setProjectName(e.target.value);
        if (errors.projectName) setErrors(prev => ({ ...prev, projectName: "" }));
      }}
      placeholder="Enter Project Name"
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.projectName ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    />
    {errors.projectName && <p className="text-red-600 text-sm mt-1">{errors.projectName}</p>}
  </div>
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Client Name <span className="text-pink-800">*</span></label>
    <input
      type="text"
      value={clientName}
      onChange={(e) => {
        setClientName(e.target.value);
        if (errors.clientName) setErrors(prev => ({ ...prev, clientName: "" }));
      }}
      placeholder="Enter Client Name"
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.clientName ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    />
    {errors.clientName && <p className="text-red-600 text-sm mt-1">{errors.clientName}</p>}
  </div>
</div>

{/* Row 2 */}
<div className="flex flex-wrap gap-4 justify-between">
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Buffer Allocation<span className="text-pink-800">*</span></label>
    <div className="flex">
      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">$</span>
      <input
        type="number"
        value={totalAmount}
        onBlur={allocation}
        onChange={(e) => {
          setTotalAmount(e.target.value);
          if (errors.totalAmount) setErrors(prev => ({ ...prev, totalAmount: "" }));
        }}
        className={`border border-l-0 p-3 rounded-r w-full text-sm focus:outline-none focus:ring-2 ${errors.totalAmount ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
      />
    </div>
    {errors.totalAmount && <p className="text-red-600 text-sm mt-1">{errors.totalAmount}</p>}
  </div>
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Developer Allocation<span className="text-pink-800">*</span></label>
    <div className="flex">
      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">$</span>
      <input
        type="number"
        value={developerAmount}
        onBlur={allocation}
        onChange={(e) => {
          setDeveloperAmount(e.target.value);
          if (errors.developerAmount) setErrors(prev => ({ ...prev, developerAmount: "" }));
        }}
        className={`border border-l-0 p-3 rounded-r w-full text-sm focus:outline-none focus:ring-2 ${errors.developerAmount ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
      />
    </div>
    {errors.developerAmount && <p className="text-red-600 text-sm mt-1">{errors.developerAmount}</p>}
  </div>
</div>

{/* Row 3 */}
<div className="flex flex-wrap gap-4 justify-between">
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Start Date <span className="text-pink-800">*</span></label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => {
        setStartDate(e.target.value);
        if (errors.startDate) setErrors(prev => ({ ...prev, startDate: "" }));
      }}
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.startDate ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    />
    {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
  </div>
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">End Date <span className="text-pink-800">*</span></label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => {
        setEndDate(e.target.value);
        if (errors.endDate) setErrors(prev => ({ ...prev, endDate: "" }));
      }}
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.endDate ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    />
    {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
  </div>
</div>

{/* Row 4 */}
<div className="flex flex-wrap gap-4 justify-between">
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Amount <span className="text-pink-800">*</span></label>
    <div className="flex">
      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l">$</span>
      <input
        type="number"
        value={amount}
        readOnly
        className={`border border-l-0 p-3 rounded-r w-full text-sm focus:outline-none focus:ring-2 ${errors.amount ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
      />
    </div>
    {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount}</p>}
  </div>
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Status <span className="text-pink-800">*</span></label>
    <select
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        if (errors.status) setErrors(prev => ({ ...prev, status: "" }));
      }}
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.status ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    >
      <option>Select Role</option>
      <option>In Progress</option>
      <option>Yet to Start</option>
      <option>Completed</option>
    </select>
    {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
  </div>
</div>

{/* Row 5 */}
<div className="flex flex-wrap gap-4 justify-between">
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Technology <span className="text-pink-800">*</span></label>
    <select
      value={technology}
      onChange={(e) => {
        setTechnology(e.target.value);
        if (errors.technology) setErrors(prev => ({ ...prev, technology: "" }));
      }}
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.technology ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
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
    {errors.technology && <p className="text-red-600 text-sm mt-1">{errors.technology}</p>}
  </div>

  {technology === "Other" && (
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Other Technology <span className="text-pink-800">*</span></label>
      <input
        type="text"
        value={customTech}
        onChange={(e) => {
          setCustomTech(e.target.value);
          if (errors.customTech) setErrors(prev => ({ ...prev, customTech: "" }));
        }}
        placeholder="Enter Custom Technology"
        className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.customTech ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
      />
      {errors.customTech && <p className="text-red-600 text-sm mt-1">{errors.customTech}</p>}
    </div>
  )}
</div>

{/* Row 6 */}
<div className="flex flex-wrap gap-4 justify-between">
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Skills <span className="text-pink-800">*</span></label>
    <input
      type="text"
      value={skills}
      onChange={(e) => {
        setSkills(e.target.value);
        if (errors.skills) setErrors(prev => ({ ...prev, skills: "" }));
      }}
      onBlur={getResNames}
      placeholder="Enter skills"
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.skills ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    />
    {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
  </div>
  <div className="w-full md:w-[48%]">
    <label className="font-semibold mb-1 block">Developer Name <span className="text-pink-800">*</span></label>
    <select
      value={resourceId}
      name="developerName"
      onChange={(e) => {
        setResourceId(e.target.value);
        setDeveloperName(e.target.value);
        if (errors.resourceId) setErrors(prev => ({ ...prev, resourceId: "" }));
      }}
      className={`border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 ${errors.resourceId ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-blue-300"}`}
    >
      <option value="">Select Resource Name</option>
      {resourceNames.map((name) => (
        <option key={name.id} value={name.id}>
          {name.resourceName}
        </option>
      ))}
    </select>
    {errors.resourceId && <p className="text-red-600 text-sm mt-1">{errors.resourceId}</p>}
  </div>
</div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer" onClick={() =>navigate('/manageprojects')}>
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
