import { Button } from "@heroui/react";

interface ButtonCustomProps {
  onClick: () => void;
  children: React.ReactNode;
}

export default function ButtonCustomStyles({ onClick, children }: ButtonCustomProps) {
  return (
    <Button
      className="
        bg-gradient-to-tr from-yellow-400 to-blue-800
        text-white shadow-lg 
        hover:scale-105 transition
        active:scale-95
      "
      radius="full"   
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
