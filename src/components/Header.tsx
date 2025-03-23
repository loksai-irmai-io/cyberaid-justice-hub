
import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Map routes to page titles
  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/report':
        return 'Report Incident';
      case '/reports':
        return 'View Reports';
      case '/blockchain':
        return 'View Blockchain';
      default:
        return 'CyberAID';
    }
  };
  
  return (
    <header className="glass-nav py-4 px-6 sticky top-0 z-10 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="md:hidden w-8 h-8 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
          <ShieldAlert size={16} />
        </div>
        <h1 className="text-xl font-medium tracking-tight cyber-glow">CyberAID</h1>
        <div className="hidden md:flex h-6 w-px bg-muted mx-2"></div>
        <span className="hidden md:block text-sm font-medium text-muted-foreground">{getTitle()}</span>
      </div>
    </header>
  );
};

export default Header;
