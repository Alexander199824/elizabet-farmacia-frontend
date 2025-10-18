/**
 * @author Alexander Echeverria
 * @file DashboardLayout.jsx
 * @description Layout principal del dashboard
 * @location /src/layouts/DashboardLayout.jsx
 */

import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="lg:pl-64 transition-all duration-300">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;