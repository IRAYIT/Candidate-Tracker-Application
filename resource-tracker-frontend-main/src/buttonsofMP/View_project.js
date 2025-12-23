import { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function View_project() {
  const [name, setName] = useState();
  const [clientName, setClientName] = useState();
  const [startdate, setStartDate] = useState(new Date());
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
  const [comments, setComments] = useState("");
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
      View Project
    </h2>

    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 justify-between">
        {[
          { label: "Project Name*", value: name },
          { label: "Client Name*", value: clientName },
          { label: "Total Amount*", value: totalAmount, prefix: "$" },
          { label: "Developer Amount*", value: developerAmount, prefix: "$" },
          { label: "Start Date*", value: startdate?.toLocaleDateString() },
          { label: "End Date*", value: enddate?.toLocaleDateString() },
          { label: "Amount*", value: amount, prefix: "$" },
          { label: "Status*", value: status },
          { label: "Technology*", value: customTech || technology },
          { label: "Skills*", value: skill },
          { label: "Developer Name", value: resourceName }
        ].map(({ label, value, prefix }, i) => (
          <div key={i} className="w-full md:w-[48%]">
            <label className="font-semibold mb-1 block">{label}</label>
            <div className="flex">
              {prefix && (
                <span className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l">{prefix}</span>
              )}
              <input
                type="text"
                readOnly
                value={value || ""}
                className={`w-full border border-gray-300 p-3 ${
                  prefix ? 'rounded-r' : 'rounded'
                } bg-gray-100`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={() => navigate('/manageprojects')}
          className="px-4 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={() => navigate('/edit_project')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</main>
</div>
</div>
  );
}

export default View_project;
