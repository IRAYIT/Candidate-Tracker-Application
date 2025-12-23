import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { OPENINGCOLUMNS } from "./column";
import { GlobalFilter } from "./Globarfilter";
import axios from "axios";
import { ClipLoader } from "react-spinners";
function Current_openings() {
  const [permissionid, setPermissionid] = useState("");
  const [openings, setOpenings] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedOpeningId, setSelectedOpeningId] = useState(null);
const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const temp_permissionid = localStorage.getItem("permissionid");
    setPermissionid(temp_permissionid);
    getAllOpenings();
  }, []);
  useEffect(() => {
  document.body.style.overflow = showDeleteModal ? "hidden" : "auto";
}, [showDeleteModal]);

   const getAllOpenings = async () => {
    const res = await axios.get(`http://localhost:8098/api/v1/openings`);
   // console.log("Openings Data:", res.data);
    setOpenings(res.data);

  };
  const columns = useMemo(() => OPENINGCOLUMNS, []);
  const data = useMemo(() => openings, [openings]);
  const deleteopening = (openingId) =>
  {
    setLoading(true);
    axios
      .delete(`http://localhost:8098/api/v1/openings/${openingId}`)
      .then((res) => {
        if (res.status == 200) {
          getAllOpenings()
          setLoading(false);
        }
      });
  };
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
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-300">
          <Header />
        </header>

        <main className="flex-1 bg-white">
          <div className="flex px-10 py-5 items-center">
            <div className="flex-grow">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <div className="space-x-4">
              {permissionid == 1 && (
    <button
      className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-md px-4 py-2 hover:from-yellow-600 hover:to-yellow-500 cursor-pointer"
      onClick={() => navigate("/addopening")}
    >
      New Opening
    </button>
  )}
            </div>
          </div>
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
                          className="px-6 py-3 text-left text-sm font-bold tracking-wide bg-inherit"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                      <th className="px-6 py-3 text-left text-sm font-bold tracking-wide bg-inherit">ACTIONS</th>
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-sm flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            navigate("/resource_view");
                            localStorage.setItem("id", `${row.original.id}`);
                          }}
                          className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => {
                            navigate("/view_opening");
                            localStorage.setItem("opening_id", row.original.id);
                          }}
                          className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                        >
                          View
                        </button>
                        {permissionid == 1 && (
  <>
    <button
      className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
      onClick={() => navigate("/edit_opening")}
    >
      Edit
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

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
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
              <div className="space-x-2 flex items-center">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()} 
                  className="px-3 py-1 border border-gray-700 bg-white text-sm rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-700 bg-white text-sm rounded disabled:opacity-50 hover:bg-gray-100 cursor-pointer"
                >
                  Next
                </button>
                <span className="ml-2 text-sm text-gray-600">
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
            deleteopening(selectedOpeningId);
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
    </div>  );
}

export default Current_openings;
