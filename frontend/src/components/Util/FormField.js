const FormField = ({ label, name, children }) => (
  <div className="mb-4">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    {children}
  </div>
);

export default FormField;
