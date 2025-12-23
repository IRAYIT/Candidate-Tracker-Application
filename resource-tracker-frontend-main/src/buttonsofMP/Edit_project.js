import Header from "../Header";
import Sidebar from "../Sidebar";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import {ClipLoader} from "react-spinners";
import axios from "axios";
function Edit_project()
{
    const [name, setName] = useState();
  const [clientName, setClientName] = useState();
  const [startdate, setStartDate] = useState(new Date());
   const [creatorName,setCreatorName]=useState(localStorage.getItem("resourceName"));
  const [enddate, setEndDate] = useState(() => {
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    return oneYearLater;
  });
  const [amount, setAmount] = useState();
  const [developerAmount, setDeveloperAmount] = useState();
  const [developerName, setDeveloperName] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [currency, setCurrency] = useState("$");
  const [devCurrency, setDevCurrency] = useState("$");
  const [skill, setSkill] = useState();
  const [technology, setTechnology] = useState([]);
  const [status, setStatus] = useState("BENCH");
  const [resourceId, setResourceId] = useState(0);
  const [resourceName, setResourceName] = useState("");
  const [projectId, setProjectId] = useState(0);
  const [errors, setErrors] = useState({});
  const [comments, setComments] = useState("");
  const [loading,setLoading]=useState(false);
  const [customTech, setCustomTech] = useState("");
  const navigate=useNavigate();
  const predefinedTechnologies = [
    "JAVA", "DOTNET", "TESTING", "ANGULAR", "REACTJS",
    "AWS DEVOPS", "AZURE DEVOPS", "SQL DEVELOPER"
  ];

  useEffect(() => {
    const pid = localStorage.getItem("projectid");
    getProject(pid);
  }, []);
  const saveData = (e) =>
      {
         e.preventDefault();

  const newErrors = {};

  if (!name.trim()) newErrors.projectName = "Project Name is required";
  if (!clientName.trim()) newErrors.clientName = "Client Name is required";
  if (!totalAmount || totalAmount <= 0) newErrors.totalAmount = "Enter a valid Total Amount";
  if (!developerAmount || developerAmount <= 0) newErrors.developerAmount = "Enter a valid Developer Amount";
  if (!startdate) newErrors.startDate = "Start Date is required";
  if (!enddate) newErrors.endDate = "End Date is required";
  if (!amount || amount <= 0) newErrors.amount = "Amount is required";
  if (!status || status === "Select Role") newErrors.status = "Status is required";
  if (!technology) newErrors.technology = "Technology is required";
  if (technology === "Other" && !customTech.trim()) newErrors.customTech = "Please enter the custom technology";
  if (!skill.trim()) newErrors.skills = "Skills are required";
  if (!resourceId) newErrors.resourceId = "Developer Name is required";
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0)
  {
   setLoading(true);
         if (
        name &&
        clientName &&
        totalAmount &&
        developerAmount &&
        startdate &&
        enddate &&
        amount &&
        status &&
        technology &&
        skill &&
        developerName != ""
      ) {
        var payload = {
          id: projectId,
          name: name,
          clientName: clientName,
          totalAmount: totalAmount,
          developerAmount: developerAmount,
          startDate: startdate,
          endDate: enddate,
          amount: amount,
          status: status,
          technology: technology === "Other" ? customTech : technology,
          skills: skill,
          resourceDto: {},
          resourceId: resourceId,
          createdAt: new Date(),
          createdBy: creatorName,
          updatedAt: new Date(),
          updatedBy: creatorName
        };

        axios
          .put("http://localhost:8098/api/v1/projects", payload)
          .then((res) => {
               navigate('/manageprojects');
          });}
        }
      }
  const getProject = (projectId) => {
    axios
      .get(`http://localhost:8098/api/v1/projects/${projectId}`)
      .then((res) => {
        const data = res.data;
        setProjectId(data.id);
        setClientName(data.clientName);
        setResourceId(data.resourceDto.id);
        setResourceName(data.resourceDto.resourceName);
        setName(data.name);
        setStartDate(new Date(data.startDate));
        setEndDate(new Date(data.endDate));

        if (predefinedTechnologies.includes(data.technology)) {
          setTechnology(data.technology);
          setCustomTech('');
        } else {
          setTechnology("Other");
          setCustomTech(data.technology);
        }

        setSkill(data.skills);
        setAmount(data.amount);
        setDeveloperAmount(data.developerAmount);
        setStatus(data.status);
        setTotalAmount(data.totalAmount);
        setComments(data.comments);
      });
      
  };
    return(
        <div className="min-h-screen flex">
          <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-300">
          <Header />
        </header>
      <main className="flex-1 bg-white">
  <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
    <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
      Edit Project
    </h2>
{loading ? (
      <div className="flex justify-center items-center h-[400px]">
    <ClipLoader size={60} color="#FACC15" />
  </div>
    ) : (
   <div className="space-y-6">
  <div className="flex flex-wrap gap-4 justify-between">
    {/* Project Name */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Project Name*</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.projectName && <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>}
    </div>

    {/* Client Name */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Client Name*</label>
      <input
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
    </div>

    {/* Total Amount */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Total Amount*</label>
      <div className="flex">
        <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l">$</span>
        <input
          type="text"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          className="border border-gray-300 rounded-r p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      {errors.totalAmount && <p className="text-red-500 text-sm mt-1">{errors.totalAmount}</p>}
    </div>

    {/* Developer Amount */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Developer Amount*</label>
      <div className="flex">
        <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l">$</span>
        <input
          type="text"
          value={developerAmount}
          onChange={(e) => setDeveloperAmount(e.target.value)}
          className="border border-gray-300 rounded-r p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      {errors.developerAmount && <p className="text-red-500 text-sm mt-1">{errors.developerAmount}</p>}
    </div>

    {/* Start Date */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Start Date*</label>
      <input
        type="date"
        value={new Date(startdate).toISOString().split("T")[0]}
        onChange={(e) => setStartDate(new Date(e.target.value))}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
    </div>

    {/* End Date */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">End Date*</label>
      <input
        type="date"
        value={new Date(enddate).toISOString().split("T")[0]}
        onChange={(e) => setEndDate(new Date(e.target.value))}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
    </div>

    {/* Amount */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Amount*</label>
      <div className="flex">
        <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l">$</span>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-300 rounded-r p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
      {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
    </div>

    {/* Status */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Status*</label>
      <input
        type="text"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
    </div>

    {/* Technology */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Technology*</label>
      <input
        type="text"
        value={customTech || technology}
        onChange={(e) => setCustomTech(e.target.value)}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.technology && <p className="text-red-500 text-sm mt-1">{errors.technology}</p>}
      {technology === "Other" && errors.customTech && <p className="text-red-500 text-sm mt-1">{errors.customTech}</p>}
    </div>

    {/* Skills */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Skills*</label>
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
    </div>

    {/* Developer Name */}
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1 block">Developer Name</label>
      <input
        type="text"
        value={resourceName}
        onChange={(e) => setDeveloperName(e.target.value)}
        className="border p-3 rounded w-full text-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-300"
      />
      {errors.resourceId && <p className="text-red-500 text-sm mt-1">{errors.resourceId}</p>}
    </div>
  </div>

  {/* Buttons */}
  <div className="flex justify-end gap-4 pt-6">
    <button
      className="px-4 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer"
      onClick={() => navigate("/manageprojects")}
    >
      Back
    </button>
    <button
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      onClick={saveData}
    >
      Update
    </button>
  </div>
</div>
    )}
  </div>
</main>

         </div>
        </div>
    )
}
export default Edit_project;