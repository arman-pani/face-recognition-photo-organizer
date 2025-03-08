import React from "react";

interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = "primary", icon }) => {
  const baseStyles = "w-full p-2 mb-3 rounded-md text-lg transition font-semibold flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {icon && <span className="text-xl">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default Button;
