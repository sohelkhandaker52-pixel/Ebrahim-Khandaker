
import React, { useState, useEffect } from 'react';
import { Parcel, UserProfile, PaymentMethod, Transaction, TrackingStep } from '../types';
import { LanguageCode, translations } from '../translations';
import Dashboard from './Dashboard';
import ParcelForm from './ParcelForm';
import Assistant from './Assistant';
import Advice from './Advice';
import PaymentInvoice from './PaymentInvoice';
import Profile from './Profile';
import TopUp from './TopUp';
import PickupRequest from './PickupRequest';
import Auth, { EksoLogo } from './Auth';
import { Download, Plus, LayoutDashboard, Package, MessageSquare, CreditCard, Menu, X, Settings, User, ShieldAlert, Ticket, Truck, Globe, ChevronDown, Store, Wallet, Lightbulb, Eye, EyeOff, FileSpreadsheet, Smartphone, Search, Bell, Home, LogOut, List, Navigation } from 'lucide-react';
import * as XLSX from 'xlsx';

type Tab = 'dashboard' | 'parcels' | 'add' | 'assistant' | 'payments' | 'profile' | 'topup' | 'coverage' | 'pickup' | 'fraud' | 'tickets' | 'summary' | 'advice' | 'notification';

interface NavItem {
  id: Tab;
  label: string;
  icon: any;
}

const languages = [
  { code: 'en' as LanguageCode, name: 'English', native: 'English' },
  { code: 'bn' as LanguageCode, name: 'বাংলা', native: 'বাংলা' },
  { code: 'ar' as LanguageCode, name: 'Arabic', native: 'العربية' },
  { code: 'jp' as LanguageCode, name: 'Japanese', native: '日本語' },
  { code: 'zh' as LanguageCode, name: 'Chinese', native: '中文' },
  { code: 'it' as LanguageCode, name: 'Italian', native: 'Italiano' },
  { code: 'hi' as LanguageCode, name: 'Hindi', native: 'हिन्दी' },
  { code: 'ms' as LanguageCode, name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'id' as LanguageCode, name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'th' as LanguageCode, name: 'Thai', native: 'ไทย' },
  { code: 'de' as LanguageCode, name: 'German', native: 'Deutsch' },
  { code: 'fr' as LanguageCode, name: 'French', native: 'Français' },
  { code: 'tr' as LanguageCode, name: 'Turkish', native: 'Türkçe' },
  { code: 'other' as LanguageCode, name: 'More Languages', native: 'More...' },
];

const NavigationLinks: React.FC<{ activeTab: Tab; setActiveTab: (t: Tab) => void; closeMenu: () => void; t: any; deferredPrompt: any; onInstall: () => void }> = ({ activeTab, setActiveTab, closeMenu, t, deferredPrompt, onInstall }) => {
  const items: NavItem[] = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'parcels', label: t.parcels + ' List', icon: List },
    { id: 'add', label: t.add_order, icon: Plus },
    { id: 'advice', label: t.advice, icon: Lightbulb },
    { id: 'topup', label: t.add_money, icon: Wallet },
    { id: 'pickup', label: t.pickup_request, icon: Truck },
    { id: 'fraud', label: t.fraud_check, icon: ShieldAlert },
    { id: 'payments', label: t.payment_invoice, icon: CreditCard },
    { id: 'profile', label: t.profile, icon: User },
    { id: 'tickets', label: t.support_ticket, icon: Ticket },
    { id: 'assistant', label: t.smart_helpline, icon: MessageSquare },
  ];

  return (
    <nav className="flex flex-col space-y-1 mt-6">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
            closeMenu();
          }}
          className={`flex items-center space-x-3 p-3.5 rounded-xl transition-all ${
            activeTab === item.id 
              ? 'bg-[#00a651] text-white shadow-lg' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#00a651]'
          }`}
        >
          <item.icon size={18} />
          <span className="font-semibold text-sm">{item.label}</span>
        </button>
      ))}
      
      {deferredPrompt && (
        <button
          onClick={onInstall}
          className="flex items-center space-x-3 p-3.5 rounded-xl transition-all text-[#00a651] bg-emerald-50 hover:bg-emerald-100 mt-4 border border-emerald-100 border-dashed"
        >
          <div className="p-1"><Smartphone size={18} /></div>
          <span className="font-bold text-sm">{t.install_app}</span>
        </button>
      )}
    </nav>
  );
};

const BottomNav: React.FC<{ activeTab: Tab; setActiveTab: (t: Tab) => void; t: any }> = ({ activeTab, setActiveTab, t }) => {
  const items = [
    { id: 'dashboard' as Tab, label: t.home, icon: Home },
    { id: 'parcels' as Tab, label: t.parcels + ' List', icon: List },
    { id: 'notification' as Tab, label: t.notification, icon: Bell, hasBadge: true },
    { id: 'profile' as Tab, label: t.profile, icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-6 py-2 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] pb-safe">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center space-y-1 w-20 transition-all duration-300 relative ${
              activeTab === item.id ? 'text-[#00a651]' : 'text-gray-400'
            }`}
          >
            <div className={`p-1 relative transition-all duration-300 ${activeTab === item.id ? 'scale-110 -translate-y-1' : 'scale-100 translate-y-0'}`}>
              <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              {item.hasBadge && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest text-center ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute -bottom-1 w-6 h-1 bg-[#00a651] rounded-full animate-scale-in"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('eks_current_session'));
  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem('myParcels');
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    const saved = localStorage.getItem('myPaymentMethods');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('myTransactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const session = localStorage.getItem('eks_current_session');
    const parsedSession = session ? JSON.parse(session) : {};
    const savedBalance = localStorage.getItem('myBalance');
    
    return {
      merchantId: parsedSession.id || "MID-" + Math.floor(10000 + Math.random() * 90000),
      name: parsedSession.name || 'Merchant',
      shopName: parsedSession.shopName || 'EKSO Courier Merchant',
      phone: parsedSession.phone || '',
      contactNumber: '',
      email: parsedSession.email || '',
      address: '',
      businessType: '',
      website: '',
      joinedAt: parsedSession.joinedAt || new Date().toISOString(),
      balance: savedBalance ? parseFloat(savedBalance) : 0,
      pickupMode: 'On-demand',
      defaultPaymentMethod: 'Cash',
      paymentMethods: [],
      transactions: [],
    };
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[1]); // Default to Bengali
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const t = translations[selectedLang.code] || translations.bn;
  const isRtl = selectedLang.code === 'ar';

  useEffect(() => {
    localStorage.setItem('myParcels', JSON.stringify(parcels));
    localStorage.setItem('myBalance', user.balance.toString());
    localStorage.setItem('myPaymentMethods', JSON.stringify(paymentMethods));
    localStorage.setItem('myTransactions', JSON.stringify(transactions));
  }, [parcels, user.balance, paymentMethods, transactions]);

  const handleLogout = () => {
    localStorage.removeItem('eks_current_session');
    setIsAuthenticated(false);
  };

  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      setDeferredPrompt(null);
    }
  };

  const addParcel = (parcelData: Omit<Parcel, 'status' | 'createdAt' | 'trackingHistory'>) => {
    const newParcel: Parcel = {
      ...parcelData,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'Order Placed',
          location: user.address || 'Pickup Point',
          timestamp: new Date().toISOString(),
          handlerName: user.name,
          handlerPhone: user.phone,
          hubPhone: '01XXXXXXXXX',
          description: 'পার্সেলটি সফলভাবে সিস্টেমে যুক্ত করা হয়েছে।'
        }
      ]
    };
    setParcels(prev => [newParcel, ...prev]);
  };

  const deleteParcel = (id: string) => {
    setParcels(prev => prev.filter(p => p.id !== id));
  };

  const updateStatus = (id: string, status: Parcel['status']) => {
    setParcels(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    
    // Auto balance logic: if delivered, add net amount (simplification for prototype)
    if (status === 'Delivered') {
      const parcel = parcels.find(p => p.id === id);
      if (parcel) {
        const codCharge = parcel.amount * 0.01;
        const deliveryCharge = 80; // Default
        const net = parcel.amount - (codCharge + deliveryCharge);
        setUser(prev => ({ ...prev, balance: prev.balance + net }));
      }
    }
  };

  const downloadExcel = () => {
    const dataToExport = parcels.map(p => ({
      'ID': p.id,
      'Customer': p.customerName,
      'Phone': p.phone,
      'Address': p.address,
      'Amount': p.amount,
      'Weight': p.weight,
      'Status': p.status,
      'Created': new Date(p.createdAt).toLocaleString()
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parcels");
    XLSX.writeFile(wb, "eks_parcels_report.xlsx");
  };

  if (!isAuthenticated) {
    return <Auth onLogin={(userData) => { setIsAuthenticated(true); setUser(prev => ({ ...prev, ...userData })); }} t={t} selectedLang={selectedLang} setSelectedLang={setSelectedLang} languages={languages} />;
  }

  return (
    <div className={`min-h-screen flex bg-[#f8fafc] ${isRtl ? 'font-arabic' : ''}`}>
      <aside className={`hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-5 fixed inset-y-0 shadow-sm z-30 ${isRtl ? 'right-0 border-l border-r-0' : 'left-0'}`}>
        <div className="mb-4 mt-2 overflow-hidden flex justify-start" onClick={() => setActiveTab('dashboard')}>
          <EksoLogo scale={0.6} />
        </div>
        
        <div className="mb-6 px-2 mt-4">
           <div 
             onClick={() => setActiveTab('profile')}
             className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex items-center space-x-3 rtl:space-x-reverse cursor-pointer hover:bg-emerald-50 transition-colors"
           >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#00a651] shrink-0">
                <User size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-400 font-bold uppercase leading-none truncate">{user.shopName || 'Shop'}</p>
                <p className="text-xs font-bold text-gray-800 truncate mt-1">{user.name}</p>
              </div>
           </div>
        </div>

        <NavigationLinks activeTab={activeTab} setActiveTab={setActiveTab} closeMenu={() => {}} t={t} deferredPrompt={deferredPrompt} onInstall={handleInstallApp} />
        
        <div className="mt-auto space-y-2">
          <button onClick={handleLogout} className="flex items-center space-x-3 rtl:space-x-reverse w-full p-3 text-rose-600 font-bold text-sm bg-rose-50 rounded-xl hover:bg-rose-100 transition-all">
            <LogOut size={18} /><span>{t.logout}</span>
          </button>
          <button onClick={downloadExcel} className="flex items-center space-x-3 rtl:space-x-reverse w-full p-3 text-emerald-600 font-bold text-sm bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all">
            <Download size={18} /><span>Download XLS</span>
          </button>
          <div className="text-[10px] text-center text-gray-400 py-2">
            EKSO Courier Ltd. v3.1.2
          </div>
        </div>
      </aside>

      <main className={`flex-1 ${isRtl ? 'lg:mr-64' : 'lg:ml-64'} min-h-screen flex flex-col pb-24 lg:pb-0`}>
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu /></button>
             <div className="lg:hidden scale-[0.35] origin-left -ml-2" onClick={() => setActiveTab('dashboard')}>
               <EksoLogo />
             </div>
             <div className="hidden lg:flex items-center space-x-2 text-gray-400 text-sm font-medium rtl:space-x-reverse">
                <Store size={16} />
                <span className="font-bold text-gray-700">{user.shopName}</span>
                <span className="mx-2 text-gray-200">|</span>
                <span>{t.server_status}:</span>
                <span className="flex items-center text-emerald-600"><span className={`w-2 h-2 bg-emerald-500 rounded-full animate-pulse ${isRtl ? 'ml-2' : 'mr-2'}`}></span>{t.online}</span>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="hidden md:flex relative group w-64 mr-2">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={16} />
              <input 
                type="text" 
                placeholder="Search order..." 
                value={globalSearchTerm} 
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                className={`w-full ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-gray-50 border border-gray-100 rounded-full focus:bg-white focus:border-[#00a651] outline-none text-xs font-bold transition-all`} 
              />
            </div>
             <button onClick={() => setShowBalance(!showBalance)} className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:text-[#00a651] transition-colors"><Wallet size={20} /></button>
             <button onClick={() => setIsLangOpen(!isLangOpen)} className="p-2.5 bg-gray-50 rounded-xl text-gray-600 hover:text-[#00a651] transition-colors"><Globe size={20} /></button>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1">
          {activeTab === 'dashboard' && <Dashboard user={user} parcels={parcels} onDelete={deleteParcel} onUpdateStatus={updateStatus} onAddParcel={addParcel} onUpdateParcel={() => {}} t={t} searchTerm={globalSearchTerm} setSearchTerm={setGlobalSearchTerm} />}
          {activeTab === 'parcels' && <Dashboard user={user} parcels={parcels} onDelete={deleteParcel} onUpdateStatus={updateStatus} onAddParcel={addParcel} onUpdateParcel={() => {}} t={t} searchTerm={globalSearchTerm} setSearchTerm={setGlobalSearchTerm} hideStats />}
          {activeTab === 'profile' && <Profile user={user} paymentMethods={paymentMethods} onUpdate={setUser} onUpdatePaymentMethod={() => {}} onLogout={handleLogout} t={t} />}
          {activeTab === 'add' && <ParcelForm onSubmit={addParcel} t={t} merchant={user} />}
          {activeTab === 'assistant' && <Assistant t={t} />}
          {activeTab === 'advice' && <Advice t={t} />}
        </div>
        
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
      </main>
    </div>
  );
};

export default App;
