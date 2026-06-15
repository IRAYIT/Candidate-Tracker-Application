import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PHONE_COUNTRIES = [
  { code: '+91', flag: '🇮🇳', label: '+91' },
  { code: '+46', flag: '🇸🇪', label: '+46' },
  { code: '+1',  flag: '🇺🇸', label: '+1'  },
];

// ─── Read-only Skill Tag Display ──────────────────────────────────────────────
function SkillTagDisplay({ value }) {
  const skills = value
    ? value.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  if (skills.length === 0) {
    return (
      <div className="border-2 border-yellow-400 rounded p-2 min-h-[42px] bg-gray-100 text-gray-400 text-sm">
        No skills listed
      </div>
    );
  }

  return (
    <div className="border-2 border-yellow-400 rounded p-2 min-h-[42px] bg-gray-100 flex flex-wrap gap-2">
      {skills.map(skill => (
        <span
          key={skill}
          className="flex items-center bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full border border-gray-300"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

// ─── MyProfile Component ──────────────────────────────────────────────────────
function MyProfile() {
  const [resData, setResData]       = useState(null);
  const [role, setRole]             = useState('');
  const [phoneDialCode, setPhoneDialCode] = useState('+91');
  const [phoneNumber, setPhoneNumber]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const employee = localStorage.getItem("employeeid");
        const res = await axios.get(`http://localhost:8098/api/v1/resource/${employee}`);
        const data = res.data;

        const permissionToRole = { 1: 'Admin', 2: 'HR', 3: 'Manager', 4: 'Employee' };
        setRole(permissionToRole[data.permissionId] || 'Employee');

        if (data.phone) {
          const stored = data.phone.trim();
          const matched = PHONE_COUNTRIES.find(c => stored.startsWith(c.code));
          if (matched) {
            setPhoneDialCode(matched.code);
            setPhoneNumber(stored.slice(matched.code.length).trim());
          } else {
            setPhoneNumber(stored);
          }
        }

        setResData(data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, []);

  // Shared disabled input style
  const disabledInput = "w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm";
  const labelClass    = "font-semibold block text-gray-700 mb-1";

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
              My Profile
            </h2>

            {resData && (
              <div className="space-y-6">

                {/* Row 1: Resource Name + First Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>User Name</label>
                    <input type="text" value={resData.resourceName || ''} disabled className={disabledInput} />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>First Name</label>
                    <input type="text" value={resData.firstName || ''} disabled className={disabledInput} />
                  </div>
                </div>

                {/* Row 2: Last Name + Email */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Last Name</label>
                    <input type="text" value={resData.lastName || ''} disabled className={disabledInput} />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Email</label>
                    <input type="text" value={resData.email || ''} disabled className={disabledInput} />
                  </div>
                </div>

                {/* Row 3: Phone + Skill */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Phone</label>
                    <div className="flex border-2 border-yellow-400 rounded overflow-hidden bg-gray-100">
                      <select
                        value={phoneDialCode}
                        disabled
                        className="bg-gray-200 px-2 outline-none border-r border-yellow-400 text-sm text-gray-800 cursor-not-allowed"
                      >
                        {PHONE_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={phoneNumber}
                        disabled
                        className="flex-1 p-2 text-sm bg-gray-100 text-gray-800 cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Skill</label>
                    <SkillTagDisplay value={resData.skill} />
                  </div>
                </div>

                {/* Row 4: Technology + Experience */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Technology</label>
                    <input type="text" value={resData.technology || ''} disabled className={disabledInput} />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Experience</label>
                    <input type="text" value={resData.experience || ''} disabled className={disabledInput} />
                  </div>
                </div>

                {/* Row 5: Employment Type + Employment Role */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Employment Type</label>
                    <input type="text" value={resData.employmentType || ''} disabled className={disabledInput} />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className={labelClass}>Employment Role</label>
                    <input type="text" value={role} disabled className={disabledInput} />
                  </div>
                </div>

                {/* Row 6: Status */}
                <div>
                  <label className={labelClass}>Status</label>
                  <input type="text" value={resData.status || ''} disabled className={disabledInput} />
                </div>

                {/* Row 7: Comments */}
                <div>
                  <label className={labelClass}>Comments</label>
                  <textarea
                    value={resData.comments || ''}
                    disabled
                    rows={3}
                    className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm resize-none cursor-not-allowed"
                  />
                </div>

              </div>
            )}

            <div className="flex gap-4 p-4 items-center justify-center mt-8">
              <button
                onClick={() => navigate("/manageresources")}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => navigate("/editprofile")}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer"
              >
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