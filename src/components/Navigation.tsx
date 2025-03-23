
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Search, Database, Shield, ShieldAlert, Lock } from 'lucide-react';

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
          'bg-accent text-accent-foreground shadow-md accent-glow' : 
          'text-muted-foreground hover:text-foreground hover:bg-accent/10'
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
    <nav className="lg:w-72 lg:h-screen lg:sticky top-0 z-20 bg-sidebar shadow-md lg:shadow-none border-b lg:border-r border-border">
      <div className="flex flex-col p-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold accent-glow">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight cyber-glow">CyberAID</h1>
            <p className="text-xs text-muted-foreground">Incident Response System</p>
          </div>
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
