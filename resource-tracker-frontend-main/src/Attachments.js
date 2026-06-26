import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Attachments = (props) => {
  const [attachments, setAttachments] = useState([]);
  const [attachmentId, setAttachmentId] = useState(null);
  const [resId, setResId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [file, setFile] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const permissionId = localStorage.getItem("permissionid");

  useEffect(() => {
    const resid = props?.match?.params?.resid || localStorage.getItem("attachments_id");
    if (resid) {
      setResId(resid);
      fetchAttachments(resid);
    }
  }, []);

  const fetchAttachments = async (resid) => {
    try {
      const res = await axios.get(
        `https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/attachment/getListAttachments/${resid}`
      );
      setAttachments(res.data);
    } catch (err) {
      console.error("Failed to fetch attachments:", err);
    }
  };

  const handleDeleteClick = (id) => {
    setAttachmentId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/attachment/${attachmentId}`);
      fetchAttachments(resId);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleUpload = async () => {
    if (!file.length) {
      setShowError(true);
      return;
    }
    const formData = new FormData();
    formData.append("id", resId);
    for (let i = 0; i < file.length; i++) {
      formData.append("attachments", file[i]);
    }
    try {
      await axios.post("https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/attachment/upload", formData);
      fetchAttachments(resId);
      setShowUploadForm(false);
      setFile([]);
      setShowError(false);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`https://candiate-tracker-aea8hqfwbxd4dqhu.centralindia-01.azurewebsites.net/api/v1/attachment/${id}`);
      const blob = b64toBlob(res.data.attachment, res.data.contentType);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    } catch (err) {
      console.error("View failed:", err);
    }
  };

  const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = Array.from(slice, (char) => char.charCodeAt(0));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: contentType });
  };

  // ── Portal Modals ──
  const UploadModal = () => ReactDOM.createPortal(
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '860px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Upload Attachment</h2>
          <button
            onClick={() => { setShowUploadForm(false); setFile([]); setShowError(false); }}
            style={{ fontSize: '28px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
          >×</button>
        </div>

        {showError && (
          <div style={{ background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
            ⚠️ Please select at least one file to upload.
          </div>
        )}

        {/* Drop Zone */}
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '220px', border: '2px dashed #facc15', borderRadius: '16px', background: '#fefce8', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef9c3'}
          onMouseLeave={e => e.currentTarget.style.background = '#fefce8'}
        >
          {/* Upload Icon */}
          <div style={{ width: '64px', height: '64px', background: '#facc15', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0L8 8m4-4l4 4" />
            </svg>
          </div>
          <p style={{ fontWeight: '600', fontSize: '17px', color: '#374151', margin: '0 0 6px 0' }}>
            {file.length > 0 ? `${file.length} file(s) selected` : 'Click to upload files'}
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            {file.length > 0
              ? Array.from(file).map(f => f.name).join(', ')
              : 'or drag and drop your files here'}
          </p>
          <input type="file" multiple style={{ display: 'none' }}
            onChange={(e) => { setFile(e.target.files); setShowError(false); }} />
        </label>

        {/* Selected Files List */}
        {file.length > 0 && (
          <div style={{ marginTop: '16px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb', maxHeight: '160px', overflowY: 'auto' }}>
            {Array.from(file).map((f, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: idx < file.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ width: '36px', height: '36px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2563eb">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{(f.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
          <button
            onClick={() => { setShowUploadForm(false); setFile([]); setShowError(false); }}
            style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontWeight: '500', cursor: 'pointer' }}
          >Cancel</button>
          <button
            onClick={handleUpload}
            style={{ padding: '10px 32px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontWeight: '600', cursor: 'pointer' }}
          >Upload</button>
        </div>

      </div>
    </div>,
    document.body
  );

  const DeleteModal = () => ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '420px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Delete Attachment</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Are you sure you want to delete this attachment?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => setShowDeleteModal(false)}
            style={{ padding: '8px 20px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#374151', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={confirmDelete}
            style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#dc2626', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Main Card ── */}
      <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-700">Attachments</h1>
          <button
            onClick={() => { setShowUploadForm(true); setShowError(false); }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            + Add Attachment
          </button>
        </div>

        <table className="w-full table-auto border border-gray-300 mb-4">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Filename</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attachments.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-gray-400">
                  No attachments found.
                </td>
              </tr>
            ) : (
              attachments.map((item) => (
                <tr key={item.attachmentId} className="border-t border-gray-200">
                  <td className="px-4 py-2">{item.fileName}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleView(item.attachmentId)}
                      className="bg-green-500 hover:bg-green-600 text-gray-700 px-3 py-1 rounded cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item.attachmentId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <button
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate('/manageresources')}
          >
            Back
          </button>
        </div>
      </div>

      {/* ── Portaled Modals ── */}
      {showUploadForm && <UploadModal />}
      {showDeleteModal && <DeleteModal />}

    </div>
  );
};

export default Attachments;