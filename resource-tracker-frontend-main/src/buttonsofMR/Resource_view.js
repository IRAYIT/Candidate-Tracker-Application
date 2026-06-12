import React, { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Resource_view() {
  const [resData, setResData]           = useState(null);
  const [role, setRole]                 = useState("");
  const [storedId, setStoredId]         = useState("");
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees]   = useState(false);
  const navigate = useNavigate();

  /* ── fetch resource ─────────────────────────────────────────────── */
  useEffect(() => {
    const sid = localStorage.getItem("rid");
    setStoredId(sid);
    if (!sid) return;

    axios
      .get(`http://localhost:8098/api/v1/resource/${sid}`)
      .then((res) => {
        const data = res.data;
        const permMap = { 1: "Admin", 2: "HR", 3: "Manager", 4: "Employee" };
        setRole(permMap[data.permissionId] ?? "Unknown");
        setResData(data);

        /* fetch assigned employees only for Manager (permissionId === 3) */
        if (data.permissionId === 3) {
          setLoadingEmployees(true);
          axios
            .get(`http://localhost:8098/api/v1/resource/getAllResourcesByManagerId/${sid}`)
            .then((empRes) => setAssignedEmployees(empRes.data ?? []))
            .catch((err) => console.error("Error fetching employees:", err))
            .finally(() => setLoadingEmployees(false));
        }
      })
      .catch((err) => console.error("Error fetching resource:", err));
  }, []);

  const skillsArray = resData?.skill
    ? resData.skill.split(",").map((s) => s.trim()).filter(Boolean)
    : [];



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

            {/* ── Page title ── */}
            <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-400 to-yellow-400 mb-6 shadow">
              Employee Details
            </h2>

            {resData && (
              <div className="space-y-6">

                {/* Row 1 – Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <Field label="First Name" value={resData.firstName} />
                  <Field label="Last Name"  value={resData.lastName}  />
                </div>

                {/* Row 2 – Contact */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <Field label="Email" value={resData.email} />
                  <Field label="Phone" value={resData.phone || ""} />
                </div>

                {/* Row 3 – Technology & Skills */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <Field label="Technology" value={resData.technology} />
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Skill</label>
                    <div className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 min-h-[38px] flex flex-wrap gap-2">
                      {skillsArray.map((skill, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center bg-white border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 4 – Employment */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <Field label="Employment Type" value={resData.employmentType} />
                  <Field label="Experience"       value={resData.experience}     />
                </div>

                {/* Row 5 – Role & Assigned Employees */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Employment Role</label>
                    <input
                      type="text"
                      value={role}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                  {role === "Manager" && (
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold block text-gray-700 mb-1">Assigned Employees</label>
                      <input
                        type="text"
                        value={
                          loadingEmployees
                            ? "Loading..."
                            : assignedEmployees.length === 0
                            ? "No employees assigned"
                            : assignedEmployees
                                .map((emp) => `${emp.firstName} ${emp.lastName}`)
                                .join(", ")
                        }
                        disabled
                        className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Row 6 – Comments */}
                <div>
                  <label className="font-semibold block text-gray-700 mb-1">Comments</label>
                  <textarea
                    value={resData.comments || ""}
                    disabled
                    rows={3}
                    className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm resize-none cursor-default"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 p-4 items-center justify-center mt-8">
                  <button
                    onClick={() => navigate("/manageresources")}
                    className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      navigate("/resource_edit");
                      localStorage.setItem("temp_id_for_use", storedId);
                    }}
                    className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    Edit
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

/* ── Reusable read-only field ────────────────────────────────────────── */
function Field({ label, value }) {
  return (
    <div className="w-full md:w-[48%]">
      <label className="font-semibold block text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        disabled
        className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
      />
    </div>
  );
}

export default Resource_view;