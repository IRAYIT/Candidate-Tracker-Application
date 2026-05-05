import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ClipLoader } from "react-spinners";

const BASE_URL = "http://localhost:8098/api/public/apply";
const STATUS_OPTIONS = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

function AppliedCandidates() {
  const [permissionid, setPermissionid] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpeningName, setFilterOpeningName] = useState("");
const [filterOpeningId, setFilterOpeningId] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editModal, setEditModal] = useState({ open: false, candidateId: null, currentStatus: "" });
  const [newStatus, setNewStatus] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, candidateId: null });

  const navigate = useNavigate();

useEffect(() => {
    const temp_permissionid = localStorage.getItem("permissionid");
    setPermissionid(temp_permissionid);

    const openingId = localStorage.getItem("filter_opening_id");
    const openingName = localStorage.getItem("filter_opening_name");

    if (openingId) {
        setFilterOpeningId(openingId);
        setFilterOpeningName(openingName);
        fetchCandidatesByOpening(openingId);   // ← filtered
    } else {
        fetchCandidates();                     // ← all candidates
    }
}, []);

const fetchCandidatesByOpening = async (openingId) => {
    try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:8098/api/public/apply/byOpening/${openingId}`);
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/getAllCandidate`);
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setCandidates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = candidates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName?.toLowerCase().includes(q) ||
      c.lastName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.languagesKnown?.toLowerCase().includes(q)
    );
  });

  const handleView = (candidateId) => {
    localStorage.setItem("view_candidate_id", candidateId);
    navigate("/candidate-view");
  };

  const openEditModal = (candidate) => {
    setEditModal({ open: true, candidateId: candidate.id, currentStatus: candidate.applicationStatus });
    setNewStatus(candidate.applicationStatus);
  };

  const handleStatusUpdate = async () => {
    try {
      setEditLoading(true);
      const res = await fetch(`${BASE_URL}/status/${editModal.candidateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === editModal.candidateId ? { ...c, applicationStatus: newStatus } : c
        )
      );
      setEditModal({ open: false, candidateId: null, currentStatus: "" });
    } catch (err) {
      alert("Error updating status: " + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/delete/${deleteModal.candidateId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete candidate");
      setCandidates((prev) => prev.filter((c) => c.id !== deleteModal.candidateId));
      setDeleteModal({ open: false, candidateId: null });
    } catch (err) {
      alert("Error deleting candidate: " + err.message);
    }
  };

  const statusBadge = (status) => {
    const map = {
      APPLIED: "bg-blue-100 text-blue-700",
      SHORTLISTED: "bg-yellow-100 text-yellow-700",
      INTERVIEW: "bg-purple-100 text-purple-700",
      OFFERED: "bg-green-100 text-green-700",
      HIRED: "bg-emerald-100 text-emerald-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ maxWidth: "calc(100% - 256px)" }}>
        <header className="border-b border-gray-200 bg-white">
          <Header />
        </header>

{filterOpeningName && (
    <div className="flex items-center justify-between mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
        <span className="text-sm text-gray-700">
            Showing candidates for: <span className="text-blue-600 font-semibold">{filterOpeningName}</span>
        </span>
        <button
            onClick={() => {
                localStorage.removeItem("filter_opening_id");
                localStorage.removeItem("filter_opening_name");
                setFilterOpeningName("");
                setFilterOpeningId(null);
                fetchCandidates();
            }}
            className="text-xs text-red-500 hover:underline cursor-pointer ml-4"
        >
            ✕ Clear Filter
        </button>
    </div>
)}


        <main className="flex-1 bg-gray-50 p-6 overflow-x-auto">
          {/* Search bar */}
          <div className="flex items-center justify-between mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-yellow-400 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center justify-between">
              <span>Error: {error}</span>
              <button
                onClick={fetchCandidates}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <ClipLoader size={60} color="#FACC15" />
            </div>
          ) : (
            <div className="p-5 rounded-lg border border-gray-300 bg-white shadow h-[500px] flex flex-col">
              <div className="overflow-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 text-white sticky top-0 z-10">
                    <tr>
                      {["First Name", "Last Name", "Email", "Experience", "Expected Salary", "Skills", "Status", "Actions"].map(
                        (h) => (
                          <th key={h} className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-10 text-center text-gray-400 text-sm">
                          No candidates found.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm">{c.firstName}</td>
                          <td className="px-6 py-4 text-sm">{c.lastName}</td>
                          <td className="px-6 py-4 text-sm">{c.email}</td>
                          <td className="px-6 py-4 text-sm">{c.experience} yrs</td>
                          <td className="px-6 py-4 text-sm">
                            {c.expectedSalaryCurrency || "₹"}{c.expectedSalary?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">{c.languagesKnown || "—"}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${statusBadge(c.applicationStatus)}`}>
                              {c.applicationStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2 flex-nowrap">

                              {/* View — all roles */}
                              <button
                                onClick={() => handleView(c.id)}
                                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                              >
                                View
                              </button>

                              {/* Edit — Admin (1), HR (2), Manager (3) */}
                              {(permissionid === "1" || permissionid === "2" || permissionid === "3") && (
                                <button
                                  onClick={() => openEditModal(c)}
                                  className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs transition cursor-pointer"
                                >
                                  Edit
                                </button>
                              )}

                              {/* Delete — Admin only (1) */}
                              {permissionid === "1" && (
                                <button
                                  onClick={() => setDeleteModal({ open: true, candidateId: c.id })}
                                  className="px-3 py-1 rounded border border-red-400 text-red-600 hover:bg-red-50 text-xs transition cursor-pointer"
                                >
                                  Delete
                                </button>
                              )}

                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex items-center px-6 py-4 border-t bg-gray-100 text-sm text-gray-600">
                <span>Total: {filtered.length} candidate{filtered.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Status Modal */}
      {editModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 px-6 py-5">
              <h2 className="text-xl font-bold text-white tracking-wide">Update Status</h2>
              <p className="text-blue-100 text-sm mt-1">Change the application stage for this candidate</p>
            </div>
            <div className="px-6 py-5">
              <label className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-2 block">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleStatusUpdate}
                  disabled={editLoading}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-md px-4 py-2 font-medium hover:from-yellow-500 hover:to-yellow-700 transition cursor-pointer text-sm"
                >
                  {editLoading ? "Saving…" : "Save"}
                </button>
                <button
                  onClick={() => setEditModal({ open: false, candidateId: null, currentStatus: "" })}
                  className="flex-1 border border-gray-300 text-gray-600 rounded-md px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden" }}
        >
          <div className="bg-white rounded-lg shadow-lg text-center" style={{ width: "350px", padding: "24px" }}>
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6 text-sm">Are you sure you want to delete this candidate?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, candidateId: null })}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-md text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppliedCandidates;