
import React, { useState } from 'react';
import { Parcel } from '../types';
import { Search, Trash2, MapPin, Phone, MoreVertical, ExternalLink } from 'lucide-react';

interface ParcelListProps {
  parcels: Parcel[];
  onDelete: (id: string) => void;
}

const ParcelList: React.FC<ParcelListProps> = ({ parcels, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParcels = parcels.filter(p => 
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">পার্সেল রেকর্ড</h2>
          <p className="text-gray-500">আপনার সংরক্ষিত সকল পার্সেল এখানে ট্র্যাক করুন।</p>
        </div>
        
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="নাম, ফোন বা আইডি দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-100 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParcels.map((parcel) => (
          <div key={parcel.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
            
            <div className="flex justify-between items-start relative z-10 mb-4">
              <div>
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">
                  {parcel.status}
                </span>
                <p className="text-xs text-gray-400 font-mono mt-1">{parcel.id}</p>
              </div>
              <div className="flex space-x-1">
                <button 
                   onClick={() => onDelete(parcel.id)}
                   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{parcel.customerName}</h3>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-2 text-gray-400" />
                  <span>{parcel.phone}</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={14} className="mr-2 mt-1 text-gray-400 shrink-0" />
                  <span className="line-clamp-2">{parcel.address || 'ঠিকানা নেই'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Condition</p>
                  <p className="text-xl font-bold text-indigo-600">৳{parcel.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Weight</p>
                  <p className="font-semibold text-gray-700">{parcel.weight || '0.5'} KG</p>
                </div>
              </div>
              
              {parcel.exchange === 'Yes' && (
                <div className="mt-2 text-[10px] font-bold inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md border border-emerald-100">
                   EXCHANGE ITEM
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredParcels.length === 0 && (
        <div className="bg-white py-20 rounded-[3rem] border border-dashed border-gray-300 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-700">কোনো পার্সেল পাওয়া যায়নি</h3>
          <p className="text-gray-400 max-w-xs mx-auto">দয়া করে সার্চ টার্ম পরিবর্তন করুন বা নতুন পার্সেল যোগ করুন।</p>
        </div>
      )}
    </div>
  );
};

export default ParcelList;
