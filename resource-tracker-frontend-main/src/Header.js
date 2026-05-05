import { useEffect,useState ,useRef} from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
function Header()
{
    const [role,setRole]=useState('');
    const [resourcename,setResourcename]=useState('');
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate=useNavigate();
useEffect(() => {
    const temp_permissionid = localStorage.getItem("permissionid");
    const temp_firstname = localStorage.getItem("firstName");
    const temp_lastname = localStorage.getItem("lastName");
    setResourcename(`${temp_firstname} ${temp_lastname}`);

    // Updated mapping: 1=Admin, 2=HR, 3=Manager, 4=Employee
    const roleMap = {
        "1": "Admin",
        "2": "HR",
        "3": "Manager",
        "4": "Employee",
    };
    setRole(roleMap[temp_permissionid] ?? "Applicant");

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
    const toggleMenu = () => setIsOpen(!isOpen);
    return(
  <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-400 to-yellow-400 shadow">
      <div className="flex space-x-6 text-gray-800 font-medium text-sm">
        <p>Current Role: {role}</p>
        <p>Resource Name: {resourcename}</p>
      </div>

      <div className="relative inline-block text-left" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none cursor-pointer"
        >
          {isOpen ? (
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gradient-to-r from-blue-400 to-yellow-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1 text-sm text-gray-700">
              <button className="block w-full text-left px-4 py-2 hover:bg-white/50 cursor-pointer" onClick={() =>navigate('/myprofile')}>
                My Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-white/50 cursor-pointer" onClick={() =>navigate('/editprofile')}>
                Edit Profile
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-white/50 cursor-pointer">
                Change Picture
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-white/50 cursor-pointer">
                Change Password
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-semibold cursor-pointer" onClick={() =>navigate('/')}>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
    
export default Header;