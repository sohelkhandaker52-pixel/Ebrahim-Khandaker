
import React, { useMemo } from 'react';
import { Parcel, TrackingStep } from '../types';
import { Bell, MapPin, Package, Clock, ChevronRight, MessageSquare, Info } from 'lucide-react';

interface NotificationItem extends TrackingStep {
  parcelId: string;
  customerName: string;
}

interface NotificationViewProps {
  parcels: Parcel[];
  t: any;
  onNavigateToParcel: (parcelId: string) => void;
}

const NotificationView: React.FC<NotificationViewProps> = ({ parcels, t, onNavigateToParcel }) => {
  // Extract all tracking steps from all parcels and sort by date
  const notifications = useMemo(() => {
    const list: NotificationItem[] = [];
    parcels.forEach(parcel => {
      parcel.trackingHistory.forEach(step => {
        list.push({
          ...step,
          parcelId: parcel.id,
          customerName: parcel.customerName
        });
      });
    });
    // Sort newest first
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [parcels]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10 font-hind">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg"><Bell size={24} /></div>
             নোটিফিকেশন সেন্টার
          </h2>
          <p className="text-gray-400 font-bold text-sm mt-1">আপনার সকল পার্সেলের সর্বশেষ আপডেট এখানে দেখুন</p>
        </div>
        <div className="bg-emerald-50 text-[#00a651] px-4 py-2 rounded-full text-xs font-black border border-emerald-100">
           {notifications.length} টি আপডেট
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((note, idx) => (
            <div 
              key={`${note.parcelId}-${idx}`}
              onClick={() => onNavigateToParcel(note.parcelId)}
              className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${
                  idx === 0 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  <MessageSquare size={20} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      ID: {note.parcelId}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(note.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="font-black text-gray-800 text-sm leading-snug">
                    পার্সেলটি এখন <span className="text-[#00a651]">{note.location}</span> এ আছে।
                  </h4>
                  
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors">
                     <p className="text-xs font-bold text-gray-500 italic">"{note.description}"</p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                        <MapPin size={12} className="text-[#00a651]" />
                        {note.location}
                     </div>
                     <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase">
                        <Package size={12} className="text-indigo-400" />
                        {note.status}
                     </div>
                  </div>
                </div>
                <div className="self-center text-gray-200 group-hover:text-indigo-600 transition-colors">
                   <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-gray-100 flex flex-col items-center">
             <div className="bg-gray-50 p-6 rounded-full text-gray-300 mb-6">
                <Info size={48} />
             </div>
             <h3 className="text-xl font-black text-gray-800">কোনো নোটিফিকেশন নেই</h3>
             <p className="text-gray-400 font-bold mt-2 text-sm uppercase tracking-widest leading-relaxed max-w-xs">
                নতুন পার্সেল এড করলে বা ট্র্যাকিং আপডেট হলে এখানে মেসেজ দেখা যাবে।
             </p>
          </div>
        )}
      </div>

      <div className="mt-10 p-6 bg-indigo-50/50 border border-dashed border-indigo-100 rounded-[2.5rem] flex items-center gap-4">
         <div className="bg-indigo-600 p-2 rounded-xl text-white"><Info size={16} /></div>
         <p className="text-[11px] font-bold text-indigo-700 leading-relaxed italic">
           টিপস: পার্সেল আইডিতে ক্লিক করলে আপনি সরাসরি ঐ পার্সেলের ট্র্যাকিং পেজে চলে যাবেন।
         </p>
      </div>
    </div>
  );
};

export default NotificationView;
