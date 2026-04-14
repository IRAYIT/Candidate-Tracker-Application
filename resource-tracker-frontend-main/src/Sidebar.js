import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
function Sidebar()
{
    const [sidebarofuser,setSidebarofuser]=useState([]);
    const navigate=useNavigate();
    let permission1=[
        {title :' MANAGE CANDIDATES', path:'/manageresources'},
        {title :'CURRENT JOB OPENINGS', path:'/current_openings'},
        {title :'MANAGE PROJECTS', path:'/manageprojects'},
        {title :'APPLIED CANDIDATES', path:'/applied-candidates'}
    ]
    let permission2=[
        {title :'MANAGE RESOURCES', path:'/manageresources'},
        {title :'CURRENT JOB OPENINGS', path:'/current_openings'},
        {title :'MANAGE PROJECTS', path:'/manageprojects'},
        {title :'APPLIED CANDIDATES', path:'/applied-candidates'}
    ]
    let permission3=[
        {title :'My Profile', path:'/manageresources'},
        {title :'CURRENT JOB OPENINGS', path:'/current_openings'},
        {title :'My Projects', path:'/manageprojects'},
        {title :'Applied Openings', path:'/manageresources'},
        {title :'APPLIED CANDIDATES', path:'/applied-candidates'}
    ]
    let permission4=[
        {title :'MANAGE RESOURCES', path:'/manageresources'},
        {title :'CURRENT JOB OPENINGS', path:'/current_openings'},
        {title :'MANAGE PROJECTS', path:'/manageprojects'},
        {title :'APPLIED CANDIDATES', path:'/applied-candidates'}
    ]
    let permission5=[
        {title :'CURRENT JOB OPENINGS', path:'/current_openings'},
        {title :'MANAGE PROJECTS', path:'/manageprojects'},
        {title :'APPLIED CANDIDATES', path:'/applied-candidates'}
    ]
    useEffect(() =>
    {
        let temp_permissionid=localStorage.getItem("permissionid");
        if(temp_permissionid==='1')
        {
            setSidebarofuser(permission1);
        }
        else if(temp_permissionid==="2")
        {
            setSidebarofuser(permission2);
        }
        else if(temp_permissionid==="3")
        {
            setSidebarofuser(permission3);
        }
        else if(temp_permissionid==="4")
        {
            setSidebarofuser(permission4);
        }
        else 
        {
            setSidebarofuser(permission5);
        }
    },[])
    
      return (
   <div className="p-4 flex flex-col text-gray-900 h-full min-h-screen">
      <p className="text-lg font-bold text-yellow-500 mb-4">CANDIDATE TRACKER</p>

      {sidebarofuser.map((item, ind) => (
        <p
          key={ind}
          onClick={() => navigate(item.path)}
          className="cursor-pointer font-bold hover:text-yellow-400 mb-2 transition-colors md:py-6"
        >
          {item.title}
        </p>
      ))}
    </div>
  );
}
export default Sidebar;