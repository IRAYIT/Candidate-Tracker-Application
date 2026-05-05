import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8098/api/public/apply";

function CandidateView() {
  const [candidate, setCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const candidateId = localStorage.getItem("view_candidate_id");
    if (candidateId) {
      fetch(`${BASE_URL}/get/${candidateId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch candidate");
          return res.json();
        })
        .then((data) => setCandidate(data))
        .catch((err) => console.error("Error fetching candidate:", err));
    }
  }, []);

  // ── DOCUMENT HELPERS ─────────────────────────────────────────────────────
  const openDocument = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Document not found");
      const blob = await res.blob();
      window.open(window.URL.createObjectURL(blob), "_blank");
    } catch (err) {
      alert("Error opening document: " + err.message);
    }
  };

  const downloadDocument = async (url, filename) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Document not found");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = filename || "document";
      a.click();
    } catch (err) {
      alert("Error downloading document: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-300">
          <Header />
        </header>

        <main className="flex-1 bg-white p-8">
          <div className="max-w-5xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">

            {/* Page Title */}
            <h2 className="text-xl font-bold p-6 text-gray-900 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
              Candidate Details
            </h2>

            {candidate ? (
              <div className="space-y-6">

                {/* Row 1 - First Name / Last Name */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={candidate.firstName || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={candidate.lastName || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Row 2 - Email / Phone */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Email</label>
                    <input
                      type="text"
                      value={candidate.email || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={candidate.phone || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Row 3 - Current Salary / Expected Salary */}
                <div className="flex flex-wrap gap-4 justify-between">
                   <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Current Salary</label>
                    <input
                      type="text"
                      value={candidate.currentSalary ? `${candidate.currentSalaryCurrency || '₹'}${candidate.currentSalary.toLocaleString()}` : ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                 
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Expected Salary</label>
                    <input
                      type="text"
                      value={candidate.expectedSalary ? `${candidate.expectedSalaryCurrency || '₹'}${candidate.expectedSalary.toLocaleString()}` : ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                 {/* Row 4  - Experience}
                <div className="flex flex-wrap gap-4 justify-between">
                  bled<div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      type="text"
                      value={candidate.experience ?? ""}
                      disa
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>

                {/* Row 4 - Skills / Location */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Skills</label>
                    <input
                      type="text"
                      value={candidate.languagesKnown || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={candidate.location || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Row 5 - Employment Type / Notice Period */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Employment Type</label>
                    <input
                      type="text"
                      value={candidate.employmentType || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Notice Period (Days)</label>
                    <input
                      type="text"
                      value={candidate.noticePeriod ?? ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Row 6 - Visa Status / Source */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Visa Status</label>
                    <input
                      type="text"
                      value={candidate.visaStatus || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Source</label>
                    <input
                      type="text"
                      value={candidate.source || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Row 7 - Application Status (full width) */}
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="w-full md:w-[48%]">
                    <label className="font-semibold block text-gray-700 mb-1">Application Status</label>
                    <input
                      type="text"
                      value={candidate.applicationStatus || ""}
                      disabled
                      className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-800 text-sm"
                    />
                  </div>
                </div>

                {/* Documents Section */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-700 mb-4">Documents</h3>
                  <div className="flex flex-wrap gap-4">

                    {/* CV */}
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold block text-gray-700 mb-1">CV</label>
                      {candidate.cvName ? (
                        <div className="border-2 border-yellow-400 p-3 rounded bg-gray-100">
                          <p className="text-sm text-gray-700 mb-2 truncate">📄 {candidate.cvName}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDocument(`${BASE_URL}/resume/${candidate.id}`)}
                              className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-200 text-xs transition cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => downloadDocument(`${BASE_URL}/resume/${candidate.id}`, candidate.cvName)}
                              className="px-3 py-1 rounded border text-blue-600 hover:bg-blue-50 text-xs transition cursor-pointer"
                            >
                              ⬇ Download
                            </button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value="Not uploaded"
                          disabled
                          className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-400 text-sm italic"
                        />
                      )}
                    </div>

                    {/* Cover Letter */}
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold block text-gray-700 mb-1">Cover Letter</label>
                      {candidate.coverLetterName ? (
                        <div className="border-2 border-yellow-400 p-3 rounded bg-gray-100">
                          <p className="text-sm text-gray-700 mb-2 truncate">📄 {candidate.coverLetterName}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDocument(`${BASE_URL}/cover-letter/${candidate.id}`)}
                              className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-200 text-xs transition cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => downloadDocument(`${BASE_URL}/cover-letter/${candidate.id}`, candidate.coverLetterName)}
                              className="px-3 py-1 rounded border text-blue-600 hover:bg-blue-50 text-xs transition cursor-pointer"
                            >
                              ⬇ Download
                            </button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value="Not uploaded"
                          disabled
                          className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-400 text-sm italic"
                        />
                      )}
                    </div>

                    {/* Additional Document */}
                    <div className="w-full md:w-[48%]">
                      <label className="font-semibold block text-gray-700 mb-1">Additional Document</label>
                      {candidate.additionalDocumentName ? (
                        <div className="border-2 border-yellow-400 p-3 rounded bg-gray-100">
                          <p className="text-sm text-gray-700 mb-2 truncate">📄 {candidate.additionalDocumentName}</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openDocument(`${BASE_URL}/additional-documents/${candidate.id}`)}
                              className="px-3 py-1 rounded border text-gray-700 hover:bg-gray-200 text-xs transition cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => downloadDocument(`${BASE_URL}/additional-documents/${candidate.id}`, candidate.additionalDocumentName)}
                              className="px-3 py-1 rounded border text-blue-600 hover:bg-blue-50 text-xs transition cursor-pointer"
                            >
                              ⬇ Download
                            </button>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value="Not uploaded"
                          disabled
                          className="w-full border-2 border-yellow-400 p-2 rounded bg-gray-100 text-gray-400 text-sm italic"
                        />
                      )}
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <p className="text-gray-500 text-sm">Loading candidate details...</p>
            )}

            {/* Back Button */}
            <div className="flex gap-4 p-4 items-center justify-center mt-8">
              <button
                onClick={() => navigate("/applied-candidates")}
                className="border-2 rounded-2xl border-gray-900 px-4 py-2 cursor-pointer hover:bg-gray-100 transition"
              >
                Back
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default CandidateView;
