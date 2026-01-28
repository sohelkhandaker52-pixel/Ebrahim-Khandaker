
import React, { useState, useMemo, useEffect } from 'react';
import { Parcel, UserProfile } from '../types';
/* Added missing 'Plus' icon to imports */
import { MapPin, Phone, User, DollarSign, Weight, FileText, Repeat, Send, RefreshCcw, Info, AlertCircle, Printer, CheckCircle, ArrowLeft, QrCode, Barcode as BarcodeIcon, Package, Hash, Plus } from 'lucide-react';
import ShippingLabel from './ShippingLabel';

interface ParcelFormProps {
  initialParcel?: Parcel;
  onSubmit: (parcel: Omit<Parcel, 'status' | 'createdAt' | 'trackingHistory'>) => void;
  isModal?: boolean;
  t: any;
  merchant?: UserProfile;
}

const ParcelForm: React.FC<ParcelFormProps> = ({ initialParcel, onSubmit, isModal = false, t, merchant }) => {
  const generateId = () => "EKS-" + Math.floor(100000 + Math.random() * 900000);

  const [formData, setFormData] = useState({
    id: '',
    customerName: '',
    phone: '',
    address: '',
    amount: '',
    exchange: 'No' as 'Yes' | 'No',
    weight: '1',
    note: ''
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdParcel, setCreatedParcel] = useState<Parcel | null>(null);

  useEffect(() => {
    if (initialParcel) {
      setFormData({
        id: initialParcel.id,
        customerName: initialParcel.customerName,
        phone: initialParcel.phone,
        address: initialParcel.address,
        amount: initialParcel.amount.toString(),
        exchange: initialParcel.exchange,
        weight: initialParcel.weight,
        note: initialParcel.note
      });
    } else {
      setFormData(prev => ({ ...prev, id: generateId() }));
    }
  }, [initialParcel]);

  const billing = useMemo(() => {
    const amount = parseFloat(formData.amount) || 0;
    const weight = parseFloat(formData.weight) || 1;
    const deliveryCharge = 80 + Math.max(0, Math.ceil(weight - 1)) * 20;
    const codCharge = amount * 0.01;
    const totalCharge = deliveryCharge + codCharge;
    const netReceivable = amount > 0 ? amount - totalCharge : 0;
    return { deliveryCharge, codCharge, totalCharge, netReceivable, weight };
  }, [formData.amount, formData.weight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.amount) return;
    
    const parcelToSubmit: Omit<Parcel, 'status' | 'createdAt' | 'trackingHistory'> = { 
      ...formData, 
      amount: parseFloat(formData.amount) 
    };

    const mockCreatedParcel: Parcel = {
      ...parcelToSubmit,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'Order Placed',
          location: merchant?.address || 'Pickup Point',
          timestamp: new Date().toISOString(),
          handlerName: merchant?.name || 'System',
          handlerPhone: merchant?.phone || '',
          hubPhone: '01XXXXXXXXX',
          description: 'পার্সেলটি সফলভাবে সিস্টেমে যুক্ত করা হয়েছে।'
        }
      ]
    };
    
    setCreatedParcel(mockCreatedParcel);
    setIsSuccess(true);
    onSubmit(parcelToSubmit);
  };

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setIsSuccess(false);
    setCreatedParcel(null);
    setFormData({
      id: generateId(),
      customerName: '',
      phone: '',
      address: '',
      amount: '',
      exchange: 'No',
      weight: '1',
      note: ''
    });
  };

  const isRtl = document.documentElement.dir === 'rtl';

  if (isSuccess && createdParcel && merchant) {
    return (
      <div className="p-4 sm:p-8 animate-fade-in max-w-6xl mx-auto no-print font-hind">
        {/* Success Banner */}
        <div className="bg-[#00a651] rounded-[2.5rem] p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-200">
           <div className="flex items-center gap-6">
              <div className="bg-white/20 p-5 rounded-full backdrop-blur-md animate-bounce">
                 <CheckCircle size={40} className="text-white" />
              </div>
              <div>
                 <h2 className="text-3xl font-black tracking-tight">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h2>
                 <div className="flex items-center gap-2 mt-2 bg-white/20 px-4 py-1.5 rounded-xl border border-white/20 w-fit">
                    <Hash size={16} />
                    <span className="text-lg font-black tracking-widest">{createdParcel.id}</span>
                 </div>
              </div>
           </div>
           <div className="flex flex-wrap gap-3">
              <button 
                onClick={handlePrint} 
                className="bg-white text-[#00a651] font-black px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
              >
                <Printer size={20} /> লেবেল প্রিন্ট করুন
              </button>
              <button 
                onClick={resetForm} 
                className="bg-[#1a1c24] text-white font-black px-8 py-4 rounded-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-2"
              >
                <RefreshCcw size={18} /> নতুন পার্সেল
              </button>
           </div>
        </div>

        {/* Info & Preview Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Detailed Information Panel */}
           <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="bg-emerald-50 p-2 rounded-xl text-[#00a651]"><Package size={20} /></div>
                <h3 className="text-xl font-black text-gray-900">পার্সেলের বিস্তারিত তথ্য</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { label: 'কাস্টমারের নাম', value: createdParcel.customerName, icon: User },
                   { label: 'মোবাইল নাম্বার', value: createdParcel.phone, icon: Phone },
                   { label: 'কন্ডিশন অ্যামাউন্ট', value: `৳${createdParcel.amount}`, icon: DollarSign, bold: true, color: 'text-[#00a651]' },
                   { label: 'পার্সেল ওজন', value: `${createdParcel.weight} KG`, icon: Weight },
                   { label: 'এক্সচেঞ্জ পার্সেল', value: createdParcel.exchange === 'Yes' ? 'হ্যাঁ (Yes)' : 'না (No)', icon: Repeat },
                   { label: 'তৈরির সময়', value: new Date(createdParcel.createdAt).toLocaleTimeString(), icon: Info },
                 ].map((item, i) => (
                   <div key={i} className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 transition-hover hover:bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <item.icon size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                      </div>
                      <p className={`text-sm font-black ${item.bold ? 'text-lg ' + item.color : 'text-gray-800'}`}>{item.value}</p>
                   </div>
                 ))}
                 <div className="sm:col-span-2 bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ডেলিভারি ঠিকানা</span>
                    </div>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed">{createdParcel.address}</p>
                 </div>
                 {createdParcel.note && (
                    <div className="sm:col-span-2 bg-indigo-50/50 p-5 rounded-3xl border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">ইনভয়েস / নোট</span>
                      </div>
                      <p className="text-sm font-bold text-indigo-900 italic">"{createdParcel.note}"</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Live Print Label Preview Panel */}
           <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-8 border-b border-gray-50 pb-4">
                 <h3 className="text-xl font-black text-gray-900">শিপিং লেবেল প্রিভিউ</h3>
                 <div className="flex gap-4">
                    <QrCode size={24} className="text-gray-200" />
                    <BarcodeIcon size={24} className="text-gray-200" />
                 </div>
              </div>

              <div className="bg-gray-100 p-8 rounded-[2.5rem] border-2 border-dashed border-gray-300 flex justify-center w-full transition-all hover:bg-gray-50 group">
                 <div className="scale-[0.85] origin-top transition-transform group-hover:scale-[0.9]">
                    <ShippingLabel parcel={createdParcel} merchant={merchant} />
                 </div>
              </div>

              <div className="mt-10 w-full space-y-4">
                 <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                    * QR & Barcode scanned by EKSO agents at every hub
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handlePrint}
                      className="bg-[#1a1c24] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                      <Printer size={20} /> লেবেল প্রিন্ট
                    </button>
                    <button 
                      onClick={resetForm}
                      className="bg-gray-100 text-gray-600 font-black py-4 rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={18} /> ফর্ম-এ ফিরে যান
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isModal ? 'p-6 sm:p-10' : 'bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 animate-fade-in'} no-print font-hind`}>
      <div className="flex items-center gap-3 mb-10">
         <div className="bg-[#00a651] p-3 rounded-2xl text-white shadow-lg shadow-emerald-100">
            {initialParcel ? <RefreshCcw size={28} /> : <Plus size={28} />}
         </div>
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">
                {initialParcel ? t.edit_order : t.add_order}
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Courier Dispatch System</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input type="hidden" value={formData.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.customer_name}</label>
            <div className="relative group">
              <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
              <input 
                type="text" 
                required
                placeholder="কাস্টমারের নাম লিখুন"
                value={formData.customerName} 
                onChange={e => setFormData({ ...formData, customerName: e.target.value })} 
                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-900`} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.mobile_number}</label>
            <div className="relative group">
              <Phone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
              <input 
                type="tel" 
                required
                placeholder="০১৭XXXXXXXX"
                value={formData.phone} 
                onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-900`} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.address}</label>
          <div className="relative group">
            <MapPin className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-4 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
            <textarea 
              required
              placeholder="বিস্তারিত ডেলিভারি ঠিকানা (জেলা, উপজেলা এবং ল্যান্ডমার্কসহ)"
              value={formData.address} 
              onChange={e => setFormData({ ...formData, address: e.target.value })} 
              className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-900`} 
              rows={2} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.amount}</label>
            <div className="relative group">
              <DollarSign className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
              <input 
                type="number" 
                required
                placeholder="৳ কন্ডিশন টাকা"
                value={formData.amount} 
                onChange={e => setFormData({ ...formData, amount: e.target.value })} 
                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-black text-[#00a651] focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all`} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.weight}</label>
            <div className="relative group">
              <Weight className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
              <input 
                type="number" 
                step="0.1" 
                min="0.1"
                value={formData.weight} 
                onChange={e => setFormData({ ...formData, weight: e.target.value })} 
                className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all`} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Exchange Parcel?</label>
            <div className="relative group">
              <Repeat className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
              <select 
                value={formData.exchange}
                onChange={e => setFormData({ ...formData, exchange: e.target.value as 'Yes' | 'No' })}
                className={`w-full appearance-none ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all`}
              >
                <option value="No">No (না)</option>
                <option value="Yes">Yes (হ্যাঁ)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.note}</label>
          <div className="relative group">
            <FileText className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-4 text-gray-400 group-focus-within:text-[#00a651] transition-colors`} size={18} />
            <textarea 
              placeholder="ইনভয়েস আইডি বা ডেলিভারি নোট থাকলে লিখুন..."
              value={formData.note} 
              onChange={e => setFormData({ ...formData, note: e.target.value })} 
              className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#00a651] focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-gray-900`} 
              rows={2} 
            />
          </div>
        </div>

        {/* Financial Breakdown Preview */}
        <div className="bg-[#1a1c24] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
             <DollarSign size={180} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 opacity-60">
                <AlertCircle size={14} className="text-[#00a651]" />
                <h3 className="font-black text-[10px] uppercase tracking-[0.2em]">Live Billing Calculation (EKS v3)</h3>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
               <div className="space-y-1">
                  <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Net Receivable Amount</span>
                  <p className="text-5xl font-black tracking-tighter text-[#00a651]">৳{billing.netReceivable.toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-2">আপনার ব্যাংক/ওয়ালেটে প্রাপ্য টাকা (চার্জ বাদে)</p>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-sm min-w-[200px]">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">ডেলিভারি চার্জ</p>
                     <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-rose-400">৳{billing.deliveryCharge}</span>
                        <span className="text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg">80 + (20/kg)</span>
                     </div>
                  </div>
                  <div className="bg-white/5 p-5 rounded-3xl border border-white/10 backdrop-blur-sm min-w-[200px]">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">কন্ডিশন চার্জ (১%)</p>
                     <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-rose-400">৳{billing.codCharge.toFixed(2)}</span>
                        <span className="text-[9px] font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-lg">COD 1% Fee</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#00a651] text-white font-black py-6 rounded-[2rem] flex items-center justify-center space-x-3 rtl:space-x-reverse hover:bg-[#008d44] transition-all active:scale-95 shadow-2xl shadow-emerald-100"
        >
          {initialParcel ? <RefreshCcw size={20} /> : <Send size={20} />}
          <span className="text-lg tracking-tight uppercase">
            {initialParcel ? 'পার্সেল আপডেট করুন' : 'পার্সেল সফলভাবে সাবমিট করুন'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default ParcelForm;
