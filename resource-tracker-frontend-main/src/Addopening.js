import Header from "./Header";
import Sidebar from "./Sidebar";
import { useEffect,useState } from "react";
import {ClipLoader} from "react-spinners";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Addopening()
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
    const [creatorName,setCreatorName]=useState(localStorage.getItem("resourceName"));
    const [startdate,setStartdate]=useState(new Date);
    const navigate=useNavigate();
    const [customTech,setCustomTech]=useState('');
    const [errors,setErrors]=useState('');
    const [loading,setLoading]=useState(false);
    const [enddate, setEnddate] = useState(() => {
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
  return oneYearLater;
  });
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

  const createopening = () =>
  {
    const newErrors = validateFields();
setErrors(newErrors);

if (Object.keys(newErrors).length > 0) {
  return; // Stop submission
}
setLoading(true);
    if(openingname && hours && shifttimings && payment && paymenttype && technology && experience && employmenttype && skills && status)
    {
     var payload = {
            name: openingname,
            hours: hours,
            payment: payment,
            paymentType: paymenttype,
            shiftTimings: shifttimings,
            startDate: startdate,
            endDate: enddate,
            skill: skills,
              technology: technology,
            experience: experience,
            employmentType: employmenttype,
            status: status,
            createdAt: new Date(),
            createdBy: creatorName,
            updatedAt: new Date(),
            updatedBy: creatorName,
          };
     axios
            .post("http://localhost:8098/api/v1/openings", payload)
            .then((res) => {
             navigate('/current_openings');
            });
        }
        else 
        {
            setErrors("Fill all Mandatory Fields");
        }
  }
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
          Add Opening
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
            <input
  type="text"
  value={openingname}
  placeholder="Enter name"
  onChange={(e) => {
    setOpeningname(e.target.value);
    if (errors.openingname) setErrors(prev => ({ ...prev, openingname: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.openingname ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.openingname && <p className="text-red-600 text-sm mt-1">{errors.openingname}</p>}
</div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Hours <span className="text-pink-800">*</span></label>
            <input
  type="text"
  value={hours}
  placeholder="Enter hours"
  onChange={(e) => {
    setHours(e.target.value);
    if (errors.hours) setErrors(prev => ({ ...prev, hours: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.hours ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.hours && <p className="text-red-600 text-sm mt-1">{errors.hours}</p>}
 </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Shift Timings <span className="text-pink-800">*</span></label>
             <input
  type="text"
  value={shifttimings}
  placeholder="Enter timings"
  onChange={(e) => {
    setShifttimings(e.target.value);
    if (errors.shifttimings) setErrors(prev => ({ ...prev, shifttimings: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.shifttimings ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.shifttimings && <p className="text-red-600 text-sm mt-1">{errors.shifttimings}</p>}
</div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Payment <span className="text-pink-800">*</span></label>
            
            <input
  type="text"
  value={payment}
  placeholder="Enter payment"
  onChange={(e) => {
    setPayment(e.target.value);
    if (errors.payment) setErrors(prev => ({ ...prev, payment: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.payment ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.payment && <p className="text-red-600 text-sm mt-1">{errors.payment}</p>}
</div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Payment Type <span className="text-pink-800">*</span></label>
         <input
  type="text"
  value={paymenttype}
  placeholder="Enter type"
  onChange={(e) => {
    setPaymenttype(e.target.value);
    if (errors.paymenttype) setErrors(prev => ({ ...prev, paymenttype: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.paymenttype ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.paymenttype && <p className="text-red-600 text-sm mt-1">{errors.paymenttype}</p>}
   </div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Technology <span className="text-pink-800">*</span></label>
             <select
  value={technology}
  onChange={(e) => {
    setTechnology(e.target.value);
    if (errors.technology) setErrors(prev => ({ ...prev, technology: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.technology ? 'border-red-500' : 'border-yellow-400'
  }`}
>
  <option value="">Select Technology</option>
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
{errors.technology && <p className="text-red-600 text-sm mt-1">{errors.technology}</p>}


      {technology === 'Other' && (
        <div className="p-2">
        <input
          type="text"
          
         className="border-2 border-yellow-400 p-2 rounded w-full "
          placeholder="Enter custom technology"
          value={customTech}
          onChange={(e) => setCustomTech(e.target.value)}
        />
        </div>
      )}</div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Experience <span className="text-pink-800">*</span></label>
            <input
  type="text"
  value={experience}
  placeholder="Enter experience"
  onChange={(e) => {
    setExperience(e.target.value);
    if (errors.experience) setErrors(prev => ({ ...prev, experience: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.experience ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.experience && <p className="text-red-600 text-sm mt-1">{errors.experience}</p>}
</div>
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Employment Type <span className="text-pink-800">*</span></label>
            <select
  value={employmenttype}
  onChange={(e) => {
    setEmploymenttype(e.target.value);
    if (errors.employmenttype) setErrors(prev => ({ ...prev, employmenttype: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.employmenttype ? 'border-red-500' : 'border-yellow-400'
  }`}
>
  <option value="">Select Employment Type</option>
  <option value="Freelancing">Freelancing</option>
  <option value="Consultant">Consultant</option>
  <option value="Sweden-FullTime">Sweden-FullTime</option>
  <option value="India-FullTime">India-FullTime</option>
  <option value="USA-FullTime">USA-FullTime</option>
</select>
{errors.employmenttype && <p className="text-red-600 text-sm mt-1">{errors.employmenttype}</p>}

             </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
            <div className="w-full md:w-[48%]">
              <label className="font-semibold mb-1">Skills <span className="text-pink-800">*</span></label>
             <input
  type="text"
  value={skills}
  placeholder="Enter skills"
  onChange={(e) => {
    setSkills(e.target.value);
    if (errors.skills) setErrors(prev => ({ ...prev, skills: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.skills ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
</div>
            <div className="w-full md:w-[48%]">
  <label className="font-semibold mb-1">
    Status <span className="text-pink-800">*</span>
  </label>
 <select
  value={status}
  onChange={(e) => {
    setStatus(e.target.value);
    if (errors.status) setErrors(prev => ({ ...prev, status: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.status ? 'border-red-500' : 'border-yellow-400'
  }`}
>
  <option value="">Select Status</option>
  <option value="Open">OPEN</option>
  <option value="Close">CLOSE</option>
</select>
{errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}

</div>
          </div>

          <div className="flex flex-wrap gap-4 justify-between">
           <div className="w-full">
  <label className="font-semibold mb-1">
    Start Date <span className="text-pink-800">*</span>
  </label>
  <input
  type="date"
  value={startdate.toISOString().split('T')[0]}
  onChange={(e) => {
    setStartdate(new Date(e.target.value));
    if (errors.startdate) setErrors(prev => ({ ...prev, startdate: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.startdate ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.startdate && <p className="text-red-600 text-sm mt-1">{errors.startdate}</p>}

</div>

<div className="w-full ">
  <label className="font-semibold mb-1">
    End Date <span className="text-pink-800">*</span>
  </label>
  <input
  type="date"
  value={enddate.toISOString().split('T')[0]}
  onChange={(e) => {
    setEnddate(new Date(e.target.value));
    if (errors.enddate) setErrors(prev => ({ ...prev, enddate: '' }));
  }}
  className={`border-2 p-2 rounded w-full ${
    errors.enddate ? 'border-red-500' : 'border-yellow-400'
  }`}
/>
{errors.enddate && <p className="text-red-600 text-sm mt-1">{errors.enddate}</p>}

</div>

          </div>
        </div>
    )}
        <div className="flex gap-4 p-4 items-center justify-center mt-8">
          <button onClick={() => navigate('/current_openings')} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
            Back
          </button>
          <button onClick={createopening} className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer">
            Create
          </button>
        </div>
    
      </div>
    </main>
  </div>
</div>
    );
}
export default Addopening;