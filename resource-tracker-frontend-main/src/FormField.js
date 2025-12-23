const FormField = ({ label, value, onChange }) => (
  <div className="flex flex-col mr-4 mb-4 w-full">
    <label className="text-gray-700 font-medium">
      {label} <span className="text-pink-800">*</span>
    </label>
    <input
      type="text"
      value={value}
      placeholder={`Enter ${label.toLowerCase()}`}
      onChange={onChange}
      className="border-2 border-yellow-400 hover:border-yellow-500 rounded px-2 py-1"
    />
  </div>
);

export default FormField;
