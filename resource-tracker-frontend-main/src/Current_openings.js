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
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedOpeningId, setSelectedOpeningId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const temp_permissionid = localStorage.getItem("permissionid");
    setPermissionid(temp_permissionid);
    getAllOpenings(temp_permissionid);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (showDeleteModal || showRestoreModal) ? "hidden" : "auto";
  }, [showDeleteModal, showRestoreModal]);

  const getAllOpenings = async (pid = permissionid) => {
    const url = pid === "1"
      ? `https://candidate-tracker-iray-bhgbahe3bjame4gv.centralindia-01.azurewebsites.net/api/v1/openings/all`
      : `https://candidate-tracker-iray-bhgbahe3bjame4gv.centralindia-01.azurewebsites.net/api/v1/openings`;
    const res = await axios.get(url);

    // Sort: ACTIVE first, TERMINATED after
    const sorted = [...res.data].sort((a, b) => {
      if (a.status === "ACTIVE" && b.status !== "ACTIVE") return -1;
      if (a.status !== "ACTIVE" && b.status === "ACTIVE") return 1;
      return 0;
    });

    setOpenings(sorted);
  };

  // Toggle between the Active view (everything except TERMINATED) and the
  // Trash view (TERMINATED/closed openings only). Both views are derived
  // client-side from the same `/all` fetch, since admins already get every
  // status in one response.
  const toggleTrashView = () => {
    setShowTrash((prev) => !prev);
    setGlobalFilter("");
  };

  // Pass the current search term into the columns so cell renderers can
  // highlight matching text in the visible results.
  const columns = useMemo(
    () => OPENINGCOLUMNS(permissionid, globalFilter),
    [permissionid, globalFilter]
  );

  const data = useMemo(
    () =>
      openings.filter((o) =>
        showTrash ? o.status === "TERMINATED" : o.status !== "TERMINATED"
      ),
    [openings, showTrash]
  );

  const deleteopening = (openingId) => {
    setLoading(true);
    axios
      .delete(`https://candidate-tracker-iray-bhgbahe3bjame4gv.centralindia-01.azurewebsites.net/api/v1/openings/${openingId}`)
      .then((res) => {
        if (res.status === 200) {
          getAllOpenings();
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  };

  const restoreOpening = (openingId) => {
    setLoading(true);
    axios
      .patch(`https://candidate-tracker-iray-bhgbahe3bjame4gv.centralindia-01.azurewebsites.net/api/v1/openings/restore/${openingId}`)
      .then((res) => {
        if (res.status === 200) {
          getAllOpenings();
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
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

        {showTrash && (
          <div className="flex items-center justify-between mx-4 mt-4 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <span className="text-sm text-gray-700">
              Showing <span className="text-yellow-700 font-semibold">closed</span> openings
            </span>
          </div>
        )}

        <main className="flex-1 bg-white">
          <div className="flex px-10 py-5 items-center">
            <div className="flex-grow">
              <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <div className="space-x-4 flex items-center">
              {(permissionid === "1" || permissionid === "2") && !showTrash && (
                <button
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-md px-4 py-2 hover:from-yellow-600 hover:to-yellow-500 cursor-pointer"
                  onClick={() => navigate("/addopening")}
                >
                  New Opening
                </button>
              )}

              {/* Trash toggle — Admin only */}
              {permissionid === "1" && (
                <button
                  onClick={toggleTrashView}
                  className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition ${
                    showTrash
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {showTrash ? "← Back to Active" : "🗑 Trash"}
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
                        <th className="px-6 py-3 text-left text-sm font-bold tracking-wide bg-inherit">
                          ACTIONS
                        </th>
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-gray-400 text-sm">
                          {showTrash ? "No closed openings found." : "No openings found."}
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50 transition">
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}

                          <td className="px-2 py-4 text-sm">
                            <div className="flex flex-row gap-2 mt-1">

                              {/* View — all roles */}
                              <button
                                onClick={() => {
                                  navigate("/view_opening");
                                  localStorage.setItem("opening_id", row.original.id);
                                }}
                                className="px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                              >
                                View
                              </button>

                              {/* Edit — Admin (1), HR (2), Manager (3); hidden in Trash view */}
                              {!showTrash && (permissionid === "1" || permissionid === "2" || permissionid === "3") && (
                                <button
                                  className="px-2 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                                  onClick={() => {
                                    localStorage.setItem("opening_id", row.original.id);
                                    navigate("/edit_opening");
                                  }}
                                >
                                  Edit
                                </button>
                              )}

                              {/* Delete / Restore — Admin only (1) */}
                              {permissionid === "1" && (
                                showTrash ? (
                                  <button
                                    className="px-2 py-1 rounded border border-green-400 text-green-600 hover:bg-green-50 text-xs transition cursor-pointer"
                                    onClick={() => {
                                      setSelectedOpeningId(row.original.id);
                                      setShowRestoreModal(true);
                                    }}
                                  >
                                    Restore
                                  </button>
                                ) : (
                                  <button
                                    className="px-2 py-1 rounded border border-red-400 text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
                                    onClick={() => {
                                      setSelectedOpeningId(row.original.id);
                                      setShowDeleteModal(true);
                                    }}
                                  >
                                    Delete
                                  </button>
                                )
                              )}

                            </div>
                          </td>
                        </tr>
                      ))
                    )}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}
          >
            <div className="bg-white rounded-lg shadow-lg text-center" style={{ width: "350px", padding: "24px" }}>
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

        {/* Restore Confirmation Modal */}
        {showRestoreModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}
          >
            <div className="bg-white rounded-lg shadow-lg text-center" style={{ width: "350px", padding: "24px" }}>
              <h2 className="text-lg font-semibold text-blue-700 mb-4">Confirm Restore</h2>
              <p className="text-gray-700 mb-6">Restore this opening to Active?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    restoreOpening(selectedOpeningId);
                    setShowRestoreModal(false);
                  }}
                >
                  Yes, Restore
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-md"
                  onClick={() => setShowRestoreModal(false)}
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

export default Current_openings;