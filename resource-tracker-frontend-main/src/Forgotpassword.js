import { useNavigate } from "react-router-dom";

function Forgotpassword() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-400 to-yellow-400 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-4">
          Forgot Password
        </h2>
        <p className="text-lg text-center text-gray-600 mb-6">
          Enter your email to reset your password
        </p>
        <div className="flex flex-col items-center space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[150px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => navigate("/")}
            className="w-[150px] p-2 border-2 border-amber-300 bg-amber-300 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition duration-200 cursor-pointer"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;

