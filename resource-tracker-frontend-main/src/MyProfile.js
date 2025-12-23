import { useEffect ,useState} from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function MyProfile()
{
    const [resData, setResData] = useState(null);
    const [role,setRole]=useState('');
    const navigate = useNavigate();
    useEffect( () =>
    {
        const fetchEmployeeData = async () => {
    try {
      const employee = localStorage.getItem("employeeid");
      //console.log(employee);
      const res = await axios.get(`http://localhost:8098/api/v1/resource/${employee}`);
      if(res.data.permissionId==1)
      {
        setRole("Admin");
      }
      else if(res.data.permissionId==2)
      {
        setRole("Manager");
      }
      else
      {
        setRole("Employee");
      }
      setResData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  fetchEmployeeData();
    },[]);
    return(
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
          My Profile
        </h2>

        {resData && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">First Name</label>
                <input type="text" value={resData.firstName} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>

              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Last Name</label>
                <input type="text" value={resData.lastName} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Email</label>
                <input type="text" value={resData.email} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>

              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Phone</label>
                <input type="text" value={resData.phone} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Technology</label>
                <input type="text" value={resData.technology} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>

              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Skill</label>
                <input type="text" value={resData.skill} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Employment Type</label>
                <input type="text" value={resData.employmentType} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>

              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Experience</label>
                <input type="text" value={resData.experience} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Employee Role</label>
                <input type="text" value={role} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Status</label>
                <input type="text" value={resData.status} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>

              
            </div>

            <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">Start Date</label>
                <input type="text" value={new Date(resData.startDate).toISOString().split("T")[0]} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
              <div className="w-full md:w-[48%]">
                <label className="font-semibold block text-gray-700 mb-1">End Date</label>
                <input type="text" value={new Date(resData.endDate).toISOString().split("T")[0]} disabled className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm" />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 p-4 items-center justify-center mt-8">
          <button onClick={() => navigate("/manageresources")} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
            Back
          </button>
          <button onClick={() => navigate("/editprofile")} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
            Edit
          </button>
        </div>
      </div>
    </main>
    </div>
    </div>
    );
}
export default MyProfile;