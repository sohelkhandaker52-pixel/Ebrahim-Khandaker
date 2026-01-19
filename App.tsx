
import React, { useState, useEffect } from 'react';
import { Parcel, UserProfile, PaymentMethod, Transaction, TrackingStep } from './types';
import { LanguageCode, translations } from './translations';
import Dashboard from './components/Dashboard';
import ParcelForm from './components/ParcelForm';
import Assistant from './components/Assistant';
import Advice from './components/Advice';
import PaymentInvoice from './components/PaymentInvoice';
import Profile from './components/Profile';
import TopUp from './components/TopUp';
import PickupRequest from './components/PickupRequest';
import Auth from './components/Auth';
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
          <Smartphone size={18} />
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

const ShohozLogo: React.FC<{ light?: boolean }> = ({ light = false }) => (
  <div className="flex flex-col items-start leading-none group cursor-pointer transition-transform active:scale-95">
    <div className="flex items-baseline gap-0">
      <span className={`text-3xl font-black italic tracking-tighter ${light ? 'text-white' : 'text-gray-900'}`}>
        Shoh
      </span>
      <div className="relative">
        <div className={`w-7 h-7 rounded-full border-[5px] flex items-center justify-center ${light ? 'border-white' : 'border-gray-900'}`}>
          <div className="w-3 h-3 bg-[#00a651] rounded-full shadow-inner"></div>
        </div>
        <div className="absolute -top-1.5 -right-3 transform rotate-[15deg] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
          <Navigation size={20} fill="#00a651" className="text-[#00a651]" />
        </div>
      </div>
      <span className={`text-3xl font-black italic tracking-tighter ${light ? 'text-white' : 'text-gray-900'}`}>
        z
      </span>
    </div>
    <div className="flex items-center w-full gap-2 mt-0.5">
      <div className={`h-[1px] flex-grow ${light ? 'bg-white/40' : 'bg-gray-200'}`}></div>
      <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${light ? 'text-white/80' : 'text-gray-500'}`}>
        Courier Ltd.
      </span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('eks_current_session');
  });

  const [parcels, setParcels] = useState<Parcel[]>(() => {
    const saved = localStorage.getItem('myParcels');
    const initial = saved ? JSON.parse(saved) : [];
    return initial.map((p: any) => ({
      ...p,
      trackingHistory: p.trackingHistory || []
    }));
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
    
    const savedProfile = localStorage.getItem('merchantProfile');
    const savedBalance = localStorage.getItem('myBalance');
    const parsedProfile = savedProfile ? JSON.parse(savedProfile) : {};
    
    return {
      merchantId: parsedProfile.merchantId || parsedSession.id || "MID-" + Math.floor(10000 + Math.random() * 90000),
      name: parsedProfile.name || parsedSession.name || 'Merchant',
      shopName: parsedProfile.shopName || parsedSession.shopName || 'Shohoz Courier Merchant',
      phone: parsedProfile.phone || parsedSession.phone || '',
      contactNumber: parsedProfile.contactNumber || '',
      email: parsedProfile.email || parsedSession.email || '',
      address: parsedProfile.address || '',
      businessType: parsedProfile.businessType || 'General Store',
      website: parsedProfile.website || '',
      joinedAt: parsedProfile.joinedAt || new Date().toISOString(),
      balance: savedBalance ? parseFloat(savedBalance) : 0,
      pickupMode: parsedProfile.pickupMode || 'On-demand',
      defaultPaymentMethod: parsedProfile.defaultPaymentMethod || 'Cash',
      paymentMethods: [],
      transactions: [],
    };
  });

  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  const t = translations[selectedLang.code] || translations.en;

  const isRevenueGenerating = (status: Parcel['status']) => ['Delivered', 'Paid'].includes(status);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      setDeferredPrompt(null);
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('myParcels', JSON.stringify(parcels));
      localStorage.setItem('myBalance', user.balance.toString());
      localStorage.setItem('merchantProfile', JSON.stringify(user));
      localStorage.setItem('myPaymentMethods', JSON.stringify(paymentMethods));
      localStorage.setItem('myTransactions', JSON.stringify(transactions));
    }
    
    if (selectedLang.code === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = selectedLang.code;
  }, [parcels, user, selectedLang, paymentMethods, transactions, isAuthenticated]);

  const calculateNetAmount = (amount: number, weight: string) => {
    const weightVal = parseFloat(weight) || 0.5;
    const deliveryCharge = 80 + Math.max(0, Math.ceil(weightVal - 1)) * 20;
    const codCharge = amount * 0.01;
    const totalCharge = deliveryCharge + codCharge;
    return amount - totalCharge;
  };

  const addTransaction = (type: Transaction['type'], amount: number, method?: string, note?: string) => {
    const newTx: Transaction = {
      id: "TX-" + Date.now().toString().slice(-6),
      type,
      amount,
      method,
      status: 'Completed',
      timestamp: new Date().toISOString(),
      note
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleLogin = (userData: any) => {
    setUser(prev => ({
      ...prev,
      merchantId: userData.id,
      name: userData.name,
      shopName: userData.shopName,
      email: userData.email,
      phone: userData.phone
    }));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('eks_current_session');
    setIsAuthenticated(false);
  };

  const addParcel = (parcel: Omit<Parcel, 'status' | 'createdAt' | 'trackingHistory'>) => {
    const initialTracking: TrackingStep[] = [
      {
        status: 'Order Placed',
        description: 'অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।',
        location: user.address || 'Merchant Location',
        timestamp: new Date().toISOString(),
        handlerName: user.name,
        handlerPhone: user.phone,
        hubPhone: '01712345678'
      }
    ];

    const newParcel: Parcel = {
      ...parcel,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      trackingHistory: initialTracking,
    };

    setParcels(prev => [newParcel, ...prev]);
  };

  const updateParcel = (updatedParcel: Parcel) => {
    const oldParcel = parcels.find(p => p.id === updatedParcel.id);
    if (!oldParcel) return;

    const oldNet = calculateNetAmount(oldParcel.amount, oldParcel.weight);
    const newNet = calculateNetAmount(updatedParcel.amount, updatedParcel.weight);
    
    const wasRevenue = isRevenueGenerating(oldParcel.status);
    const isRevenue = isRevenueGenerating(updatedParcel.status);

    let balanceAdj = 0;
    if (wasRevenue && isRevenue) {
       balanceAdj = newNet - oldNet;
    } else if (!wasRevenue && isRevenue) {
       balanceAdj = newNet;
    } else if (wasRevenue && !isRevenue) {
       balanceAdj = -oldNet;
    }

    setParcels(prev => prev.map(p => p.id === updatedParcel.id ? updatedParcel : p));
    if (balanceAdj !== 0) {
      setUser(prev => ({ ...prev, balance: prev.balance + balanceAdj }));
      addTransaction(balanceAdj > 0 ? 'Order Income' : 'Charge', Math.abs(balanceAdj), 'Correction', `Updated Order ${updatedParcel.id}`);
    }
    setActiveTab('dashboard');
  };

  const deleteParcel = (id: string) => {
    const parcelToDelete = parcels.find(p => p.id === id);
    if (!parcelToDelete) return;
    
    const netAmount = calculateNetAmount(parcelToDelete.amount, parcelToDelete.weight);
    const wasRevenue = isRevenueGenerating(parcelToDelete.status);

    setParcels(prev => prev.filter(p => p.id !== id));
    if (wasRevenue) {
      setUser(prev => ({ ...prev, balance: prev.balance - netAmount }));
      addTransaction('Charge', netAmount, 'Correction', `Deleted Order ${id}`);
    }
  };

  const updateStatus = (id: string, newStatus: Parcel['status']) => {
    const parcel = parcels.find(p => p.id === id);
    if (!parcel) return;

    const oldStatus = parcel.status;
    if (oldStatus === newStatus) return;

    const wasRevenue = isRevenueGenerating(oldStatus);
    const isRevenue = isRevenueGenerating(newStatus);
    const netAmount = calculateNetAmount(parcel.amount, parcel.weight);

    let balanceAdj = 0;
    if (!wasRevenue && isRevenue) {
      balanceAdj = netAmount;
    } else if (wasRevenue && !isRevenue) {
      balanceAdj = -netAmount;
    }

    const newStep: TrackingStep = {
      status: newStatus,
      description: `অর্ডারের অবস্থা পরিবর্তন করা হয়েছে: ${newStatus}`,
      location: 'Central Distribution Hub',
      timestamp: new Date().toISOString(),
      handlerName: 'Shohoz Ops Manager',
      handlerPhone: '01887654321',
      hubPhone: '01991234567'
    };

    setParcels(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: newStatus, 
      trackingHistory: [...p.trackingHistory, newStep] 
    } : p));
    
    if (balanceAdj !== 0) {
      setUser(prev => ({ ...prev, balance: prev.balance + balanceAdj }));
      addTransaction(balanceAdj > 0 ? 'Order Income' : 'Charge', Math.abs(balanceAdj), 'System', `Status: ${newStatus} (${id})`);
    }
  };

  const handleTopUp = (amount: number, method: string) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    addTransaction('Top-up', amount, method, `Added money via ${method}`);
  };

  const handlePaymentSettlement = (settledAmount: number) => {
    setParcels(prev => prev.map(p => {
      if (p.status === 'Delivered') {
        const paidStep: TrackingStep = {
          status: 'Paid',
          description: 'পেমেন্ট সেটেলমেন্ট সফলভাবে সম্পন্ন হয়েছে।',
          location: 'Merchant Bank Account',
          timestamp: new Date().toISOString(),
          handlerName: 'Accounts Admin',
          handlerPhone: '01000000000',
          hubPhone: '01000000000'
        };
        return { ...p, status: 'Paid', trackingHistory: [...p.trackingHistory, paidStep] };
      }
      return p;
    }));
    addTransaction('Withdrawal', settledAmount, 'Settlement', 'Settled all delivered parcels');
    setUser(prev => ({ ...prev, balance: 0 }));
  };

  const savePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prev => {
      const exists = prev.find(m => m.id === method.id);
      if (exists) {
        return prev.map(m => m.id === method.id ? method : m);
      }
      return [...prev, method];
    });
  };

  const deletePaymentMethod = (id: string) => {
    if (window.confirm('Delete this payment method?')) {
      setPaymentMethods(prev => prev.filter(m => m.id !== id));
    }
  };

  const downloadExcel = () => {
    const data = parcels.map(p => ({
      'ID': p.id,
      'Customer': p.customerName,
      'Phone': p.phone,
      'Amount': p.amount,
      'Status': p.status,
      'Date': new Date(p.createdAt).toLocaleString()
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Consignments");
    XLSX.writeFile(wb, `Shohoz_Report_${Date.now()}.xlsx`);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} t={t} selectedLang={selectedLang} setSelectedLang={setSelectedLang} languages={languages} />;
  }

  const isRtl = selectedLang.code === 'ar';

  return (
    <div className={`min-h-screen flex bg-[#f8fafc] ${isRtl ? 'font-arabic' : ''}`}>
      <aside className={`hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-5 fixed inset-y-0 shadow-sm z-30 ${isRtl ? 'right-0 border-l border-r-0' : 'left-0'}`}>
        <div className="mb-8" onClick={() => setActiveTab('dashboard')}>
          <ShohozLogo />
        </div>
        
        <div className="mb-6 px-2">
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
            <Download size={18} /><span>Download Report</span>
          </button>
          <div className="text-[10px] text-center text-gray-400 py-2">
            Shohoz Courier Ltd. v2.0.26
          </div>
        </div>
      </aside>

      <main className={`flex-1 ${isRtl ? 'lg:mr-64' : 'lg:ml-64'} min-h-screen flex flex-col pb-24 lg:pb-0`}>
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm px-6">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Menu /></button>
             <div className="lg:hidden" onClick={() => setActiveTab('dashboard')}>
               <ShohozLogo />
             </div>
             <div className="hidden lg:flex items-center space-x-2 text-gray-400 text-sm font-medium rtl:space-x-reverse">
                <Store size={16} />
                <span className="font-bold text-gray-700">{user.shopName}</span>
                <span className="mx-2 text-gray-200">|</span>
                <span>{t.server_status}:</span>
                <span className="flex items-center text-emerald-600"><span className={`w-2 h-2 bg-emerald-500 rounded-full animate-pulse ${isRtl ? 'ml-2' : 'mr-2'}`}></span>{t.online}</span>
             </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="hidden md:flex relative group w-64 mr-2">
              <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={16} />
              <input 
                type="text" 
                placeholder="Search engine..." 
                value={globalSearchTerm} 
                onChange={(e) => {
                  setGlobalSearchTerm(e.target.value);
                  if (activeTab !== 'dashboard' && activeTab !== 'parcels') setActiveTab('parcels');
                }}
                className={`w-full ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-gray-50 border border-gray-100 rounded-full focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 outline-none text-xs font-bold transition-all placeholder:text-gray-300`} 
              />
            </div>

            <div className="flex items-center space-x-2">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowBalance(!showBalance);
                }}
                className="group relative flex items-center bg-white border border-gray-200 hover:border-[#00a651] rounded-full py-1 px-1 pr-4 cursor-pointer transition-all duration-300 shadow-sm active:scale-95"
              >
                <div className="bg-[#00a651] w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Wallet size={16} />
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('payments');
                  }}
                  className="ml-2 overflow-hidden flex flex-col justify-center min-w-[100px] hover:bg-gray-50 rounded-lg px-1 transition-colors"
                >
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5">{t.merchant_balance}</p>
                  <div className="relative h-4">
                    {showBalance ? (
                      <span className="absolute inset-0 text-sm font-black text-gray-900 animate-fade-in flex items-center">
                        ৳ {user.balance.toLocaleString()}
                      </span>
                    ) : (
                      <span className="absolute inset-0 text-[10px] font-bold text-[#00a651] animate-fade-in flex items-center">
                        {t.tap_reveal}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`ml-2 text-gray-300 transition-colors group-hover:text-[#00a651] ${showBalance ? 'rotate-180' : ''}`}>
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </div>
              </div>

              <button 
                onClick={downloadExcel}
                className="p-2.5 rounded-xl border border-gray-100 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 transition-all active:scale-95"
                title="Download XLS Report"
              >
                <FileSpreadsheet size={20} />
              </button>
            </div>

            <button 
              onClick={() => setActiveTab('profile')}
              className={`p-2.5 rounded-xl border transition-all ${activeTab === 'profile' ? 'bg-[#00a651] text-white border-[#00a651] shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:bg-emerald-50 hover:text-[#00a651]'}`}
            >
              <User size={20} />
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-50 px-4 py-2 rounded-xl text-[#00a651] hover:bg-emerald-100 transition-all active:scale-95 group"
              >
                <Globe size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="font-bold text-sm hidden sm:inline">{selectedLang.native}</span>
                <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-[60] animate-fade-in max-h-[70vh] overflow-y-auto custom-scrollbar`}>
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Language</div>
                  {languages.map(lang => (
                    <button 
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${selectedLang.code === lang.code ? 'text-[#00a651] font-bold bg-emerald-50/50' : 'text-gray-600'}`}
                    >
                      <span>{lang.native}</span>
                      {selectedLang.code === lang.code && <div className="w-1.5 h-1.5 bg-[#00a651] rounded-full"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`w-64 bg-white h-full p-6 shadow-2xl ${isRtl ? 'mr-auto' : 'ml-0'}`} onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-8">
                <ShohozLogo />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
              </div>
              <NavigationLinks activeTab={activeTab} setActiveTab={setActiveTab} closeMenu={() => setIsMobileMenuOpen(false)} t={t} deferredPrompt={deferredPrompt} onInstall={handleInstallApp} />
              <button onClick={handleLogout} className="flex items-center space-x-3 rtl:space-x-reverse w-full p-3.5 text-rose-600 font-bold text-sm bg-rose-50 rounded-xl hover:bg-rose-100 transition-all mt-4">
                <LogOut size={18} /><span>{t.logout}</span>
              </button>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {(activeTab === 'dashboard' || activeTab === 'parcels') && <Dashboard user={user} parcels={parcels} onDelete={deleteParcel} onUpdateStatus={updateStatus} onAddParcel={addParcel} onUpdateParcel={updateParcel} onNavigate={setActiveTab} t={t} searchTerm={globalSearchTerm} setSearchTerm={setGlobalSearchTerm} hideList={activeTab === 'dashboard'} hideStats={activeTab === 'parcels'} />}
          {activeTab === 'add' && <ParcelForm onSubmit={addParcel} t={t} merchant={user} />}
          {activeTab === 'assistant' && <Assistant t={t} />}
          {activeTab === 'advice' && <Advice t={t} />}
          {activeTab === 'profile' && <Profile user={user} paymentMethods={paymentMethods} onUpdate={(u) => setUser({...user, ...u})} onUpdatePaymentMethod={savePaymentMethod} onLogout={handleLogout} t={t} />}
          {activeTab === 'topup' && <TopUp balance={user.balance} transactions={transactions} onTopUp={handleTopUp} t={t} />}
          {activeTab === 'pickup' && <PickupRequest merchantAddress={user.address} merchantPhone={user.phone} merchantName={user.name} t={t} />}
          {activeTab === 'payments' && (
            <PaymentInvoice 
              parcels={parcels} 
              paymentMethods={paymentMethods} 
              onSaveMethod={savePaymentMethod} 
              onDeleteMethod={deletePaymentMethod} 
              onSettlePayments={handlePaymentSettlement}
              t={t} 
            />
          )}
          {activeTab === 'notification' && (
            <div className="bg-white p-12 lg:p-20 rounded-[2.5rem] text-center shadow-sm border border-gray-100 animate-fade-in flex flex-col items-center max-w-2xl mx-auto mt-10">
               <div className="bg-emerald-50 p-6 rounded-full text-[#00a651] mb-6">
                 <Bell size={48} className="animate-bounce" />
               </div>
               <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{t.notification} Center</h3>
               <p className="text-gray-500 mt-4 font-bold leading-relaxed">
                 {selectedLang.code === 'bn' 
                   ? 'আপনার সকল ডেলিভারি আপডেট এবং পেমেন্ট নোটিফিকেশন এখানে দেখা যাবে। বর্তমানে কোনো নতুন নোটিফিকেশন নেই।' 
                   : 'All your delivery updates and payment notifications will appear here. Currently, there are no new notifications.'}
               </p>
               <button onClick={() => setActiveTab('dashboard')} className="mt-8 bg-[#00a651] text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all">
                 {t.dashboard}
               </button>
            </div>
          )}
          {(activeTab === 'coverage' || activeTab === 'fraud' || activeTab === 'tickets' || activeTab === 'summary') && (
            <div className="bg-white p-20 rounded-[2.5rem] text-center shadow-sm border border-gray-100 animate-fade-in">
               <Settings size={48} className="mx-auto text-gray-200 mb-4 animate-spin-slow" />
               <h3 className="text-xl font-bold text-gray-800">Under Construction</h3>
               <p className="text-gray-500 mt-2">Module "{t[activeTab] || activeTab}" is being updated.</p>
               <button onClick={() => setActiveTab('dashboard')} className="mt-6 text-[#00a651] font-bold hover:underline">Back to Dashboard</button>
            </div>
          )}
        </div>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} t={t} />
      </main>
    </div>
  );
};

export default App;
