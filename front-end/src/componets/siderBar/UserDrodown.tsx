import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

interface UserDropdownProps {
  children?: React.ReactNode;
}

export default function UserDropdown({ children }: UserDropdownProps) {
  return (
    <Dropdown 
      placement="top-start"
      classNames={{
        content: "bg-gray-800 border border-gray-700 rounded-xl shadow-xl",
      }}
    >
      <DropdownTrigger>
        <div className="cursor-pointer">
          {children}
        </div>
      </DropdownTrigger>
      
      <DropdownMenu 
        aria-label="User menu" 
        variant="flat"
        className="p-2"
        itemClasses={{
          base: "px-3 py-2 rounded-lg data-[hover=true]:bg-gray-700/50 transition-all duration-200",
          title: "text-sm text-white",
          description: "text-xs text-gray-400",
          shortcut: "text-xs text-gray-500",
        }}
      >
        <DropdownItem 
          key="profile"
          startContent={<Icon icon="lucide:user" className="w-4 h-4 text-blue-400" />}
          description="View your profile"
          className="mb-1"
        >
          Profile
        </DropdownItem>
        
        <DropdownItem 
          key="settings"
          startContent={<Icon icon="lucide:settings" className="w-4 h-4 text-purple-400" />}
          description="Customize preferences"
          className="mb-1"
        >
          Settings
        </DropdownItem>
        
        <DropdownItem 
          key="billing"
          startContent={<Icon icon="lucide:credit-card" className="w-4 h-4 text-green-400" />}
          description="Manage subscription"
        >
          Billing & Plans
        </DropdownItem>
        
        {/*
        <DropdownItem 
          key="divider"
          className="opacity-0 cursor-default h-px my-1 bg-gray-600"
          isReadOnly
        >
          <div className="w-full h-px bg-gray-600" />
        </DropdownItem> */} 
        
        <DropdownItem 
          key="help"
          startContent={<Icon icon="lucide:help-circle" className="w-4 h-4 text-yellow-400" />}
          description="Get support"
          className="mb-1"
        >
          Help & Support
        </DropdownItem>
        
        <DropdownItem 
          key="logout"
          className="text-danger hover:bg-red-500/20 mt-1"
          color="danger"
          startContent={<Icon icon="lucide:log-out" className="w-4 h-4 "color="#dd7a33ff" />}
          description="Sign out of your account"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}