
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, Search, Bell, Menu, User, X } from 'lucide-react';
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
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Simple search handling - can be expanded later
      console.log(`Searching for: ${searchQuery}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  return (
    <header className="network-header bg-gradient-to-r from-primary/90 to-primary shadow-md text-white p-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {setActiveTab && <Sidebar activeTab={activeTab || 'overview'} setActiveTab={setActiveTab} />}
          </SheetContent>
        </Sheet>
        <h1 
          className="text-2xl font-bold cursor-pointer transition-transform hover:scale-105" 
          onClick={handleLogoClick}
        >
          Network Monitor
        </h1>
      </div>
      
      {isSearchExpanded ? (
        <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4 animate-fade-in">
          <div className="flex rounded-md bg-white/10 px-3 py-1.5 w-full">
            <input 
              type="text" 
              placeholder="Search devices, networks, reports..." 
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="button" onClick={() => setIsSearchExpanded(false)} className="text-white/70">
              <X size={18} />
            </button>
          </div>
        </form>
      ) : (
        <div 
          className="hidden md:flex rounded-md bg-white/10 px-3 py-1.5 w-64 cursor-pointer hover:bg-white/20 transition-colors" 
          onClick={() => setIsSearchExpanded(true)}
        >
          <span className="text-white/70 w-full">Search...</span>
          <Search size={18} className="text-white/70" />
        </div>
      )}
      
      <div className="flex gap-4 items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white relative md:hidden"
          onClick={() => setIsSearchExpanded(true)}
        >
          <Search size={18} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-white relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <ThemeToggle />
        
        <Button variant="ghost" className="hidden md:flex items-center gap-1 text-white">
          <Settings size={18} />
          <span className="hidden md:inline">Settings</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white rounded-full">
              <User size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
            <DropdownMenuItem className="font-medium">{user?.email}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
