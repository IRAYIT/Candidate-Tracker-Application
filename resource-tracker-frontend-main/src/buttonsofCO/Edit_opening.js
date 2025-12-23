import Header from "../Header";
import Sidebar from "../Sidebar";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import {ClipLoader} from "react-spinners";
import axios from "axios";
function Edit_opening()
{
     const [openingname,setOpeningname]=useState('');
      const [creatorName,setCreatorName]=useState(localStorage.getItem("resourceName"));
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
    const [errors,setErrors]=useState('');
    const [customTech,setCustomTech]=useState('');
    const [loading,setLoading]=useState(false);
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
        if(technology==='Other')
        {
        setCustomTech(res.data.technology);
        }
        setSkills(res.data.skill);
        setEmploymenttype(res.data.employmentType);
        setExperience(res.data.experience);
        setStatus(res.data.status);
      });
    },[]);
     const validateFields = () => {
  const newErrors = {};

  if (!technology?.trim()) newErrors.technology = "Technology is required.";
  if (!experience?.toString().trim() || isNaN(experience) || experience < 0) newErrors.experience = "Valid experience is required.";
  if (!status) newErrors.status = "Status is required.";

  // New field validations
  if (!openingname?.trim()) newErrors.openingname = "Opening name is required.";
  if (!hours?.trim()) newErrors.hours = "Hours are required.";
  if (!shifttimings?.trim()) newErrors.shifttimings = "Shift timings are required.";
  if (!payment?.trim()) newErrors.payment = "Payment is required.";
  if (!paymenttype?.trim()) newErrors.paymenttype = "Payment type is required.";
  if (!technology?.trim()) newErrors.technology = "Technology is required.";
  if (!experience?.toString().trim() || isNaN(experience) || experience < 0) newErrors.experience = "Valid experience is required.";
  if (!employmenttype?.trim()) newErrors.employmenttype = "Employment type is required.";
  if (!skills?.trim()) newErrors.skills = "Skills are required.";
  if (!status?.trim()) newErrors.status = "Status is required.";
  if (!startdate) newErrors.startdate = "Start date is required.";
  if (!enddate) newErrors.enddate = "End date is required.";

  return newErrors;
};
    const editopening = () =>
    {
      const newErrors = validateFields();
setErrors(newErrors);

if (Object.keys(newErrors).length > 0) {
  return; // Stop submission
}
setLoading(true);
      const finalTech = technology === 'Other' ? `Other,${customTech}` : technology;
         var payload = {
          id: openingId,
          name: openingname,
          hours: hours,
          payment: payment,
          paymentType: paymenttype,
          shiftTimings: shifttimings,
          startDate: startdate,
          endDate: enddate,
          skill: skills,
          technology: finalTech,
          experience: experience,
          employmentType: employmenttype,
          status: status,
          createdAt: new Date(),
          createdBy: creatorName,
          updatedAt: new Date(),
          updatedBy: creatorName,
        };
        axios
          .put("http://localhost:8098/api/v1/openings", payload)
          .then((res) => {
            navigate('/current_openings');
          });

    }
    return(
       <div className="min-h-screen flex flex-col bg-white">
  <header className="shadow z-10">
    <Header />
  </header>

  <div className="flex flex-1">
    <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
      <Sidebar />
    </aside>

    <main className="flex-1 p-4 bg-white">
      <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
          Edit Opening
        </h2>
        {loading ? (
      <div className="flex justify-center items-center h-[400px]">
    <ClipLoader size={60} color="#FACC15" />
  </div>
    ) : (
        <div className="space-y-6">
  <div className="flex flex-wrap gap-4 justify-between">
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Opening Name <span className="text-pink-800">*</span></label>
      <input type="text" value={openingname} placeholder="Enter name"
        onChange={(e) => { setOpeningname(e.target.value); setErrors(prev => ({ ...prev, openingname: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.openingname && <p className="text-red-600 text-sm">{errors.openingname}</p>}
    </div>

    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Hours <span className="text-pink-800">*</span></label>
      <input type="text" value={hours} placeholder="Enter hours"
        onChange={(e) => { setHours(e.target.value); setErrors(prev => ({ ...prev, hours: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.hours && <p className="text-red-600 text-sm">{errors.hours}</p>}
    </div>
  </div>

  <div className="flex flex-wrap gap-4 justify-between">
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Shift Timings <span className="text-pink-800">*</span></label>
      <input type="text" value={shifttimings} placeholder="Enter timings"
        onChange={(e) => { setShifttimings(e.target.value); setErrors(prev => ({ ...prev, shifttimings: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.shifttimings && <p className="text-red-600 text-sm">{errors.shifttimings}</p>}
    </div>

    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Payment <span className="text-pink-800">*</span></label>
      <input type="text" value={payment} placeholder="Enter payment"
        onChange={(e) => { setPayment(e.target.value); setErrors(prev => ({ ...prev, payment: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.payment && <p className="text-red-600 text-sm">{errors.payment}</p>}
    </div>
  </div>

  <div className="flex flex-wrap gap-4 justify-between">
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Payment Type <span className="text-pink-800">*</span></label>
      <input type="text" value={paymenttype} placeholder="Enter type"
        onChange={(e) => { setPaymenttype(e.target.value); setErrors(prev => ({ ...prev, paymenttype: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.paymenttype && <p className="text-red-600 text-sm">{errors.paymenttype}</p>}
    </div>

    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Technology <span className="text-pink-800">*</span></label>
      <select
        id="technology"
        value={technology}
        onChange={(e) => {
          setTechnology(e.target.value);
          setErrors(prev => ({ ...prev, technology: '' }));
        }}
        name="technology"
        className="border-2 border-yellow-400 p-2 rounded w-full"
      >
        <option value="">Select technology</option>
        <option value="JAVA">JAVA</option>
        <option value="DOTNET">DOTNET</option>
        <option value="TESTING">TESTING</option>
        <option value="ANGULAR">ANGULAR</option>
        <option value="REACTJS">REACTJS</option>
        <option value="AWS DEVOPS">AWS DEVOPS</option>
        <option value="AZURE DEVOPS">AZURE DEVOPS</option>
        <option value="SQL DEVELOPER">SQL DEVELOPER</option>
        <option value="Other">Other</option>
      </select>
      {technology === 'Other' && (
        <div className="p-2">
          <input
            type="text"
            className="border-2 border-yellow-400 p-2 rounded w-full"
            placeholder="Enter custom technology"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
          />
        </div>
      )}
      {errors.technology && <p className="text-red-600 text-sm">{errors.technology}</p>}
    </div>
  </div>

  <div className="flex flex-wrap gap-4 justify-between">
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Experience <span className="text-pink-800">*</span></label>
      <input type="text" value={experience} placeholder="Enter experience"
        onChange={(e) => { setExperience(e.target.value); setErrors(prev => ({ ...prev, experience: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.experience && <p className="text-red-600 text-sm">{errors.experience}</p>}
    </div>

    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Employment Type <span className="text-pink-800">*</span></label>
      <select
        id="employmenttype"
        value={employmenttype}
        onChange={(e) => { setEmploymenttype(e.target.value); setErrors(prev => ({ ...prev, employmenttype: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full"
        name="employmentType"
      >
        <option value="">Select employment type</option>
        <option value="Freelancing">Freelancing</option>
        <option value="Consultant">Consultant</option>
        <option value="Sweden-FullTime">Sweden-FullTime</option>
        <option value="India-FullTime">India-FullTime</option>
        <option value="USA-FullTime">USA-FullTime</option>
      </select>
      {errors.employmenttype && <p className="text-red-600 text-sm">{errors.employmenttype}</p>}
    </div>
  </div>

  <div className="flex flex-wrap gap-4 justify-between">
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Skills <span className="text-pink-800">*</span></label>
      <input type="text" value={skills} placeholder="Enter skills"
        onChange={(e) => { setSkills(e.target.value); setErrors(prev => ({ ...prev, skills: '' })); }}
        className="border-2 border-yellow-400 p-2 rounded w-full" />
      {errors.skills && <p className="text-red-600 text-sm">{errors.skills}</p>}
    </div>

    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Status <span className="text-pink-800">*</span></label>
      <select
        className="border-2 border-yellow-400 p-2 rounded w-full"
        value={status}
        onChange={(e) => { setStatus(e.target.value); setErrors(prev => ({ ...prev, status: '' })); }}
        name="status"
      >
        <option value="">Select status</option>
        <option value="Open">OPEN</option>
        <option value="Close">CLOSE</option>
      </select>
      {errors.status && <p className="text-red-600 text-sm">{errors.status}</p>}
    </div>
  </div>

  <div className="flex flex-wrap gap-4 justify-between">
    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">Start Date <span className="text-pink-800">*</span></label>
      <input
        type="date"
        value={startdate.toISOString().split('T')[0]}
        onChange={(e) => {
          setStartdate(new Date(e.target.value));
          setErrors(prev => ({ ...prev, startdate: '' }));
        }}
        className="border-2 border-yellow-400 p-2 rounded w-full"
      />
      {errors.startdate && <p className="text-red-600 text-sm">{errors.startdate}</p>}
    </div>

    <div className="w-full md:w-[48%]">
      <label className="font-semibold mb-1">End Date <span className="text-pink-800">*</span></label>
      <input
        type="date"
        value={enddate.toISOString().split('T')[0]}
        onChange={(e) => {
          setEnddate(new Date(e.target.value));
          setErrors(prev => ({ ...prev, enddate: '' }));
        }}
        className="border-2 border-yellow-400 p-2 rounded w-full"
      />
      {errors.enddate && <p className="text-red-600 text-sm">{errors.enddate}</p>}
    </div>
  </div>
</div>
    )}
        <div className="flex gap-4 p-4 items-center justify-center mt-8">
          <button
            onClick={() => navigate('/current_openings')}
            className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={editopening}
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
export default Edit_opening;