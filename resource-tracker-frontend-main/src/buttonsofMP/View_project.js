import { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function View_project() {
  const [project, setProject] = useState(null);
  const [loading, setLoading]  = useState(true);
  const navigate = useNavigate();
  const userRole = parseInt(localStorage.getItem("permissionid"));

  useEffect(() => {
    const pid = localStorage.getItem("projectid");
    if (pid) fetchProject(pid);
  }, []);

  const fetchProject = async (pid) => {
    try {
      const res = await axios.get(`https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/projects/${pid}`);
      setProject(res.data);
    } catch (err) {
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const ReadField = ({ label, value, prefix, fullWidth }) => (
    <div className={fullWidth ? "w-full" : "w-full md:w-[48%]"}>
      <label className="font-semibold mb-1 block">{label}</label>
      <div className="flex">
        {prefix && (
          <span className="px-3 py-2 bg-gray-100 border-2 border-r-0 border-yellow-400 rounded-l text-sm font-bold text-gray-500">
            {prefix}
          </span>
        )}
        <div className={`w-full border-2 border-yellow-400 p-2 ${prefix ? "rounded-r" : "rounded"} bg-gray-50 text-sm text-gray-800 min-h-[42px] flex items-center`}>
          {value || <span className="text-gray-400">—</span>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen"><Sidebar /></aside>
        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-300"><Header /></header>
          <main className="flex-1 bg-white flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading project...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex">
        <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen"><Sidebar /></aside>
        <div className="flex-1 flex flex-col">
          <header className="border-b border-gray-300"><Header /></header>
          <main className="flex-1 bg-white flex items-center justify-center">
            <p className="text-red-500 text-sm">Project not found.</p>
          </main>
        </div>
      </div>
    );
  }

  const roles = project.projectRoles || [];
  const totalDevelopers = roles.reduce((sum, r) => sum + (r.resourceNames?.length || r.resourceIds?.length || 0), 0);

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
                <ReadField label="Project Name" value={project.name} />
                <ReadField label="Client Name"  value={project.clientName} />
                <ReadField label="Start Date"   value={fmt(project.startDate)} />
                <ReadField label="End Date"     value={fmt(project.endDate)} />

                {/* Buffer Allocation, Developer Allocation, Total Amount — commented out (also comment in DTO) */}
                {/* <ReadField label="Buffer Allocation"    value={project.totalAmount}     prefix="$" /> */}
                {/* <ReadField label="Developer Allocation" value={project.developerAmount} prefix="$" /> */}
                {/* <ReadField label="Total Amount"         value={project.amount}          prefix="$" /> */}

                {/* Status — full width */}
                <ReadField label="Status" value={project.status} fullWidth />
              </div>

              <div>
                <h3 className="text-xl font-bold p-4 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-4 shadow flex items-center justify-between">
                  <span>Team Assignment</span>
                  {totalDevelopers > 0 && (
                    <span className="text-sm font-semibold bg-white text-blue-700 px-3 py-1 rounded-full">
                      {totalDevelopers} developers · {roles.length} roles
                    </span>
                  )}
                </h3>

                {roles.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No roles assigned to this project.</p>
                ) : (
                  <div className="space-y-4">
                    {roles.map((role, index) => {
                      const skillList = Array.isArray(role.skills)
                        ? role.skills
                        : (role.skills || "").split(",").map((s) => s.trim()).filter(Boolean);

                      const devNames = role.resourceNames?.length
                        ? role.resourceNames
                        : (role.resourceIds || []).map(String);

                      return (
                        <div key={role.id || index} className="border-2 border-yellow-400 rounded-lg overflow-hidden">

                          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400">
                            <div className="w-7 h-7 rounded-full bg-white text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm">
                                {role.technology || `Role ${index + 1}`}
                              </span>
                              {role.roleLabel && (
                                <span className="mt-0.5 inline-flex">
                                  <span className="text-xs font-semibold bg-white text-blue-700 px-2 py-0.5 rounded-full">
                                    {role.roleLabel}
                                  </span>
                                </span>
                              )}
                            </div>
                            {devNames.length > 0 && (
                              <span className="ml-auto text-xs font-bold bg-white text-green-700 px-3 py-1 rounded-full flex-shrink-0">
                                ✓ {devNames.length} assigned
                              </span>
                            )}
                          </div>

                          <div className="p-4 bg-white space-y-4">
                            <div>
                              <label className="font-semibold mb-2 block text-sm">Skills</label>
                              {skillList.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {skillList.map((s) => (
                                    <span key={s} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm">No skills listed</p>
                              )}
                            </div>

                            <div>
                              <label className="font-semibold mb-2 block text-sm">Assigned Developers</label>
                              {devNames.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {devNames.map((name) => (
                                    <span key={name} className="flex items-center gap-1.5 bg-green-50 text-green-800 border border-green-200 text-xs font-semibold px-3 py-1 rounded-full">
                                      <span>👤</span> {name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm">No developers assigned</p>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex gap-4 p-4 items-center justify-center mt-4">
                <button
                  onClick={() => navigate("/manageprojects")}
                  className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer"
                >
                  Back
                </button>

                {userRole !== 4 && (
                  <button
                    onClick={() => navigate("/edit_project")}
                    className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Edit
                  </button>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default View_project;