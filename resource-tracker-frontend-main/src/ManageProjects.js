import Header from "./Header";
import Sidebar from "./Sidebar";
import { ClipLoader } from "react-spinners";
import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { GlobalFilter } from "./Globarfilter";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

function ManageProjects() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const selectedProjectIdRef = useRef(null);
  const [permissionid, setPermissionid] = useState(
    () => localStorage.getItem("permissionid") || ""
  );
  const [projects, setProjects] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pid = localStorage.getItem("permissionid");
    console.log("=== PERMISSION ID ===", pid);
    if (pid === "1" || pid === "2" || pid === "3") {
      fetchProjects();
    } else {
      fetchProjectByResource();
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = showDeleteModal ? "hidden" : "auto";
  }, [showDeleteModal]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`https://candidate-tracker-app-f9bsavbvf8anayfy.centralindia-01.azurewebsites.net/api/v1/projects/list`);
      console.log("=== PROJECTS FETCHED ===", res.data);
      if (res.data.length > 0) {
        console.log("=== FIRST PROJECT OBJECT ===", res.data[0]);
        console.log("=== ID FIELD ===", res.data[0].id);
      }
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  const fetchProjectByResource = async () => {
    try {
      const id = localStorage.getItem("employeeid");
      const res = await axios.get(
        `https://candidate-tracker-app-f9bsavbvf8anayfy.centralindia-01.azurewebsites.net/api/v1/projects/getProjectsByResourceId/${id}`
      );
      console.log("=== RESOURCE PROJECTS FETCHED ===", res.data);
      setProjects(res.data);
    } catch (error) {
      console.error("Failed to fetch resource projects", error);
    }
  };

  const deleteproject = async (projectId) => {
    console.log("=== DELETE CALLED ===");
    console.log("projectId:", projectId);

    if (!projectId) {
      console.error("❌ projectId is null/undefined — aborting");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete(
        `https://candidate-tracker-app-f9bsavbvf8anayfy.centralindia-01.azurewebsites.net/api/v1/projects/${projectId}`
      );
      console.log("=== DELETE RESPONSE ===", res.status, res.data);
      if (res.status === 200) {
        console.log("✅ Deleted successfully");
        const pid = localStorage.getItem("permissionid");
        if (pid === "1" || pid === "2" || pid === "3") {
          fetchProjects();
        } else {
          fetchProjectByResource();
        }
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("❌ Delete error:", error.response?.status, error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    { id: 'name', accessorKey: 'name' },
    { id: 'status', accessorKey: 'status' },
    {
      id: 'technology',
      accessorFn: (row) => (row.projectRoles || []).map((r) => r.technology).filter(Boolean).join(' '),
    },
    {
      id: 'developers',
      accessorFn: (row) => (row.projectRoles || []).flatMap((r) => r.resourceNames || []).join(' '),
    },
  ], []);

  const data = useMemo(() => projects, [projects]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="min-h-screen flex">
        <aside className="w-64 flex-shrink-0 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
          <Sidebar />
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-gray-300">
            <Header />
          </header>

          <main className="flex-1 bg-white">
            <div className="flex px-10 py-5 items-center">
              <div className="flex-grow">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
              </div>
              {(permissionid === "1" || permissionid === "2") && (
                <button
                  className="cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-md px-4 py-2 hover:from-yellow-600 hover:to-yellow-500"
                  onClick={() => navigate("/addproject")}
                >
                  Add Project
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-[400px]">
                <ClipLoader size={60} color="#FACC15" />
              </div>
            ) : (
              <div className="mx-4 my-6 rounded-lg border border-gray-300 bg-white shadow flex flex-col" style={{ height: 500 }}>

                <div className="overflow-auto flex-1">
                  <table className="w-full table-fixed border-collapse">
                    <colgroup>
                      <col style={{ width: "16%" }} />
                      <col style={{ width: "18%" }} />
                      <col style={{ width: "34%" }} />
                      <col style={{ width: "12%" }} />
                      <col style={{ width: "20%" }} />
                    </colgroup>

                    <thead className="bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 text-white sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wide">PROJECT NAME</th>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wide">TECHNOLOGY</th>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wide">DEVELOPERS</th>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wide">STATUS</th>
                        <th className="px-4 py-3 text-left text-sm font-bold tracking-wide">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 bg-white">
                      {table.getRowModel().rows.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                            No projects found.
                          </td>
                        </tr>
                      ) : (
                        table.getRowModel().rows.map((row) => {
                          const p = row.original;

                          const techs = [...new Set(
                            (p.projectRoles || []).map((r) => r.technology).filter(Boolean)
                          )].join(', ') || '—';

                          const devs = [...new Set(
                            (p.projectRoles || []).flatMap((r) => r.resourceNames || []).filter(Boolean)
                          )].join(', ') || '—';

                          return (
                            <tr key={row.id} className="hover:bg-gray-50 transition">
                              <td className="px-4 py-3 text-sm text-gray-800 font-medium align-middle">
                                {p.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 align-middle">
                                {techs}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 align-middle">
                                {devs}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 align-middle">
                                {p.status || '—'}
                              </td>
                              <td className="px-4 py-3 text-sm align-middle">
                                <div className="flex gap-2 items-center">
                                  <button
                                    onClick={() => {
                                      navigate("/view_project");
                                      localStorage.setItem("projectid", p.id);
                                    }}
                                    className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                                  >
                                    View
                                  </button>
                                  {(permissionid === "1" || permissionid === "2" || permissionid === "3") && (
                                    <button
                                      onClick={() => {
                                        localStorage.setItem("projectid", p.id);
                                        navigate("/edit_project");
                                      }}
                                      className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                  )}
                                  {permissionid === "1" && (
                                    <button
                                      onClick={() => {
                                        console.log("=== DELETE BUTTON CLICKED ===");
                                        console.log("Full project object p:", p);
                                        console.log("p.id:", p.id);
                                        selectedProjectIdRef.current = p.id;
                                        setSelectedProjectId(p.id);
                                        setShowDeleteModal(true);
                                      }}
                                      className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 flex-shrink-0">
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    {[5, 10, 20].map((size) => (
                      <option key={size} value={size}>Show {size}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="px-3 py-1 bg-gray-900 text-white rounded text-sm disabled:opacity-50 cursor-pointer"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 text-sm disabled:opacity-50 cursor-pointer"
                    >
                      Next
                    </button>
                    <span className="text-gray-600 ml-2">
                      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                  </div>
                </div>

              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Modal — inline styles to bypass any Tailwind purge or z-index issues */}
      {showDeleteModal && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              width: '350px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <h2 style={{ color: '#1d4ed8', fontWeight: '600', fontSize: '18px', marginBottom: '16px' }}>
              Confirm Deletion
            </h2>
            <p style={{ color: '#374151', marginBottom: '24px' }}>
              Are you sure you want to delete this project?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => {
                  console.log("=== YES DELETE CLICKED ===");
                  console.log("selectedProjectIdRef.current:", selectedProjectIdRef.current);
                  deleteproject(selectedProjectIdRef.current);
                }}
              >
                Yes, Delete
              </button>
              <button
                style={{
                  backgroundColor: '#d1d5db',
                  color: '#111827',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default ManageProjects;