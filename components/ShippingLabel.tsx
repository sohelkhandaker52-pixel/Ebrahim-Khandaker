
import React from 'react';
import { Parcel, UserProfile } from '../types';
import { Truck, MapPin, Phone, User, Package, Navigation } from 'lucide-react';
import { EksoLogo } from './Auth';

interface ShippingLabelProps {
  parcel: Parcel;
  merchant: UserProfile;
}

const ShippingLabel: React.FC<ShippingLabelProps> = ({ parcel, merchant }) => {
  const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${parcel.id}&scale=2&rotate=N&includetext`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${parcel.id}`;

  return (
    <div id="printable-label" className="w-[400px] border-2 border-black p-4 bg-white text-black font-sans m-auto">
      {/* Header with EKSO Logo */}
      <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
        <div className="scale-[0.4] origin-left -ml-2 -mt-2">
          <EksoLogo />
        </div>
        <div className="text-[10px] font-bold text-right uppercase">
          STANDARD GROUND<br />
          {new Date(parcel.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Barcode Section */}
      <div className="flex flex-col items-center mb-4 py-2 border-b border-gray-200">
        <img src={barcodeUrl} alt="Barcode" className="h-16 w-full object-contain mb-1" />
        <span className="font-mono text-sm font-black">{parcel.id}</span>
      </div>

      {/* Addresses Section */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* FROM */}
        <div className="border-l-4 border-gray-300 pl-3">
          <p className="text-[9px] font-black uppercase text-gray-500 mb-1">From (Sender)</p>
          <div className="text-xs font-black">{merchant.shopName}</div>
          <div className="text-[10px] font-medium leading-tight">{merchant.name}</div>
          <div className="text-[10px] font-medium">{merchant.phone}</div>
        </div>

        {/* TO */}
        <div className="border-2 border-black p-3 rounded-lg bg-gray-50">
          <p className="text-[9px] font-black uppercase text-gray-500 mb-1">To (Recipient)</p>
          <div className="text-sm font-black uppercase">{parcel.customerName}</div>
          <div className="text-xs font-bold leading-tight my-1">{parcel.address}</div>
          <div className="text-xs font-black flex items-center gap-1">
            <Phone size={10} /> {parcel.phone}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t-2 border-black">
        <div className="flex-1">
           <div className="flex items-center gap-4">
              <div>
                <p className="text-[9px] font-black uppercase text-gray-400">Weight</p>
                <p className="text-xs font-black">{parcel.weight} KG</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-gray-400">Exchange</p>
                <p className="text-xs font-black">{parcel.exchange}</p>
              </div>
           </div>
           <div className="mt-2">
              <p className="text-[9px] font-black uppercase text-gray-400">COD Amount</p>
              <p className="text-2xl font-black">৳{parcel.amount}</p>
           </div>
        </div>
        <div className="shrink-0">
          <img src={qrUrl} alt="QR Code" className="w-20 h-20 border border-gray-200 p-1" />
        </div>
      </div>

      {/* Cut line indicator for thermal printing */}
      <div className="mt-4 border-t border-dashed border-gray-300 pt-1 text-[8px] text-center text-gray-300 font-bold uppercase tracking-[0.3em]">
        EKSO COURIER LTD. - END OF LABEL
      </div>
    </div>
  );
};

export default ShippingLabel;
