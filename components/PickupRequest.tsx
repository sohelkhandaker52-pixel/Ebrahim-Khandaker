
import React, { useState } from 'react';
import { Truck, Calendar, Clock, MapPin, Phone, User, Info, CheckCircle2, MessageSquareText, ChevronRight } from 'lucide-react';

interface PickupRequestProps {
  merchantAddress: string;
  merchantPhone: string;
  merchantName: string;
  t: any;
}

const PickupRequest: React.FC<PickupRequestProps> = ({ merchantAddress, merchantPhone, merchantName, t }) => {
  const [formData, setFormData] = useState({
    name: merchantName,
    phone: merchantPhone,
    address: merchantAddress,
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'Morning',
    instructions: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const timeSlots = [
    { id: 'Morning', label: t.morning },
    { id: 'Afternoon', label: t.afternoon },
    { id: 'Evening', label: t.evening }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12 group-hover:rotate-0 transition-all duration-700">
          <Truck size={180} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Truck size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t.pickup_request}</h2>
              <p className="text-gray-400 font-bold text-sm">Schedule a professional collection service</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.customer_name}</label>
                <div className="relative group">
                  <User className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors`} size={18} />
                  <input 
                    type="text" 
                    required
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-900`} 
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.mobile_number}</label>
                <div className="relative group">
                  <Phone className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors`} size={18} />
                  <input 
                    type="tel" 
                    required
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-900`} 
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.address}</label>
                <div className="relative group">
                  <MapPin className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors`} size={18} />
                  <textarea 
                    required
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })} 
                    className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-900`} 
                    rows={2} 
                  />
                </div>
              </div>

              {/* Pickup Date */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.pickup_date}</label>
                <div className="relative group">
                  <Calendar className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors`} size={18} />
                  <input 
                    type="date" 
                    required
                    value={formData.date} 
                    onChange={e => setFormData({ ...formData, date: e.target.value })} 
                    className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-900`} 
                  />
                </div>
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.select_slot}</label>
                <div className="relative group">
                  <Clock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors`} size={18} />
                  <select 
                    value={formData.timeSlot}
                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                    className={`w-full appearance-none ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-gray-900 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all`}
                  >
                    {timeSlots.map(slot => (
                      <option key={slot.id} value={slot.id}>{slot.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">{t.special_instructions}</label>
              <div className="relative group">
                <MessageSquareText className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors`} size={18} />
                <textarea 
                  placeholder="Gate codes, warehouse floor, or specific entry points..."
                  value={formData.instructions} 
                  onChange={e => setFormData({ ...formData, instructions: e.target.value })} 
                  className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-900`} 
                  rows={3} 
                />
              </div>
            </div>

            {/* Warning / Info Box */}
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-start gap-4">
               <Info className="text-amber-600 shrink-0" size={20} />
               <p className="text-xs font-bold text-amber-800 leading-relaxed">
                 Please ensure parcels are ready and properly packed 30 minutes before the scheduled window. Our agent will contact the number provided upon arrival.
               </p>
            </div>

            <button 
              type="submit" 
              className={`w-full py-6 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
                isSuccess 
                ? 'bg-emerald-600 text-white' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
              }`}
            >
              {isSuccess ? <CheckCircle2 size={24} /> : <ChevronRight size={24} />}
              <span className="text-lg tracking-tight">{isSuccess ? t.pickup_success_msg : t.confirm_pickup}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PickupRequest;
