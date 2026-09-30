import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f2ee] dark:bg-[#1d2226] text-[#191919] dark:text-[#f3f2ef] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
