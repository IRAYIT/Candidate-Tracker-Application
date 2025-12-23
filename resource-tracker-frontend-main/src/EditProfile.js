import { useEffect,useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
function EditProfile()
{
const [resData, setResData] = useState({});
  const [resourceName, setResourceName] = useState("");
   const [creatorName,setCreatorName]=useState(localStorage.getItem("resourceName"));
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
  const [managerId,setManagerId]=useState('');
  const [permissionid,setPermissionid]=useState('');
   const [resourceId, setResourceid] = useState(localStorage.getItem("rid"));
  const [mappedResources,setMappedResources]=useState([]);
  const [comments,setComments]=useState('cns');
  const [isClient,setIsClient]=useState(false);
  useEffect(() => {
    const resourceid = localStorage.getItem("employeeid");
    if (resourceid) {
      axios
        .get(`http://localhost:8098/api/v1/resource/${resourceid}`)
        .then((res) => {
          const data = res.data;
          setResData(data);
          //console.log(res.data);

          // Sync to form fields
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
          //console.log("assignedResourceIds from API:", data.assignedResourceIds);
          setComments(data.comments);
        })
        .catch((err) => {
          console.error("Error fetching resource:", err);
        });
    }
  }, []);

  const handleSubmit = (e) => {
   // console.log(managerId);
    //console.log(permissionid);
    e.preventDefault();
    if (
        resourceName &&
        firstName &&
        lastName &&
        email &&
        phone &&
        skill &&
        technology &&
        employmenttype &&
        experience &&
        status != ""
      ) {
        setError(false);
        const formData = new FormData();
        var userPermissionId=  localStorage.getItem("permissionid");
        //const assignedResourceIds = mappedResources.map( resource => resource.id);
      //  console.log(enddate);
        //console.log(startdate);
       var payload = {
        
  id: resourceId,
  permissionId: permissionid,
  managerId: managerId,
  //assignedResourceIds: mappedResources, // Fix this
  resourceName,
  firstName,
  lastName,
  linkedin:"cns",
  startDate:startdate,
  endDate:enddate,
  skill,
  technology,
  experience,
  employmentType: employmenttype,
  phone,
  email,
  client: isClient,
  status,
  comments:"cns",
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

        //setLoading(true);
        axios
  .put("http://localhost:8098/api/v1/resource/update/upload", formData)
  .then((res) => {
    navigate('/manageresources');
  })
  .catch((error) => {
    
  })
  .finally(() => {
    //setLoading(false);
  });
  }
  }
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

        <form onSubmit={handleSubmit} className="space-y-6">
        
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Resource Name *</label>
              <input type="text" value={resourceName} onChange={(e) => setResourceName(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">First Name *</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Last Name *</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Phone *</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Skill *</label>
              <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Technology *</label>
              <select value={technology} onChange={(e) => setTechnology(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full">
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
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Employment Type *</label>
              <select value={employmenttype} onChange={(e) => setEmploymenttype(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full">
                <option value="">-- Select Type --</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Consultant">Consultant</option>
                <option value="Sweden-FullTime">Sweden-FullTime</option>
                <option value="India FullTime">India-FullTime</option>
                <option value="USA-FullTime">USA-FullTime</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Experience *</label>
              <input type="text" value={experience} onChange={(e) => setExperience(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Status *</label>
              <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Start Date *</label>
              <input type="date" value={startdate} onChange={(e) => setStartdate(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">End Date *</label>
              <input type="date" value={enddate} onChange={(e) => setEnddate(e.target.value)} className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div>
            <label className="font-semibold mb-1">Attachments *</label>
            <input type="file" multiple onChange={(e) => setFile(e.target.files)} className="border-2 border-yellow-400 p-2 rounded w-full mt-2" />
          </div>

          {error && (
            <p className="text-red-600 font-medium">Please fill in all required fields.</p>
          )}

          <div className="flex gap-4 justify-center mt-8">
            <button onClick={() => navigate('/manageresources')} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
              Back
            </button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow cursor-pointer">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</div>
  )}

export default EditProfile;