import { Button } from "../components/ui/button";

interface IconButtonProps {
    icon: React.ComponentType<{ size?: string | number }>;
    variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
    className?: string;
    onClick?: () => void;
  }
  
  const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, variant = "outline", className = "", onClick, ...props }) => {
    return (
      <Button
        variant={variant}
        className={`border-gray-700 bg-blue-400 text-white hover:border-blue-400 ${className}`}
        onClick={onClick}
        {...props}
      >
        {Icon && <Icon size={16} />}
      </Button>
    );
  };

export default IconButton;
