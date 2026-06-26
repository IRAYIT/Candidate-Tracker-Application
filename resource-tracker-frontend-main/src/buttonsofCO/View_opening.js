import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

function View_opening() {
  const [openingname, setOpeningname]       = useState('');
  const [hours, setHours]                   = useState('');
  const [shifttimings, setShifttimings]     = useState('');
  const [payment, setPayment]               = useState('');
  const [paymenttype, setPaymenttype]       = useState('');
  const [technology, setTechnology]         = useState('');
  const [experience, setExperience]         = useState('');
  const [employmenttype, setEmploymenttype] = useState('');
  const [skills, setSkills]                 = useState('');
  const [status, setStatus]                 = useState('');
  const [location, setLocation]             = useState('');
  const [description, setDescription]       = useState('');
  const navigate = useNavigate();
const userRole = parseInt(localStorage.getItem("permissionid"));

  useEffect(() => {
    const openingid = localStorage.getItem("opening_id");
    axios
      .get(`https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/openings/${openingid}`)
      .then((res) => {
        setOpeningname(res.data.name);
        setHours(res.data.hours);
        setShifttimings(res.data.shiftTimings);
        setPayment(res.data.payment);
        setPaymenttype(res.data.paymentType);
        setTechnology(res.data.technology);
        setSkills(res.data.skill);
        setEmploymenttype(res.data.employmentType);
        setExperience(res.data.experience);
        setStatus(res.data.status);
        setLocation(res.data.location);
        setDescription(res.data.description);
      });
  }, []);

  const ReadField = ({ label, value }) => (
    <div>
      <label className="font-semibold mb-1 block">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        readOnly
        className="border-2 border-yellow-400 p-2 rounded w-full bg-gray-50 text-gray-700"
      />
    </div>
  );

  const skillList = skills
    ? skills.split(',').map(s => s.trim()).filter(Boolean)
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

        <main className="flex-1 p-6 bg-white">
          <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
              View Opening
            </h2>

            <div className="space-y-6">

              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Opening Name *" value={openingname} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Hours *" value={hours} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Shift Timings *" value={shifttimings} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Payment" value={payment} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Payment Type *" value={paymenttype} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Technology *" value={technology} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Experience *" value={experience} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Employment Type *" value={employmenttype} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <label className="font-semibold mb-1 block">Skills *</label>
                  <div className="border-2 border-yellow-400 rounded p-2 min-h-[42px] bg-gray-50 flex flex-wrap gap-2">
                    {skillList.length > 0 ? (
                      skillList.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No skills listed</span>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Location *" value={location} />
                </div>
              </div>

              <div className="w-full">
                <ReadField label="Status *" value={status} />
              </div>

              <div className="w-full">
                <label className="font-semibold mb-1 block">Description</label>
                <textarea
                  value={description ?? ''}
                  readOnly
                  className="border-2 border-yellow-400 p-2 rounded w-full resize-none bg-gray-50 text-gray-700"
                  rows={5}
                />
              </div>

            </div>

            <div className="flex gap-4 p-4 items-center justify-center mt-8">
              <button
                onClick={() => navigate('/current_openings')}
                className="px-6 py-2 rounded-md border border-gray-400 bg-white text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              >
                Back
              </button>

              {userRole !== 4 && (  // ✅ Edit button hidden for role 4
                <button
                  onClick={() => navigate('/edit_opening')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default View_opening;