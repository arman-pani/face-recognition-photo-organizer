import React from "react";

interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large";
}



const Button: React.FC<ButtonProps> = ({ label, onClick, variant = "primary", icon, size = "medium"}) => {
  const baseStyles = "p-2 mb-3 rounded-md text-lg transition font-semibold flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
  };

  const sizes = {
    small: "w-24 h-8 text-sm",
    medium: "w-40 h-10 text-base",
    large: "w-full h-12 text-lg",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {icon && <span className="text-xl">{icon}</span>}
      <span>{label}</span>
      <br />
    </button>
  );
};

export default Button;
