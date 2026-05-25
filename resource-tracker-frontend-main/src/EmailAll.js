import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

function EmailAll() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("emp_email"));
  }, []);

  const sendmail = () => {
    if (message !== '' && subject !== '') {
      const payload = {
        email,
        emailBody: message,
        subject,
        isTrue: true,
      };
      setSending(true);
      axios
        .post("http://localhost:8098/api/v1/resource/sendEmail", payload)
        .then(() => {
          setSending(false);
          navigate('/manageresources');
        })
        .catch((err) => {
          setSending(false);
          setError("Failed to send email. Please try again.");
        });
    } else {
      setError('All fields are mandatory');
    }
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gradient-to-b from-blue-500 to-yellow-400 min-h-screen">
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-300">
          <Header />
        </header>
        <main className="flex-1 bg-white flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-white text-center p-6 rounded-t bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 mb-6 shadow">
              Email All
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setError('');
                  }}
                  value={subject}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Email Body <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Enter message"
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError('');
                  }}
                  value={message}
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => navigate('/manageresources')}
                  disabled={sending}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={sendmail}
                  disabled={sending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-70 flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <ClipLoader size={16} color="#ffffff" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EmailAll;