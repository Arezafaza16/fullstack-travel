import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '../ui/ToastContainer';
import { Menu } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/content': 'Manajemen Konten',
  '/admin': 'Administrasi',
};

export function DashboardLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = Object.entries(pageTitles).find(([key]) =>
    location.pathname.startsWith(key)
  )?.[1] ?? 'Dashboard';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 shadow-sm z-10 flex-shrink-0">
          {/* Mobile hamburger */}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-slate-800">{pageTitle}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
