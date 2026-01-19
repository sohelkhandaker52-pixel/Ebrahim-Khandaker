
import React from 'react';
import { Parcel, ParcelStatus } from '../types';
import { ArrowLeft, Check, Package, Truck, MapPin } from 'lucide-react';

interface TrackingViewProps {
  parcel: Parcel;
  onBack: () => void;
}

const TrackingView: React.FC<TrackingViewProps> = ({ parcel, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Parcels</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white relative">
          <div className="relative z-10">
            <h3 className="text-sm font-medium opacity-80 uppercase tracking-widest">Tracking Number</h3>
            <p className="text-3xl font-black mt-1">#{parcel.id}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
                <p className="text-[10px] opacity-70">CURRENT STATUS</p>
                <p className="font-bold">{parcel.status}</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
                <p className="text-[10px] opacity-70">EXPECTED DELIVERY</p>
                <p className="font-bold">2-3 Business Days</p>
              </div>
            </div>
          </div>
          <Truck className="absolute -bottom-8 -right-8 text-white/10 w-48 h-48" />
        </div>

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
             <div className="text-center flex-1 relative">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${parcel.status !== ParcelStatus.PENDING ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                  <Package size={14} />
                </div>
                <p className="text-[10px] mt-2 font-bold text-slate-600">ORDERED</p>
                <div className="absolute top-4 left-[60%] w-[80%] h-0.5 bg-indigo-100 -z-10"></div>
             </div>
             <div className="text-center flex-1 relative">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${parcel.status === ParcelStatus.IN_TRANSIT || parcel.status === ParcelStatus.DELIVERED ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Truck size={14} />
                </div>
                <p className="text-[10px] mt-2 font-bold text-slate-600">IN TRANSIT</p>
                <div className="absolute top-4 left-[60%] w-[80%] h-0.5 bg-slate-100 -z-10"></div>
             </div>
             <div className="text-center flex-1">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${parcel.status === ParcelStatus.DELIVERED ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Check size={14} />
                </div>
                <p className="text-[10px] mt-2 font-bold text-slate-600">DELIVERED</p>
             </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 text-lg">Detailed History</h4>
            <div className="space-y-6 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
              {parcel.trackingHistory?.map((event, idx) => (
                <div key={idx} className="flex space-x-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${idx === 0 ? 'bg-indigo-600 shadow-lg shadow-indigo-100' : 'bg-slate-200'} `}>
                    <MapPin size={12} className={idx === 0 ? 'text-white' : 'text-slate-500'} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold ${idx === 0 ? 'text-indigo-600' : 'text-slate-700'}`}>{event.status}</p>
                    {/* Fixed event.time to use new Date(event.timestamp).toLocaleTimeString() */}
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(event.timestamp).toLocaleTimeString()} • {event.location}</p>
                    <p className="text-sm text-slate-500 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
              {(!parcel.trackingHistory || parcel.trackingHistory.length === 0) && (
                <p className="text-xs text-slate-400 italic">No detailed tracking information available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100">
           <h4 className="font-bold text-slate-800 mb-4">Customer Information</h4>
           <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Recipient</p>
                <p className="font-semibold text-slate-700">{parcel.customerName}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Contact</p>
                <p className="font-semibold text-slate-700">{parcel.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] uppercase font-bold text-slate-400">Address</p>
                <p className="font-semibold text-slate-700">{parcel.address}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingView;
