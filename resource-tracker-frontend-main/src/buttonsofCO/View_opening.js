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

  useEffect(() => {
    const openingid = localStorage.getItem("opening_id");
    axios
      .get(`http://localhost:8098/api/v1/openings/${openingid}`)
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

              {/* Row 1: Opening Name | Hours */}
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Opening Name *" value={openingname} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Hours *" value={hours} />
                </div>
              </div>

              {/* Row 2: Shift Timings | Payment */}
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Shift Timings *" value={shifttimings} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Payment *" value={payment} />
                </div>
              </div>

              {/* Row 3: Payment Type | Technology */}
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Payment Type *" value={paymenttype} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Technology *" value={technology} />
                </div>
              </div>

              {/* Row 4: Experience | Employment Type */}
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Experience *" value={experience} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Employment Type *" value={employmenttype} />
                </div>
              </div>

              {/* Row 5: Skills | Location */}
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full md:w-[48%]">
                  <ReadField label="Skills *" value={skills} />
                </div>
                <div className="w-full md:w-[48%]">
                  <ReadField label="Location *" value={location} />
                </div>
              </div>

              {/* Row 6: Status (full width) */}
              <div className="w-full">
                <ReadField label="Status *" value={status} />
              </div>

              {/* Row 7: Description (full width) */}
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
              <button
                onClick={() => navigate('/edit_opening')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition cursor-pointer"
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

export default View_opening;