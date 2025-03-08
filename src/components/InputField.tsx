
import React from "react";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent text-white placeholder-gray-400"
    />
  );
};

export default InputField;
