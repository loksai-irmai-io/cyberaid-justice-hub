
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <Navigation />
      <div className="flex-grow">
        <Header />
        <main className="p-6 lg:p-10 max-w-7xl mx-auto w-full transition-all duration-300 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
