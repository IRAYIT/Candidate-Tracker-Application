import axios from "axios";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import {ClipLoader} from "react-spinners";
import Header from "../Header";
function View_opening()
{
     const [openingname,setOpeningname]=useState('');
    const [hours,setHours]=useState();
    const [shifttimings,setShifttimings]=useState('');
    const [payment,setPayment]=useState();
    const [paymenttype,setPaymenttype]=useState('');
    const [technology,setTechnology]=useState('');
    const [experience,setExperience]=useState();
    const [employmenttype,setEmploymenttype]=useState('Free Lancing');
    const [skills,setSkills]=useState('');
    const [status,setStatus]=useState('');
    const [startdate,setStartdate]=useState(new Date);
    const navigate=useNavigate();
    const [customTech,setCustomTech]=useState('');
    const [enddate, setEnddate] = useState(() => {
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  return oneYearLater;
  });
    const [openingId,setOpeningId]=useState('');
    useEffect(() =>
    {
        let openingid=localStorage.getItem("opening_id");
         axios
      .get(`http://localhost:8098/api/v1/openings/${openingid}`)
      .then((res) => {
        setOpeningId(openingid);
        setOpeningname(res.data.name);
        setHours(res.data.hours);
        setShifttimings(res.data.shiftTimings);
        setPayment(res.data.payment);
        setPaymenttype(res.data.paymentType);
        setStartdate(new Date(res.data.startDate));
        setEnddate(new Date(res.data.endDate));
        setTechnology(res.data.technology);
        setSkills(res.data.skill);
        setEmploymenttype(res.data.employmentType);
        setExperience(res.data.experience);
        setStatus(res.data.status);
      });
    },[]);
    return(
        <>
       <div className="min-h-screen flex flex-col bg-white">
  <header className="shadow z-10">
    <Header />
  </header>

  <div className="flex flex-1">
    <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
      <Sidebar />
    </aside>

    <main className="flex-1 p-6 bg-white">
      <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
          View Opening
        </h2>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Opening Name <span className="text-pink-800">*</span></label>
              <input type="text" value={openingname} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Hours <span className="text-pink-800">*</span></label>
              <input type="text" value={hours} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Shift Timings <span className="text-pink-800">*</span></label>
              <input type="text" value={shifttimings} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Payment <span className="text-pink-800">*</span></label>
              <input type="text" value={payment} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Payment Type <span className="text-pink-800">*</span></label>
              <input type="text" value={paymenttype} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Technology <span className="text-pink-800">*</span></label>
              <input type="text" value={technology === 'Other' ? customTech : technology} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Experience <span className="text-pink-800">*</span></label>
              <input type="text" value={experience} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Employment Type <span className="text-pink-800">*</span></label>
              <input type="text" value={employmenttype} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Skills <span className="text-pink-800">*</span></label>
              <input type="text" value={skills} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Status <span className="text-pink-800">*</span></label>
              <input type="text" value={status} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Start Date <span className="text-pink-800">*</span></label>
              <input type="text" value={startdate.toISOString().split('T')[0]} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">End Date <span className="text-pink-800">*</span></label>
              <input type="text" value={enddate.toISOString().split('T')[0]} readOnly className="border-2 border-yellow-400 p-2 rounded w-full" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-4 items-center justify-center mt-8">
          <button onClick={() => navigate('/current_openings')} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
            Back
          </button>
          <button onClick={() => navigate('/edit_opening')} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
            Edit
          </button>
        </div>
      </div>
    </main>
  </div>
</div>

        </>
    );
}
export default View_opening;