import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

// Permission IDs: 1 = Admin, 2 = HR, 3 = Manager, 4 = Employee

const PERMISSIONS = {
  "1": [ // Admin — view, edit, delete
    { title: 'MANAGE CANDIDATES', path: '/manageresources' },
    { title: 'CURRENT JOB OPENINGS', path: '/current_openings' },
    { title: 'MANAGE PROJECTS', path: '/manageprojects' },
    { title: 'APPLIED CANDIDATES', path: '/applied-candidates' },
  ],
  "2": [ // HR — view, edit
    { title: 'MANAGE CANDIDATES', path: '/manageresources' },
    { title: 'CURRENT JOB OPENINGS', path: '/current_openings' },
    { title: 'MANAGE PROJECTS', path: '/manageprojects' },
    { title: 'APPLIED CANDIDATES', path: '/applied-candidates' },
  ],
  "3": [ // Manager — view, edit
    { title: 'MANAGE CANDIDATES', path: '/manageresources' },
    { title: 'CURRENT JOB OPENINGS', path: '/current_openings' },
    { title: 'MANAGE PROJECTS', path: '/manageprojects' },
    { title: 'APPLIED CANDIDATES', path: '/applied-candidates' },
  ],
  "4": [ // Employee — view only (own profile + openings + projects + applied)
    { title: 'MY PROFILE', path: '/manageresources' },
    { title: 'CURRENT JOB OPENINGS', path: '/current_openings' },
    { title: 'MY PROJECTS', path: '/manageprojects' },
    { title: 'APPLIED CANDIDATES', path: '/applied-candidates' },
  ],
};

function Sidebar() {
  const [sidebarItems, setSidebarItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const permissionId = localStorage.getItem("permissionid");
    setSidebarItems(PERMISSIONS[permissionId] ?? []);
  }, []);

  return (
    <div className="p-4 flex flex-col h-full min-h-screen">
      <p className="text-lg font-bold text-yellow-500 mb-4">CANDIDATE TRACKER</p>

      {sidebarItems.map((item, ind) => {
        const isActive = location.pathname === item.path;
        return (
          <p
            key={ind}
            onClick={() => navigate(item.path)}
            style={{ color: isActive ? '#facc15' : '#111827' }}
            onMouseEnter={e => e.target.style.color = '#facc15'}
            onMouseLeave={e => e.target.style.color = isActive ? '#facc15' : '#111827'}
            className="cursor-pointer font-bold mb-2 transition-colors md:py-6"
          >
            {item.title}
          </p>
        );
      })}
    </div>
  );
}

export default Sidebar;