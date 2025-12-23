import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

const Attachments = (props) => {
  const [attachments, setAttachments] = useState([]);
  const [attachmentId, setAttachmentId] = useState(null);
  const [resId, setResId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [file, setFile] = useState([]);
  const [showError, setShowError] = useState(false);
  const navigate=useNavigate();
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
        `http://localhost:8098/api/v1/attachment/getListAttachments/${resid}`
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
      await axios.delete(
        `http://localhost:8098/api/v1/attachment/${attachmentId}`
      );
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
      await axios.post(
        "http://localhost:8098/api/v1/attachment/upload",
        formData
      );
      fetchAttachments(resId);
      setShowUploadForm(false);
      setFile([]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8098/api/v1/attachment/${id}`);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-700">Attachments</h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            + Add Attachment
          </button>
        </div>

        {showError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            Please select at least one file to upload.
          </div>
        )}

        <table className="w-full table-auto border border-gray-300 mb-4">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Filename</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attachments.map((item) => (
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
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
            <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded cursor-pointer" onClick={() => navigate('/manageresources')}>
              Back
            </button>
        </div>
      </div>

      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Upload Attachment</h2>
            <input
              type="file"
              multiple
              onChange={(e) => setFile(e.target.files)}
              className="block w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Attachment</h2>
            <p className="mb-4">Are you sure you want to delete this attachment?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attachments;
