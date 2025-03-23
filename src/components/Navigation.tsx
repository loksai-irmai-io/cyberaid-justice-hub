
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Search, Database } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
        transition-all duration-300 ease-in-out
        ${isActive ? 
          'bg-primary text-primary-foreground shadow-md' : 
          'text-muted-foreground hover:text-foreground hover:bg-accent/50'
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

const Navigation: React.FC = () => {
  return (
    <nav className="lg:w-72 lg:h-screen lg:sticky top-0 z-20 bg-card shadow-md lg:shadow-none border-b lg:border-r border-border">
      <div className="flex flex-col p-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            C
          </div>
          <h1 className="text-xl font-semibold tracking-tight">CyberAID</h1>
        </div>
        
        <div className="space-y-2">
          <NavItem to="/" icon={<Home size={18} />} label="Home" />
          <NavItem to="/report" icon={<FileText size={18} />} label="Report Incident" />
          <NavItem to="/reports" icon={<Search size={18} />} label="View Reports" />
          <NavItem to="/blockchain" icon={<Database size={18} />} label="View Blockchain" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
