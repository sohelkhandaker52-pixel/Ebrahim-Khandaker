
import React, { useState } from 'react';
import { PaymentMethod, PaymentMethodType } from '../types';
import { Plus, Trash2, Edit2, Landmark, Smartphone, Banknote, X, Save } from 'lucide-react';

interface PaymentMethodsProps {
  methods: PaymentMethod[];
  onSave: (method: PaymentMethod) => void;
  onDelete: (id: string) => void;
  t: any;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ methods, onSave, onDelete, t }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<PaymentMethodType>('Bank');
  const [formData, setFormData] = useState<Partial<PaymentMethod>>({
    label: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    branchName: '',
    routingNo: '',
    provider: 'bKash',
    mobileNumber: '',
    note: ''
  });

  const handleEdit = (m: PaymentMethod) => {
    setEditingId(m.id);
    setType(m.type);
    setFormData(m);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (!formData.label) return;
    const newMethod: PaymentMethod = {
      ...formData as PaymentMethod,
      id: editingId || Date.now().toString(),
      type: type
    };
    onSave(newMethod);
    resetForm();
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      label: '',
      bankName: '',
      accountName: '',
      accountNumber: '',
      branchName: '',
      routingNo: '',
      provider: 'bKash',
      mobileNumber: '',
      note: ''
    });
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-gray-900">{t.manage_payment_methods}</h3>
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>{t.add_payment_method}</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 animate-fade-in relative">
          <button onClick={resetForm} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={20} /></button>
          
          <div className="flex space-x-2 rtl:space-x-reverse mb-6">
            {(['Bank', 'Mobile Banking', 'Cash'] as PaymentMethodType[]).map((mType) => (
              <button
                key={mType}
                onClick={() => setType(mType)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                  type === mType 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                    : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-200'
                }`}
              >
                {t[mType.toLowerCase().replace(' ', '_')] || mType}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t.method_label}</label>
              <input 
                type="text" 
                value={formData.label} 
                onChange={e => setFormData({...formData, label: e.target.value})}
                placeholder="e.g. Personal DBBL"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-300 outline-none"
              />
            </div>

            {type === 'Bank' && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">1. {t.bank_name}</label>
                  <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">2. {t.account_name}</label>
                  <input type="text" value={formData.accountName} onChange={e => setFormData({...formData, accountName: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">3. {t.account_number}</label>
                  <input type="text" value={formData.accountNumber} onChange={e => setFormData({...formData, accountNumber: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">4. {t.branch_name}</label>
                  <input type="text" value={formData.branchName} onChange={e => setFormData({...formData, branchName: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">5. {t.routing_no}</label>
                  <input type="text" value={formData.routingNo} onChange={e => setFormData({...formData, routingNo: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
              </>
            )}

            {type === 'Mobile Banking' && (
              <>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t.select_provider}</label>
                  <select 
                    value={formData.provider} 
                    onChange={e => setFormData({...formData, provider: e.target.value as any})}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Nagad">Nagad</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">{t.mobile_number}</label>
                  <input type="text" value={formData.mobileNumber} onChange={e => setFormData({...formData, mobileNumber: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" />
                </div>
              </>
            )}

            {type === 'Cash' && (
              <div className="md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cash Collection Note</label>
                <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none" rows={2} />
              </div>
            )}
          </div>

          <button 
            onClick={handleSave}
            className="mt-6 w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
          >
            <Save size={18} />
            <span>{t.save_method}</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {methods.map((m) => (
          <div key={m.id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm group hover:border-indigo-600 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${
                  m.type === 'Bank' ? 'bg-blue-50 text-blue-600' : 
                  m.type === 'Mobile Banking' ? 'bg-pink-50 text-pink-600' : 
                  'bg-emerald-50 text-emerald-600'
                }`}>
                  {m.type === 'Bank' && <Landmark size={20} />}
                  {m.type === 'Mobile Banking' && <Smartphone size={20} />}
                  {m.type === 'Cash' && <Banknote size={20} />}
                </div>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <button onClick={() => handleEdit(m)} className="p-1.5 text-gray-300 hover:text-indigo-600"><Edit2 size={14} /></button>
                  <button onClick={() => onDelete(m.id)} className="p-1.5 text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <h4 className="font-black text-gray-900 leading-tight">{m.label}</h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{m.type}</p>
              
              <div className="mt-4 space-y-1.5 text-[11px] text-gray-600 font-medium">
                {m.type === 'Bank' && (
                  <>
                    <p className="line-clamp-1">Bank: {m.bankName}</p>
                    <p className="font-bold">A/C: {m.accountNumber}</p>
                  </>
                )}
                {m.type === 'Mobile Banking' && (
                  <>
                    <p>Provider: {m.provider}</p>
                    <p className="font-bold">No: {m.mobileNumber}</p>
                  </>
                )}
                {m.type === 'Cash' && <p className="italic">{m.note}</p>}
              </div>
            </div>
          </div>
        ))}
        {methods.length === 0 && !isFormOpen && (
          <div className="col-span-full py-12 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-[2rem]">
            No payment methods saved. Add one to request withdrawal.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
