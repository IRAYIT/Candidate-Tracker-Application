import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";

// Permission IDs: 1 = Admin, 2 = HR, 3 = Manager, 4 = Employee
//
// `matchPaths` lists every route that belongs to this module — the list
// page itself plus its add/edit/view sub-pages — so the parent nav item
// stays highlighted while the user is anywhere inside that module.
// If you add new sub-pages (e.g. a new "Add User" route), add its path
// here too.

const PERMISSIONS = {
  "1": [ // Admin — view, edit, delete
    {
      title: 'MANAGE USERS',
      path: '/manageresources',
      matchPaths: ['/manageresources', '/addresource', '/edit_resource', '/view_resource', '/adduser', '/edit_user', '/view_user'],
    },
    {
      title: 'CURRENT JOB OPENINGS',
      path: '/current_openings',
      matchPaths: ['/current_openings', '/addopening', '/edit_opening', '/view_opening'],
    },
    // { title: 'MANAGE PROJECTS', path: '/manageprojects' },
    {
      title: 'JOB APPLIED CANDIDATES',
      path: '/applied-candidates',
      matchPaths: ['/applied-candidates'],
    },
  ],
  "2": [ // HR — view, edit
    {
      title: 'MANAGE USERS',
      path: '/manageresources',
      matchPaths: ['/manageresources', '/addresource', '/edit_resource', '/view_resource', '/adduser', '/edit_user', '/view_user'],
    },
    {
      title: 'CURRENT JOB OPENINGS',
      path: '/current_openings',
      matchPaths: ['/current_openings', '/addopening', '/edit_opening', '/view_opening'],
    },
    // { title: 'MANAGE PROJECTS', path: '/manageprojects' },
    {
      title: 'JOB APPLIED CANDIDATES',
      path: '/applied-candidates',
      matchPaths: ['/applied-candidates'],
    },
  ],
  "3": [ // Manager — view, edit
    {
      title: 'MANAGE USERS',
      path: '/manageresources',
      matchPaths: ['/manageresources', '/addresource', '/edit_resource', '/view_resource', '/adduser', '/edit_user', '/view_user'],
    },
    {
      title: 'CURRENT JOB OPENINGS',
      path: '/current_openings',
      matchPaths: ['/current_openings', '/addopening', '/edit_opening', '/view_opening'],
    },
    // { title: 'MANAGE PROJECTS', path: '/manageprojects' },
    {
      title: 'JOB APPLIED CANDIDATES',
      path: '/applied-candidates',
      matchPaths: ['/applied-candidates'],
    },
  ],
  "4": [ // Employee — view only (own profile + openings + projects + applied)
    {
      title: 'MY PROFILE',
      path: '/manageresources',
      matchPaths: ['/manageresources', '/view_resource', '/view_user'],
    },
    {
      title: 'CURRENT JOB OPENINGS',
      path: '/current_openings',
      matchPaths: ['/current_openings', '/view_opening'],
    },
    // { title: 'MY PROJECTS', path: '/manageprojects' },
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
        // Stay highlighted for the module's own page and any of its
        // registered sub-pages (add/edit/view), not just an exact match.
        const matchPaths = item.matchPaths ?? [item.path];
        const isActive = matchPaths.includes(location.pathname);

        const handleClick = () => {
          // The "Applied" count link on Current Job Openings stashes an
          // opening filter in localStorage so Applied Candidates opens
          // pre-filtered. That filter should only apply for that one
          // entry point — navigating here from the sidebar means the
          // user wants to see every candidate, so clear any leftover
          // filter first.
          if (item.path === '/applied-candidates') {
            localStorage.removeItem("filter_opening_id");
            localStorage.removeItem("filter_opening_name");
          }
          navigate(item.path);
        };

        return (
          <p
            key={ind}
            onClick={handleClick}
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