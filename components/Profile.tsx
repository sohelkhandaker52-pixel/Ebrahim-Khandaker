
import React, { useState } from 'react';
import { UserProfile, PaymentMethod } from '../types';
import { User, Store, Phone, Mail, MapPin, ShieldCheck, Landmark, Smartphone, Banknote, Truck, CreditCard, ChevronRight, Pencil, Save, X, LogOut } from 'lucide-react';

interface ProfileProps {
  user: UserProfile;
  paymentMethods: PaymentMethod[];
  onUpdate: (updatedUser: UserProfile) => void;
  onUpdatePaymentMethod: (method: PaymentMethod) => void;
  onLogout: () => void;
  t: any;
}

const Profile: React.FC<ProfileProps> = ({ user, paymentMethods, onUpdate, onUpdatePaymentMethod, onLogout, t }) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Local state for forms
  const [profileData, setProfileData] = useState<Partial<UserProfile>>({ ...user });
  const [pickupData, setPickupData] = useState({ 
    pickupMode: user.pickupMode || 'On-demand', 
    address: user.address || '' 
  });
  const [paymentOptions, setPaymentOptions] = useState({ 
    defaultPaymentMethod: user.defaultPaymentMethod || 'Cash' 
  });

  // Safe finding of existing methods
  const bankMethodObj = paymentMethods.find(m => m.type === 'Bank') || { id: 'bank-default', type: 'Bank' as const, label: 'Bank Account' };
  const bkashObj = paymentMethods.find(m => m.provider === 'bKash') || { id: 'bkash-default', type: 'Mobile Banking' as const, provider: 'bKash' as const, label: 'bKash Account' };
  const rocketObj = paymentMethods.find(m => m.provider === 'Rocket') || { id: 'rocket-default', type: 'Mobile Banking' as const, provider: 'Rocket' as const, label: 'Rocket Account' };
  const nagadObj = paymentMethods.find(m => m.provider === 'Nagad') || { id: 'nagad-default', type: 'Mobile Banking' as const, provider: 'Nagad' as const, label: 'Nagad Account' };

  const [bankData, setBankData] = useState<PaymentMethod>(bankMethodObj as PaymentMethod);
  const [mfsData, setMfsData] = useState({
    bkash: bkashObj.mobileNumber || '',
    rocket: rocketObj.mobileNumber || '',
    nagad: nagadObj.mobileNumber || ''
  });

  const handleSave = (sectionId: string) => {
    if (sectionId === 'profile') {
      onUpdate({ ...user, ...profileData } as UserProfile);
    } else if (sectionId === 'pickup') {
      onUpdate({ ...user, pickupMode: pickupData.pickupMode, address: pickupData.address } as UserProfile);
    } else if (sectionId === 'payment') {
      onUpdate({ ...user, defaultPaymentMethod: paymentOptions.defaultPaymentMethod } as UserProfile);
    } else if (sectionId === 'bank') {
      onUpdatePaymentMethod({ ...bankData, type: 'Bank' });
    } else if (sectionId === 'mfs') {
      onUpdatePaymentMethod({ ...bkashObj as PaymentMethod, mobileNumber: mfsData.bkash });
      onUpdatePaymentMethod({ ...rocketObj as PaymentMethod, mobileNumber: mfsData.rocket });
      onUpdatePaymentMethod({ ...nagadObj as PaymentMethod, mobileNumber: mfsData.nagad });
    }
    setEditingSection(null);
  };

  const SectionHeader = (props: { title: string; icon: any; color: string; sectionId: string }) => {
    const Icon = props.icon;
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`${props.color} p-2.5 rounded-xl text-white shadow-lg`}>
            <Icon size={20} />
          </div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{props.title}</h3>
        </div>
        {editingSection !== props.sectionId ? (
          <button 
            onClick={() => setEditingSection(props.sectionId)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
          >
            <Pencil size={12} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => handleSave(props.sectionId)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-emerald-600 hover:bg-emerald-700 transition-colors px-3 py-1.5 rounded-lg shadow-md"
            >
              <Save size={12} />
              Save
            </button>
            <button 
              onClick={() => setEditingSection(null)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-lg"
            >
              <X size={12} />
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  const InfoRow = (props: { label: string; value: string | undefined; icon?: any; editKey?: string; sectionId: string; sectionState?: any; setSectionState?: any }) => {
    const Icon = props.icon;
    const isEditing = editingSection === props.sectionId && props.editKey;

    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors group">
        <div className="flex items-center gap-3 flex-1">
          {Icon && <Icon size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">{props.label}</span>
          
          {isEditing ? (
            <input 
              type="text"
              value={props.sectionState[props.editKey!]}
              onChange={(e) => props.setSectionState({ ...props.sectionState, [props.editKey!]: e.target.value })}
              className="flex-1 bg-white border border-indigo-100 rounded-lg px-3 py-1.5 text-sm font-bold text-gray-800 focus:ring-2 focus:ring-indigo-50 outline-none"
            />
          ) : (
            <span className="text-sm font-black text-gray-800">{props.value || 'Not Set'}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* 1. Profile Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
        <SectionHeader title="1. Profile" icon={User} color="bg-indigo-600" sectionId="profile" />
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center justify-between py-3 border-b border-gray-50 px-2 rounded-lg">
            <div className="flex items-center gap-3">
              <ShieldCheck size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest min-w-[120px]">User ID</span>
              <span className="text-sm font-black text-gray-400 select-all cursor-copy">{user.merchantId}</span>
            </div>
          </div>
          <InfoRow sectionId="profile" label="Business Name" value={profileData.shopName} icon={Store} editKey="shopName" sectionState={profileData} setSectionState={setProfileData} />
          <InfoRow sectionId="profile" label="Email" value={profileData.email} icon={Mail} editKey="email" sectionState={profileData} setSectionState={setProfileData} />
          <InfoRow sectionId="profile" label="Primary Phone" value={profileData.phone} icon={Phone} editKey="phone" sectionState={profileData} setSectionState={setProfileData} />
          <InfoRow sectionId="profile" label="Contact Number" value={profileData.contactNumber} icon={Phone} editKey="contactNumber" sectionState={profileData} setSectionState={setProfileData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. Pick up information */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <SectionHeader title="2. Pick up info" icon={Truck} color="bg-amber-500" sectionId="pickup" />
          <div className="flex-1 space-y-4">
            <div className="px-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Pick up Mode</label>
              {editingSection === 'pickup' ? (
                <select 
                  value={pickupData.pickupMode}
                  onChange={(e) => setPickupData({ ...pickupData, pickupMode: e.target.value })}
                  className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 outline-none"
                >
                  <option value="On-demand">On-demand</option>
                  <option value="Regular">Regular</option>
                </select>
              ) : (
                <div className="bg-amber-50 text-amber-600 font-black px-4 py-2 rounded-xl text-xs w-fit">{pickupData.pickupMode}</div>
              )}
            </div>
            <div className="px-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Primary pickup location</label>
              {editingSection === 'pickup' ? (
                <textarea 
                  value={pickupData.address}
                  onChange={(e) => setPickupData({ ...pickupData, address: e.target.value })}
                  className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-800 outline-none"
                  rows={3}
                />
              ) : (
                <p className="text-sm font-bold text-gray-700 leading-relaxed italic">{pickupData.address || 'Not Set'}</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Payment Options */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex flex-col">
          <SectionHeader title="3. Payment Options" icon={CreditCard} color="bg-emerald-500" sectionId="payment" />
          <div className="flex-1">
             <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 group">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">Default Method</p>
                {editingSection === 'payment' ? (
                  <select 
                    value={paymentOptions.defaultPaymentMethod}
                    onChange={(e) => setPaymentOptions({ ...paymentOptions, defaultPaymentMethod: e.target.value })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-800 outline-none"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                    <option value="MFS">Mobile Financial Services</option>
                  </select>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Banknote className="text-emerald-600" size={20} />
                       <span className="text-xl font-black text-gray-900">{paymentOptions.defaultPaymentMethod}</span>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* 4. Bank Account Information */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <SectionHeader title="4. Bank Account" icon={Landmark} color="bg-blue-600" sectionId="bank" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <InfoRow sectionId="bank" label="Bank Name" value={bankData.bankName} editKey="bankName" sectionState={bankData} setSectionState={setBankData} />
          <InfoRow sectionId="bank" label="Account Name" value={bankData.accountName} editKey="accountName" sectionState={bankData} setSectionState={setBankData} />
          <InfoRow sectionId="bank" label="Account Number" value={bankData.accountNumber} editKey="accountNumber" sectionState={bankData} setSectionState={setBankData} />
          <InfoRow sectionId="bank" label="Branch Name" value={bankData.branchName} editKey="branchName" sectionState={bankData} setSectionState={setBankData} />
          <InfoRow sectionId="bank" label="Routing No." value={bankData.routingNo} editKey="routingNo" sectionState={bankData} setSectionState={setBankData} />
        </div>
      </div>

      {/* 5. Mobile Financial Accounts */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
        <SectionHeader title="5. Mobile Accounts" icon={Smartphone} color="bg-pink-600" sectionId="mfs" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-pink-50 border border-pink-100 p-6 rounded-[2rem] flex flex-col items-center gap-3 relative">
             <div className="bg-pink-600 text-white p-3 rounded-2xl shadow-lg"><Smartphone size={24} /></div>
             <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">bKash</p>
             {editingSection === 'mfs' ? (
               <input 
                type="text" 
                value={mfsData.bkash} 
                onChange={(e) => setMfsData({ ...mfsData, bkash: e.target.value })}
                className="w-full bg-white border border-pink-200 rounded-lg px-3 py-1 text-center text-sm font-bold"
               />
             ) : (
               <p className="text-sm font-black text-gray-900">{mfsData.bkash || 'Not Linked'}</p>
             )}
          </div>
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col items-center gap-3">
             <div className="bg-orange-600 text-white p-3 rounded-2xl shadow-lg"><Smartphone size={24} /></div>
             <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Rocket</p>
             {editingSection === 'mfs' ? (
               <input 
                type="text" 
                value={mfsData.rocket} 
                onChange={(e) => setMfsData({ ...mfsData, rocket: e.target.value })}
                className="w-full bg-white border border-orange-200 rounded-lg px-3 py-1 text-center text-sm font-bold"
               />
             ) : (
               <p className="text-sm font-black text-gray-900">{mfsData.rocket || 'Not Linked'}</p>
             )}
          </div>
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex flex-col items-center gap-3">
             <div className="bg-red-600 text-white p-3 rounded-2xl shadow-lg"><Smartphone size={24} /></div>
             <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Nagad</p>
             {editingSection === 'mfs' ? (
               <input 
                type="text" 
                value={mfsData.nagad} 
                onChange={(e) => setMfsData({ ...mfsData, nagad: e.target.value })}
                className="w-full bg-white border border-red-200 rounded-lg px-3 py-1 text-center text-sm font-bold"
               />
             ) : (
               <p className="text-sm font-black text-gray-900">{mfsData.nagad || 'Not Linked'}</p>
             )}
          </div>
        </div>
      </div>
      
      {/* Logout Button Section */}
      <div className="pt-8 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full bg-rose-50 text-rose-600 font-black py-5 rounded-[2rem] border border-rose-100 flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-rose-900/5 group"
        >
          <div className="bg-rose-600 text-white p-2 rounded-xl group-hover:bg-white group-hover:text-rose-600 transition-colors">
            <LogOut size={20} />
          </div>
          <span className="text-lg tracking-tight uppercase">{t.logout}</span>
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100">
             <ShieldCheck size={14} className="text-indigo-600" />
             <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Official EKS courier Merchant Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
