
import React, { useState, useMemo } from 'react';
import { Parcel, UserProfile, TrackingStep } from '../types';
import { Wallet, Package, Clock, Search, Trash2, MapPin, Phone, CheckCircle, Plus, X, Eye, EyeOff, Calculator, TrendingUp, Truck, Zap, History, BarChart3, RotateCcw, XCircle, ShieldAlert, Ticket, Pencil, AlertTriangle, ChevronDown, Megaphone, Sparkles, User as UserIcon, Calendar, ArrowRight, Building2, Lightbulb, Printer, List, Eye as EyeIcon, SearchCode, Repeat, HelpCircle, CreditCard, PlusCircle, Hash } from 'lucide-react';
import ParcelForm from './ParcelForm';
import ShippingLabel from './ShippingLabel';

interface DashboardProps {
  user: UserProfile;
  parcels: Parcel[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Parcel['status']) => void;
  onAddParcel: (parcel: Omit<Parcel, 'status' | 'createdAt' | 'trackingHistory'>) => void;
  onUpdateParcel: (parcel: Parcel) => void;
  onNavigate?: (tab: any) => void;
  t: any;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  hideList?: boolean;
  hideStats?: boolean;
}

type FilterStatus = Parcel['status'] | 'All';

interface ConfirmConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  type: 'danger' | 'primary';
}

const Dashboard: React.FC<DashboardProps> = ({ user, parcels, onDelete, onUpdateStatus, onAddParcel, onUpdateParcel, onNavigate, t, searchTerm, setSearchTerm, hideList = false, hideStats = false }) => {
  const [activeListFilter, setActiveListFilter] = useState<FilterStatus>('All');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);
  const [selectedTrackingParcel, setSelectedTrackingParcel] = useState<Parcel | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState<Parcel | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'primary'
  });

  const getStatusColor = (status: Parcel['status']) => {
    switch (status) {
      case 'Pending': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'In Transit': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Delivered': return 'bg-emerald-100 text-[#00a651] border-emerald-200';
      case 'Returned': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'Paid': return 'bg-emerald-100 text-[#00a651] border-emerald-200';
      case 'Hold': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Partial Delivery': return 'bg-cyan-100 text-cyan-600 border-cyan-200';
      case 'In Review': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'Waiting Approval': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Cancelled': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const parcelStatsSummary = useMemo(() => {
    const totalCount = parcels.length || 0;
    const countByStatus = (s: Parcel['status']) => parcels.filter(p => p.status === s).length;
    
    const summaryItems = [
      { id: 'Delivered' as FilterStatus, label: 'ডেলিভারি', count: countByStatus('Delivered'), color: 'emerald' },
      { id: 'Pending' as FilterStatus, label: 'পেন্ডিং', count: countByStatus('Pending'), color: 'amber' },
      { id: 'In Transit' as FilterStatus, label: 'ইন ট্রানজিট', count: countByStatus('In Transit'), color: 'blue' },
      { id: 'Returned' as FilterStatus, label: 'রিটার্ন', count: countByStatus('Returned'), color: 'red' },
      { id: 'All' as FilterStatus, label: 'মোট রেকর্ড', count: totalCount, color: 'slate' },
    ];

    return summaryItems.map(item => ({
      ...item,
      percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : '0'
    }));
  }, [parcels, t]);

  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      const matchesStatus = activeListFilter === 'All' ? true : p.status === activeListFilter;
      const matchesSearch = p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.phone.includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [parcels, activeListFilter, searchTerm]);

  const quickActions = [
    { id: 'add', label: t.add_order, icon: Plus, color: 'bg-[#00a651]', onClick: () => setIsAddModalOpen(true) },
    { id: 'pickup', label: t.pickup_request, icon: Truck, color: 'bg-indigo-500', tab: 'pickup' },
    { id: 'payments', label: 'Payments', icon: CreditCard, color: 'bg-indigo-600', tab: 'payments' },
    { id: 'fraud', label: t.fraud_check, icon: ShieldAlert, color: 'bg-orange-500', tab: 'fraud' },
    { id: 'tickets', label: 'Support', icon: Ticket, color: 'bg-violet-500', tab: 'tickets' },
    { id: 'calc', label: 'Calculator', icon: Calculator, color: 'bg-cyan-600', tab: 'dashboard' },
  ];

  const handleEdit = (parcel: Parcel, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingParcel(parcel);
    setIsEditModalOpen(true);
  };

  const handleDeleteRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      title: 'পার্সেল রেকর্ড ডিলিট',
      message: 'আপনি কি নিশ্চিত যে এই পার্সেলটি চিরতরে ডিলিট করতে চান? এটি ব্যালেন্স অ্যাডজাস্ট করতে পারে।',
      type: 'danger',
      confirmText: 'হ্যাঁ, ডিলিট করুন',
      onConfirm: () => {
        onDelete(id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handlePrintLabel = (parcel: Parcel, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setShowPrintPreview(parcel);
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="space-y-10 animate-fade-in font-hind">
      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-sm w-full shadow-2xl animate-scale-in text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${confirmDialog.type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'}`}>
               <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">{confirmDialog.title}</h3>
            <p className="text-gray-500 font-bold text-sm mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))} className="flex-1 py-3 bg-gray-100 text-gray-500 font-black rounded-xl hover:bg-gray-200 transition-all">বাতিল</button>
              <button onClick={confirmDialog.onConfirm} className={`flex-1 py-3 text-white font-black rounded-xl transition-all shadow-lg ${confirmDialog.type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-[#00a651] hover:bg-emerald-700'}`}>
                {confirmDialog.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printing Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 relative shadow-2xl animate-scale-in">
             <button onClick={() => setShowPrintPreview(null)} className="absolute right-8 top-8 p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
             <h3 className="text-xl font-black mb-6">শিপিং লেবেল প্রিভিউ</h3>
             <div className="bg-gray-100 p-10 rounded-[2rem] flex justify-center border-2 border-dashed border-gray-300">
                <ShippingLabel parcel={showPrintPreview} merchant={user} />
             </div>
             <div className="mt-8 flex gap-4">
                <button onClick={() => window.print()} className="flex-1 bg-gray-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl"><Printer size={20} /> এখনই প্রিন্ট করুন</button>
                <button onClick={() => setShowPrintPreview(null)} className="flex-1 bg-gray-100 text-gray-500 font-black py-4 rounded-2xl transition-all active:scale-95">বন্ধ করুন</button>
             </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {selectedTrackingParcel && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in no-print">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-in custom-scrollbar">
            <div className="absolute right-8 top-8 flex items-center gap-2">
               <button onClick={() => handlePrintLabel(selectedTrackingParcel)} className="p-2 bg-emerald-50 text-[#00a651] hover:bg-emerald-100 rounded-full transition-colors"><Printer size={20} /></button>
               <button onClick={() => setSelectedTrackingParcel(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#00a651] p-3 rounded-2xl text-white">
                  <Truck size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">পার্সেল ট্র্যাকিং</h3>
                  <p className="text-gray-400 font-bold text-sm">ID: {selectedTrackingParcel.id}</p>
                </div>
              </div>
              <div className="space-y-6 relative">
                <div className="absolute left-[1.375rem] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {selectedTrackingParcel.trackingHistory.slice().reverse().map((step, idx) => (
                  <div key={idx} className="relative pl-12 pb-10 last:pb-0 group">
                    <div className={`absolute left-0 top-0 w-[2.75rem] h-[2.75rem] rounded-full border-4 border-white shadow-md flex items-center justify-center z-10 ${idx === 0 ? 'bg-[#00a651] text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <CheckCircle size={16} />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-[1.5rem] p-5 shadow-sm">
                      <h4 className="font-black text-sm uppercase tracking-widest text-gray-700">{step.status}</h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{new Date(step.timestamp).toLocaleString()}</p>
                      <p className="text-xs font-bold text-gray-500 mt-2">{step.description}</p>
                      <div className="flex items-center gap-2 mt-3 text-[10px] font-black text-[#00a651] uppercase">
                         <MapPin size={12} /> {step.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Parcel Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto no-scrollbar no-print">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl relative my-auto shadow-2xl">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute right-8 top-8 p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors z-20"><X size={24} /></button>
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
              <ParcelForm 
                isModal 
                t={t} 
                merchant={user}
                onSubmit={(p) => { 
                  onAddParcel(p); 
                  setIsAddModalOpen(false); 
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Parcel Modal */}
      {isEditModalOpen && editingParcel && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto no-scrollbar no-print">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl relative my-auto shadow-2xl">
            <button onClick={() => { setIsEditModalOpen(false); setEditingParcel(null); }} className="absolute right-8 top-8 p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors z-20"><X size={24} /></button>
            <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
              <ParcelForm 
                initialParcel={editingParcel} 
                isModal 
                t={t} 
                merchant={user}
                onSubmit={(p) => { 
                  onUpdateParcel({ ...editingParcel, ...p } as Parcel); 
                  setIsEditModalOpen(false); 
                  setEditingParcel(null); 
                }} 
              />
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary Area */}
      {!hideStats && (
        <div className="space-y-10 no-print">
          <div className="bg-[#1a1c24] rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
             <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-110 transition-all duration-700">
                <Truck size={180} />
             </div>
             <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="bg-[#00a651] p-1.5 rounded-lg text-white"><Sparkles size={16} /></div>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00a651]">Premium Merchant Access</span>
                   </div>
                   <h2 className="text-4xl font-black tracking-tight mb-2">Welcome, {user.name}</h2>
                   <p className="text-gray-400 font-bold text-sm">আপনি এখন {user.shopName} এর অ্যাডমিন প্যানেলে আছেন।</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center gap-5 max-w-md shadow-inner backdrop-blur-md">
                   <div className="bg-[#00a651] p-4 rounded-2xl text-white shadow-lg flex items-center justify-center shrink-0 animate-pulse"><Megaphone size={28} /></div>
                   <div>
                     <p className="text-[10px] font-black text-[#00a651] uppercase tracking-[0.2em] mb-1">Official News</p>
                     <p className="text-sm font-bold text-white leading-snug">আপনার ডেলিভারি চার্জের ওপর ১% কন্ডিশন চার্জ অটোমেটিক অ্যাডজাস্ট হবে।</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
             {quickActions.map((action) => (
                <button 
                   key={action.id}
                   onClick={() => action.onClick ? action.onClick() : (onNavigate && onNavigate(action.tab))}
                   className="bg-white border border-gray-100 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 transition-all hover:shadow-xl hover:border-emerald-100 group active:scale-95"
                >
                   <div className={`${action.color} p-4 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon size={24} strokeWidth={2.5} />
                   </div>
                   <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">{action.label}</span>
                </button>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: 'মোট পার্সেল', value: parcels.length, icon: Package, color: 'bg-indigo-600' },
              { label: 'পেন্ডিং অর্ডার', value: parcels.filter(p => p.status === 'Pending').length, icon: Clock, color: 'bg-amber-500' },
              { label: 'সফল ডেলিভারি', value: parcels.filter(p => p.status === 'Delivered').length, icon: CheckCircle, color: 'bg-[#00a651]' },
              { label: 'পেমেন্ট রিসিভড', value: parcels.filter(p => p.status === 'Paid').length, icon: Wallet, color: 'bg-blue-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center space-x-5 transition-all hover:shadow-lg group">
                <div className={`${stat.color} p-4 rounded-2xl text-white shadow-lg group-hover:rotate-6 transition-transform`}><stat.icon size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{stat.value.toLocaleString()}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parcel List Hub */}
      {!hideList && (
        <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden no-print">
          <div className="p-8 border-b border-gray-50 bg-gray-50/50">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
               <div>
                 <h3 className="text-2xl font-black text-gray-900 flex items-center space-x-3">
                   <List size={28} className="text-[#00a651]" />
                   <span className="tracking-tight">অর্ডার ম্যানেজমেন্ট সেন্টার</span>
                 </h3>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="relative group w-full md:w-80">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={20} />
                    <input 
                      type="text" 
                      placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..." 
                      value={searchTerm} 
                      onChange={e => setSearchTerm(e.target.value)} 
                      className={`w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:border-[#00a651] outline-none text-sm font-bold transition-all`} 
                    />
                  </div>
                  <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[#00a651] text-white px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 whitespace-nowrap">
                    <PlusCircle size={20} /> নতুন অর্ডার
                  </button>
               </div>
             </div>

             <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {parcelStatsSummary.map((summary) => (
                  <button 
                    key={summary.id} 
                    onClick={() => setActiveListFilter(summary.id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start gap-2 active:scale-95 ${
                      activeListFilter === summary.id 
                        ? 'border-[#00a651] bg-[#00a651] text-white shadow-xl shadow-emerald-100' 
                        : 'border-white bg-white hover:border-emerald-100'
                    }`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-tight ${activeListFilter === summary.id ? 'text-white/80' : 'text-gray-400'}`}>
                      {summary.label}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <h4 className="text-3xl font-black leading-none">{summary.count}</h4>
                      <span className={`text-[11px] font-black ${activeListFilter === summary.id ? 'text-white/60' : 'text-[#00a651]'}`}>({summary.percentage}%)</span>
                    </div>
                  </button>
                ))}
             </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredParcels.map((parcel) => (
                <div key={parcel.id} onClick={() => setSelectedTrackingParcel(parcel)} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden border-b-4 hover:border-b-[#00a651]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                       <div className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border flex items-center gap-2 ${getStatusColor(parcel.status)}`}>
                          {parcel.status}
                          <ChevronDown size={12} />
                       </div>
                       <select value={parcel.status} onChange={(e) => onUpdateStatus(parcel.id, e.target.value as Parcel['status'])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                          {['Pending', 'In Transit', 'Delivered', 'Returned', 'Partial Delivery', 'Paid', 'Hold', 'Cancelled'].map(s => (
                             <option key={s} value={s}>{s}</option>
                          ))}
                       </select>
                    </div>
                    <div className="flex items-center space-x-1">
                       <button onClick={(e) => handlePrintLabel(parcel, e)} className="p-2 text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl"><Printer size={18} /></button>
                       <button onClick={(e) => handleEdit(parcel, e)} className="p-2 text-gray-300 hover:text-[#00a651] hover:bg-emerald-50 rounded-xl"><Pencil size={18} /></button>
                       <button onClick={(e) => handleDeleteRequest(parcel.id, e)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                         <Hash size={14} className="text-gray-300" />
                         <p className="text-[11px] font-black text-gray-400 tracking-widest uppercase">{parcel.id}</p>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 group-hover:text-[#00a651] transition-colors">{parcel.customerName}</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-700 font-bold">
                        <Phone size={14} className="text-[#00a651] mr-3" />
                        {parcel.phone}
                      </div>
                      <div className="flex items-start text-sm text-gray-500 font-medium">
                        <MapPin size={14} className="text-indigo-400 mr-3 shrink-0 mt-1" />
                        <span className="line-clamp-1">{parcel.address}</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Condition Amount</p>
                        <p className="text-3xl font-black text-emerald-700 tracking-tighter">৳{parcel.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-gray-300 group-hover:text-[#00a651] transition-colors"><ArrowRight size={24} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredParcels.length === 0 && (
              <div className="py-40 text-center bg-gray-50 rounded-[3.5rem] border-4 border-dashed border-gray-100">
                <Search size={48} className="mx-auto text-gray-200 mb-6" />
                <h3 className="text-xl font-black text-gray-800">কোনো পার্সেল পাওয়া যায়নি</h3>
                <p className="text-gray-400 font-bold mt-2 text-sm uppercase">সার্চ টার্ম পরিবর্তন করে আবার চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
