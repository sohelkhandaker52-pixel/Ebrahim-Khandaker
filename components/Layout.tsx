
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  MessageSquare, 
  User as UserIcon, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { View, UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
  // Using UserProfile instead of non-existent User type
  user: UserProfile;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, view: 'Dashboard' as View },
    { label: 'Parcels', icon: <Package size={20} />, view: 'Parcels' as View },
    { label: 'Payments', icon: <CreditCard size={20} />, view: 'Payments' as View },
    { label: 'Support', icon: <MessageSquare size={20} />, view: 'Support' as View },
    { label: 'Profile', icon: <UserIcon size={20} />, view: 'Profile' as View },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold">Express Courier</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-indigo-800 text-white transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 hidden md:block">Express Courier</h1>
          <div className="mb-8 p-4 bg-indigo-700 rounded-lg">
            <p className="text-xs text-indigo-200">Welcome,</p>
            {/* Changed user.username to user.name based on UserProfile definition */}
            <p className="text-lg font-semibold truncate">{user.name}</p>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveTab(item.view);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.view ? 'bg-white text-indigo-800' : 'hover:bg-indigo-700'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6">
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-indigo-200 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

// Helper for setActiveView mismatch if necessary (thoughsetActiveView is passed as prop)
const setActiveTab = (v: any) => {};

export default Layout;
