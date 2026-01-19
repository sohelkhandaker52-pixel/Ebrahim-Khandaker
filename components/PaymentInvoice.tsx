
import React, { useMemo, useState } from 'react';
import { Parcel, PaymentMethod } from '../types';
import { Receipt, CreditCard, ChevronRight, DollarSign, Package, TrendingUp, Info, CheckCircle2 } from 'lucide-react';
import PaymentMethods from './PaymentMethods';

interface PaymentInvoiceProps {
  parcels: Parcel[];
  paymentMethods: PaymentMethod[];
  onSaveMethod: (m: PaymentMethod) => void;
  onDeleteMethod: (id: string) => void;
  onSettlePayments?: (amount: number) => void;
  t: any;
}

const PaymentInvoice: React.FC<PaymentInvoiceProps> = ({ parcels, paymentMethods, onSaveMethod, onDeleteMethod, onSettlePayments, t }) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  // Filter only 'Delivered' parcels that are awaiting payment settlement
  const calculations = useMemo(() => {
    return parcels
      .filter(p => p.status === 'Delivered')
      .map(p => {
        const weightVal = parseFloat(p.weight) || 0.5;
        const deliveryCharge = 80 + Math.max(0, Math.ceil(weightVal - 1)) * 20;
        const subTotal = p.amount - deliveryCharge;
        const codCharge = p.amount * 0.01;
        const net = subTotal - codCharge;
        
        return {
          ...p,
          deliveryCharge,
          subTotal,
          codCharge,
          net
        };
      });
  }, [parcels]);

  const totals = useMemo(() => {
    return calculations.reduce((acc, curr) => ({
      totalAmount: acc.totalAmount + curr.amount,
      totalDelivery: acc.totalDelivery + curr.deliveryCharge,
      totalSub: acc.totalSub + curr.subTotal,
      totalCod: acc.totalCod + curr.codCharge,
      totalNet: acc.totalNet + curr.net
    }), { totalAmount: 0, totalDelivery: 0, totalSub: 0, totalCod: 0, totalNet: 0 });
  }, [calculations]);

  const handleRequest = () => {
    if (!selectedMethodId) {
      alert("দয়া করে পেমেন্ট মেথড সিলেক্ট করুন।");
      return;
    }
    
    if (totals.totalNet <= 0) {
      alert("উত্তোলন করার মতো কোনো ব্যালেন্স নেই।");
      return;
    }

    const method = paymentMethods.find(m => m.id === selectedMethodId);
    const settledAmount = totals.totalNet;

    // Trigger settlement in App state
    if (onSettlePayments) {
      onSettlePayments(settledAmount);
    }

    alert(`পেমেন্ট রিকোয়েস্ট সফল! ৳${settledAmount.toLocaleString()} টাকা আপনার ${method?.label} অ্যাকাউন্টে পাঠানোর প্রক্রিয়া শুরু হয়েছে। আপনার ব্যালেন্স এখন ৳০.০০।`);
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header section */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
        <div className={`absolute -right-20 -top-20 w-64 h-64 bg-indigo-50/50 rounded-full group-hover:scale-110 transition-transform duration-700 ${isRtl ? 'right-auto -left-20' : ''}`}></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
             <div className="bg-indigo-600 p-2 rounded-xl text-white"><Receipt size={24} /></div>
             {t.payment_details}
          </h2>
          <p className="text-gray-400 text-sm mt-1">Excel-Style Balance Sheet (Settlement Mode)</p>
        </div>
        <div className="relative z-10 flex items-center space-x-4 rtl:space-x-reverse bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
           <Info size={16} className="text-indigo-400" />
           <span className="text-xs font-bold text-gray-500">শুধুমাত্র 'Delivered' পার্সেলগুলো এখানে পেমেন্টের জন্য দেখা যাবে।</span>
        </div>
      </div>

      {/* Excel Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200">
                <th className="px-6 py-5 font-black text-gray-500 uppercase tracking-widest border-r border-gray-200/50">SL/ID</th>
                <th className="px-6 py-5 font-black text-gray-500 uppercase tracking-widest border-r border-gray-200/50">{t.customer_name}</th>
                <th className="px-6 py-5 font-black text-emerald-600 uppercase tracking-widest border-r border-gray-200/50">{t.amount_delivered}</th>
                <th className="px-6 py-5 font-black text-red-500 uppercase tracking-widest border-r border-gray-200/50">Payable Delivery Charge</th>
                <th className="px-6 py-5 font-black text-indigo-500 uppercase tracking-widest border-r border-gray-200/50">{t.sub_total}</th>
                <th className="px-6 py-5 font-black text-amber-600 uppercase tracking-widest border-r border-gray-200/50">{t.cod_charge}</th>
                <th className="px-6 py-5 font-black text-indigo-900 uppercase tracking-widest">Net Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {calculations.map((calc) => (
                <tr key={calc.id} className="hover:bg-indigo-50/50 transition-colors font-semibold group">
                  <td className="px-6 py-4 font-mono text-gray-400 border-r border-gray-100/50">{calc.id}</td>
                  <td className="px-6 py-4 text-gray-800 border-r border-gray-100/50">{calc.customerName}</td>
                  <td className="px-6 py-4 text-emerald-600 font-bold border-r border-gray-100/50">৳{calc.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-red-400 border-r border-gray-100/50">৳{calc.deliveryCharge}</td>
                  <td className="px-6 py-4 text-indigo-600 border-r border-gray-100/50">৳{calc.subTotal.toLocaleString()}</td>
                  <td className="px-6 py-4 text-amber-600 border-r border-gray-100/50">৳{calc.codCharge.toFixed(2)}</td>
                  <td className="px-6 py-4 font-black text-indigo-900 bg-gray-50/50 group-hover:bg-indigo-100/50">৳{calc.net.toLocaleString()}</td>
                </tr>
              ))}
              {calculations.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-gray-400 font-bold italic">
                    পেমেন্ট করার মতো কোনো 'Delivered' পার্সেল নেই।
                  </td>
                </tr>
              )}
            </tbody>
            {calculations.length > 0 && (
              <tfoot>
                <tr className="bg-gray-900 text-white font-black text-sm">
                  <td className="px-6 py-5 text-center uppercase tracking-widest" colSpan={2}>Grand Totals</td>
                  <td className="px-6 py-5 text-emerald-300">৳{totals.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-5 text-red-300">৳{totals.totalDelivery.toLocaleString()}</td>
                  <td className="px-6 py-5 text-indigo-200">৳{totals.totalSub.toLocaleString()}</td>
                  <td className="px-6 py-5 text-amber-300">৳{totals.totalCod.toLocaleString()}</td>
                  <td className="px-6 py-5 text-white bg-indigo-700">৳{totals.totalNet.toLocaleString()}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-2 space-y-6">
            <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden flex flex-col justify-center">
              <div className={`absolute top-0 right-0 p-10 opacity-10 ${isRtl ? 'right-auto left-0' : ''}`}><TrendingUp size={160} /></div>
              <h3 className="text-xl font-bold opacity-80 mb-8 uppercase tracking-widest border-l-4 border-white pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pr-4">Receivable Balance</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                 <div className="space-y-1">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t.amount_delivered}</span>
                    <p className="text-2xl font-black">৳{totals.totalAmount.toLocaleString()}</p>
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{t.delivery_charge}</span>
                    <p className="text-2xl font-black text-red-300">-৳{totals.totalDelivery.toLocaleString()}</p>
                 </div>
                 <div className="space-y-1 col-span-2 pt-4 border-t border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t.net_payable}</span>
                    <div className="flex items-end gap-3">
                      <p className="text-5xl font-black tracking-tighter">৳{totals.totalNet.toLocaleString()}</p>
                      <span className="text-xs mb-2 opacity-50 font-bold">(After 1% COD Charge)</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
               <PaymentMethods 
                  methods={paymentMethods} 
                  onSave={onSaveMethod} 
                  onDelete={onDeleteMethod} 
                  t={t} 
               />
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
               <h3 className="text-lg font-black text-gray-900 mb-6">উত্তোলন মেথড সিলেক্ট করুন</h3>
               <div className="space-y-3">
                  {paymentMethods.map(m => (
                     <button 
                        key={m.id}
                        onClick={() => setSelectedMethodId(m.id)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                           selectedMethodId === m.id 
                           ? 'border-indigo-600 bg-indigo-50/50 shadow-md' 
                           : 'border-gray-50 bg-gray-50/30 hover:bg-white hover:border-indigo-100'
                        }`}
                     >
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedMethodId === m.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <CheckCircle2 size={16} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-800">{m.label}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-bold">{m.type}</p>
                           </div>
                        </div>
                     </button>
                  ))}
                  {paymentMethods.length === 0 && (
                     <div className="text-center py-4 text-xs text-gray-400 font-bold italic">মেথড ম্যানেজ থেকে মেথড যোগ করুন</div>
                  )}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 flex flex-col justify-center text-center space-y-6 group hover:border-emerald-500/50 transition-all cursor-default">
               <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-emerald-50">
                  <CreditCard size={36} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-gray-900">{t.request_payment}</h3>
                  <p className="text-gray-400 text-xs mt-3 leading-relaxed px-4 italic font-medium">আপনার সংগৃহীত টাকা ব্যাংক বা মোবাইল ওয়ালেটে পাঠাতে রিকোয়েস্ট পাঠান।</p>
               </div>
               <button 
                  onClick={handleRequest}
                  disabled={!selectedMethodId || totals.totalNet <= 0}
                  className={`w-full font-black py-5 rounded-[2rem] transition-all flex items-center justify-center space-x-3 rtl:space-x-reverse shadow-xl ${
                     (selectedMethodId && totals.totalNet > 0)
                     ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 active:scale-95' 
                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
               >
                  <span>{t.request_payment}</span>
                  <ChevronRight size={20} className={isRtl ? 'rotate-180' : ''} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PaymentInvoice;
