import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, Video, PlayCircle, FileText, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navItems = [
    { to: '/dashboard/courses', icon: BookOpen, label: 'Courses' },
    { to: '/dashboard/live-lectures', icon: Video, label: 'Live Lectures' },
    { to: '/dashboard/recorded', icon: PlayCircle, label: 'Recorded' },
    { to: '/dashboard/notes', icon: FileText, label: 'Study Notes' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 p-6 sticky top-0 h-screen overflow-y-auto shadow-sm">
        <h2 className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-8 tracking-tight">
          BECS Admin
        </h2>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:translate-x-1 border-2 border-transparent hover:border-red-200'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-sm bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
