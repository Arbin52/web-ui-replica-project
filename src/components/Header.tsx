
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Search, Bell, Menu, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Sidebar from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  const handleLogoClick = () => {
    navigate('/');
    if (setActiveTab) {
      setActiveTab('overview');
    }
  };
  
  return (
    <div className="network-header shadow-md">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-[#2d4c4c] text-white">
            {setActiveTab && <Sidebar activeTab={activeTab || 'overview'} setActiveTab={setActiveTab} />}
          </SheetContent>
        </Sheet>
        <h1 className="text-2xl font-bold cursor-pointer" onClick={handleLogoClick}>Network Monitor</h1>
      </div>
      <div className="hidden md:flex rounded-md bg-white/10 px-3 py-1.5 w-64">
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/70"
        />
        <Search size={18} className="text-white/70" />
      </div>
      <div className="flex gap-4 items-center">
        <Button variant="ghost" size="icon" className="text-white relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" className="flex items-center gap-1 text-white">
          <Settings size={18} />
          <span className="hidden md:inline">Settings</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem className="font-medium">{user?.email}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
