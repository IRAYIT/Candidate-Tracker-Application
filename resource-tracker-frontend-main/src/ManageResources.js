import Header from "./Header";
import Sidebar from "./Sidebar";
import { GlobalFilter } from "./Globarfilter";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MANAGERESOURCECOLUMNS } from "./column";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

function ManageResources() {
  const [permissionid, setPermissionid] = useState("");
  const [resources, setResources] = useState([]);
  const [id, setId] = useState(localStorage.getItem("employeeid"));
  //const [globalFilter, setGlobalFilter] = useState(""); // ✅ added
  const [globalFilter, setGlobalFilter] = useState('');
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedOpeningId, setSelectedOpeningId] = useState(null);
  useEffect(() => {
    let temp_permissionid = localStorage.getItem("permissionid");
    setPermissionid(temp_permissionid);
  }, []);

  useEffect(() => {
    console.log(id);
    const fetchResources = async () => {
      try {
        if (permissionid == "1") {
          const res = await axios.get(`http://localhost:8098/api/v1/resource/list`);
          console.log(res.data);
          const activeResources = res.data?.filter(
            (resource) =>  resource.status?.toLowerCase() !== 'terminated' && resource.permissionId != "1"
          ) || [];
          setResources(transformResourceData(activeResources));
        } else if (permissionid == "2") {
          const res = await axios.get(`http://localhost:8098/api/v1/resource/getAllResourcesByManagerId/${id}`);
          console.log(res.data);
          const activeResources = res.data.filter((resource) => resource.status?.toLowerCase() !== "terminated");
          setResources(transformResourceData(activeResources));
        } else {
          const res = await axios.get(`http://localhost:8098/api/v1/resource/${id}`);
          setResources([res.data]);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    if (permissionid) {
      fetchResources();
    }
  }, [permissionid, id]);

  const transformResourceData = (resources) => {
    return resources.map((res) => {
      const skillArray = res.skill?.split(",").map((s) => s.trim()).filter(Boolean) || [];
      return {
        ...res,
        skill: skillArray.slice(0, 2).join(", "),
        technology: res.technology === "OTHER" ? res.customTechnology || "OTHER" : res.technology,
      };
    });
  };
 const deleteRes = async (resourceId) => {
  try {
    setLoading(true);
    const deleteResponse = await axios.delete(`http://localhost:8098/api/v1/resource/${resourceId}`);
    
    if (deleteResponse.status === 200) {
      let response;

      if (permissionid == "1") {
        response = await axios.get(`http://localhost:8098/api/v1/resource/list`);
        const activeResources = response.data?.filter(
          (resource) => resource.status?.toLowerCase() !== 'terminated' && resource.permissionId != "1"
        ) || [];
        setResources(transformResourceData(activeResources));
        setLoading(false);

      } else if (permissionid == "2") {
        
        response = await axios.get(`http://localhost:8098/api/v1/resource/getAllResourcesByManagerId/${id}`);
        const activeResources = response.data.filter(
          (resource) => resource.status?.toLowerCase() !== "terminated"
        );
        setResources(transformResourceData(activeResources));
        setLoading(false);

      } else {
        response = await axios.get(`http://localhost:8098/api/v1/resource/${id}`);
        setResources([response.data]);
        setLoading(false);
      }
    }
  } catch (error) {
    console.error("Error deleting resource or fetching updated data:", error);
  }
};
 const columns = useMemo(() => MANAGERESOURCECOLUMNS, []);
  const data = useMemo(() => resources, [resources]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
   <div className="min-h-screen flex bg-gray-50 text-gray-800">
     <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
    <Sidebar />
  </aside>

  <div className="flex-1 flex flex-col">

    <header className="border-b border-gray-200 bg-white">
      <Header />
    </header>

    <main className="flex-1 bg-gray-50 p-6">

      <div className="flex items-center justify-between mb-6">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        <div className="space-x-3">
  {permissionid == 1 && (
    <button
      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-md px-4 py-2 font-medium hover:from-yellow-500 hover:to-yellow-700 transition cursor-pointer"
      onClick={() => navigate('/emailall')}
    >
      Email All
    </button>
  )}
  {permissionid != 3 && (
    <button
      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-md px-4 py-2 font-medium hover:from-yellow-500 hover:to-yellow-700 transition cursor-pointer"
      onClick={() => navigate('/addresource')}
    >
      Add Resource
    </button>
  )}
</div>
      </div>
{/* Table */}
       {loading ? (
      <div className="flex justify-center items-center h-[400px]">
    <ClipLoader size={60} color="#FACC15" />
  </div>
    ) : (

       <div className="mx-4 my-6 p-5 rounded-lg border border-gray-300 bg-white shadow h-[500px] flex flex-col">
       <div className="overflow-auto flex-grow">
          <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 text-white sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm">
  <div className="flex gap-2 flex-nowrap overflow-x-auto">
    <button
      onClick={() => {
        navigate("/resource_view");
        localStorage.setItem("rid", `${row.original.id}`);
      }}
      className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
    >
      View
    </button>

    <button
      onClick={() => {navigate("/resource_edit"); localStorage.setItem("temp_id_for_use",`${row.original.id}`)}}
      className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
    >
      Edit
    </button>

    <button className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer" onClick={() =>{localStorage.setItem("attachments_id",`${row.original.id}`); navigate('/attachments')}}>
      Attachments
    </button>

   {permissionid != 3 && (
  <>
    <button
      className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
      onClick={() => {
        navigate('/sendemail');
        localStorage.setItem("emp_email", `${row.original.email}`);
      }}
    >
      Email Me
    </button>

    <button
      className="px-3 py-1 rounded border text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
       onClick={() => {
  setSelectedOpeningId(row.original.id);
  setShowDeleteModal(true);
}}
    >
      Delete
    </button>
  </>
)}

  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-100">
          <div>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
            <span className="ml-2 text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
          </div>
        </div>
      </div>
    )}
    </main>
    
    {showDeleteModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
    }}
  >
    <div
      className="bg-white rounded-lg shadow-lg text-center"
      style={{
        width: "350px",
        padding: "24px",
      }}
    >
      <h2 className="text-lg font-semibold text-blue-700 mb-4">Confirm Deletion</h2>
      <p className="text-gray-700 mb-6">Are you sure you want to delete this opening?</p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          onClick={() => {
            deleteRes(selectedOpeningId);
            setShowDeleteModal(false);
          }}
        >
          Yes, Delete
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-md"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
  </div>
</div>

  );
}

export default ManageResources;