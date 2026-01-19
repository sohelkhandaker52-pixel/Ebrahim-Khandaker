
import React, { useState } from 'react';
import { User, Lock, Mail, Store, Phone, Eye, EyeOff, Package, ChevronRight, ArrowLeft, ShieldCheck, Globe, ChevronDown, Navigation, ArrowUpRight } from 'lucide-react';
import { LanguageCode, translations } from '../translations';

// Defined AuthProps to fix missing name error
interface AuthProps {
  onLogin: (userData: any) => void;
  t: any;
  selectedLang: any;
  setSelectedLang: (lang: any) => void;
  languages: any[];
}

export const EksoLogo: React.FC<{ light?: boolean; scale?: number; className?: string }> = ({ light = false, scale = 1, className = "" }) => (
  <div 
    className={`flex flex-col items-center leading-none group cursor-pointer transition-transform active:scale-95 ${className}`}
    style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
  >
    <div className="flex items-center gap-0.5">
      <span className={`text-6xl font-black italic tracking-tighter ${light ? 'text-white' : 'text-[#1a1c24]'}`}>
        EKS
      </span>
      <div className="relative mt-1">
        {/* The 'O' Circle */}
        <div className={`w-14 h-14 rounded-full border-[11px] flex items-center justify-center ${light ? 'border-white' : 'border-[#1a1c24]'}`}>
          {/* Inner Green Dot */}
          <div className="w-6 h-6 bg-[#00a651] rounded-full shadow-inner"></div>
        </div>
        {/* The Precise Green Arrow Pointer as seen in the image */}
        <div className="absolute -top-4 -right-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L10 6L16 10L22 2Z" fill="#00a651"/>
          </svg>
        </div>
      </div>
    </div>
    <div className="mt-2 tracking-[0.45em] ml-2">
      <span className={`text-[12px] font-black uppercase ${light ? 'text-white/80' : 'text-[#00a651]'}`}>
        COURIER LTD.
      </span>
    </div>
  </div>
);

const Auth: React.FC<AuthProps> = ({ onLogin, t, selectedLang, setSelectedLang, languages }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    shopName: '',
    name: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('eks_users') || '[]');
      
      if (mode === 'signup') {
        const newUser = { 
          ...formData, 
          id: 'MID-' + Math.floor(10000 + Math.random() * 90000),
          joinedAt: new Date().toISOString(),
          balance: 0
        };
        users.push(newUser);
        localStorage.setItem('eks_users', JSON.stringify(users));
        localStorage.setItem('eks_current_session', JSON.stringify(newUser));
        onLogin(newUser);
      } else if (mode === 'login') {
        const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
        if (user) {
          localStorage.setItem('eks_current_session', JSON.stringify(user));
          onLogin(user);
        } else {
          alert(selectedLang.code === 'bn' ? 'ইমেইল বা পাসওয়ার্ড সঠিক নয়!' : 'Invalid email or password.');
        }
      } else if (mode === 'forgot') {
        alert(selectedLang.code === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে।' : 'Reset link sent to your email.');
        setMode('login');
      }
      
      setLoading(false);
    }, 1200);
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 relative overflow-hidden p-4 sm:p-6 font-hind">
      {/* Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-300/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-300/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Top Language Selector on Auth Screen */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center space-x-2 rtl:space-x-reverse bg-white/40 backdrop-blur-md border border-white/60 px-4 py-2 rounded-2xl text-gray-700 hover:bg-white/60 transition-all shadow-sm group"
        >
          <Globe size={18} className="text-[#00a651]" />
          <span className="font-bold text-xs">{selectedLang.native}</span>
          <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
        </button>

        {isLangOpen && (
          <div className={`absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl border border-white rounded-2xl shadow-2xl py-2 z-[60] animate-fade-in max-h-[60vh] overflow-y-auto custom-scrollbar`}>
            {languages.map(lang => (
              <button 
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang);
                  setIsLangOpen(false);
                }}
                className={`w-full text-left px-5 py-2.5 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${selectedLang.code === lang.code ? 'text-[#00a651] font-bold' : 'text-gray-600'}`}
              >
                <span>{lang.native}</span>
                {selectedLang.code === lang.code && <div className="w-1.5 h-1.5 bg-[#00a651] rounded-full"></div>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        {/* Main Glassmorphism Container */}
        <div className="bg-white/40 backdrop-blur-[50px] border border-white/60 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500">
          <div className="p-8 sm:p-14">
            {/* Logo and Header */}
            <div className="flex flex-col items-center text-center">
              <EksoLogo className="mb-8" />
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                {mode === 'login' ? t.login : mode === 'signup' ? t.signup : t.reset_password}
              </h1>
              <p className="text-gray-500 font-bold text-sm mb-10">
                {mode === 'login' ? t.auth_subtitle : (selectedLang.code === 'bn' ? 'EKSO কুরিয়ারে যুক্ত হোন' : 'Join EKSO Courier Service')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.shop_name}</label>
                    <div className="relative group">
                      <Store className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder="Shop Name"
                        className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white/60 border border-white/80 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 transition-all font-bold text-gray-900 shadow-sm`}
                        value={formData.shopName}
                        onChange={e => setFormData({...formData, shopName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.owner_name}</label>
                    <div className="relative group">
                      <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
                      <input 
                        required 
                        type="text" 
                        placeholder="Owner Name"
                        className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white/60 border border-white/80 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 transition-all font-bold text-gray-900 shadow-sm`}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.mobile_number || t.phone}</label>
                    <div className="relative group">
                      <Phone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
                      <input 
                        required 
                        type="tel" 
                        placeholder="017XXXXXXXX"
                        className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white/60 border border-white/80 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 transition-all font-bold text-gray-900 shadow-sm`}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{t.email}</label>
                <div className="relative group">
                  <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder="email@example.com"
                    className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white/60 border border-white/80 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 transition-all font-bold text-gray-900 shadow-sm`}
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <div className="ml-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.password}</label>
                  </div>
                  <div className="relative group">
                    <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
                    <input 
                      required 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      className={`w-full ${isRtl ? 'pr-12 pl-12' : 'pl-12 pr-12'} py-4 bg-white/60 border border-white/80 rounded-2xl outline-none focus:bg-white focus:border-emerald-400 transition-all font-bold text-gray-900 shadow-sm`}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Combined Options Area: Remember Me + Forgot Password */}
                  {mode === 'login' && (
                    <div className="flex items-center justify-between px-2 pt-1">
                      <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#00a651] focus:ring-[#00a651] cursor-pointer"
                        />
                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors uppercase tracking-tight">
                          {t.remember_me || "Remember Me"}
                        </span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[10px] font-black text-[#00a651] hover:text-emerald-700 uppercase tracking-widest transition-colors"
                      >
                        {t.forgot_password}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#00a651] text-white font-black py-5 rounded-3xl flex items-center justify-center space-x-3 rtl:space-x-reverse hover:bg-[#008d44] transition-all active:scale-95 shadow-2xl shadow-emerald-200/50 disabled:opacity-70 group mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="text-lg">{mode === 'login' ? t.login : mode === 'signup' ? t.signup : t.reset_password}</span>
                    <ChevronRight size={22} className={`transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/40 text-center">
              {mode === 'login' ? (
                <p className="text-sm font-bold text-gray-500">
                  {t.dont_have_account} {' '}
                  <button onClick={() => setMode('signup')} className="text-[#00a651] font-black hover:underline uppercase tracking-tight transition-all active:scale-95">{t.signup}</button>
                </p>
              ) : (
                <button 
                  onClick={() => setMode('login')} 
                  className="group flex items-center justify-center gap-2 w-full text-sm font-black text-gray-500 hover:text-gray-800 transition-all uppercase tracking-widest active:scale-95"
                >
                  <ArrowLeft size={18} className={`transition-transform group-hover:-translate-x-1 ${isRtl ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                  {t.back_to_login}
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-10 space-y-3 opacity-60">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              <ShieldCheck size={14} className="text-[#00a651]" />
              Secure Session Management
           </div>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">EKSO Courier Ltd. v3.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
