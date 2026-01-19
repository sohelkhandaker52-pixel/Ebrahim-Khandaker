
import React, { useState } from 'react';
import { Transaction } from '../types';
import { Wallet, Smartphone, Landmark, ArrowDownLeft, ArrowUpRight, CheckCircle2, History, ChevronRight, DollarSign, CreditCard, Plus } from 'lucide-react';

interface TopUpProps {
  balance: number;
  transactions: Transaction[];
  onTopUp: (amount: number, method: string) => void;
  t: any;
}

const TopUp: React.FC<TopUpProps> = ({ balance, transactions, onTopUp, t }) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('bKash');
  const [isSuccess, setIsSuccess] = useState(false);

  const presets = [500, 1000, 2000, 5000];

  const handleTopUp = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert(t.amount_error);
      return;
    }
    onTopUp(val, selectedMethod);
    setIsSuccess(true);
    setAmount('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const methods = [
    { id: 'bKash', label: 'bKash', color: 'bg-pink-600', icon: Smartphone },
    { id: 'Nagad', label: 'Nagad', color: 'bg-orange-600', icon: Smartphone },
    { id: 'Bank', label: 'Bank', color: 'bg-indigo-600', icon: Landmark },
    { id: 'Card', label: 'Card', color: 'bg-gray-800', icon: CreditCard },
  ];

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top-up Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Wallet size={120} />
             </div>
             
             <div className="relative z-10">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8">
                   <div className="bg-indigo-600 p-2 rounded-xl text-white"><DollarSign size={24} /></div>
                   {t.add_money}
                </h2>

                <div className="space-y-8">
                   {/* Balance Overview */}
                   <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.merchant_balance}</p>
                         <p className="text-3xl font-black text-gray-900 mt-1">৳{balance.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                         <Wallet size={24} />
                      </div>
                   </div>

                   {/* Method Selection */}
                   <div className="space-y-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.select_provider}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                         {methods.map((m) => (
                            <button 
                               key={m.id}
                               onClick={() => setSelectedMethod(m.id)}
                               className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                                  selectedMethod === m.id 
                                  ? 'border-indigo-600 bg-indigo-50/30' 
                                  : 'border-gray-50 bg-gray-50/30 hover:bg-white hover:border-indigo-100'
                               }`}
                            >
                               <div className={`${m.color} text-white p-2.5 rounded-2xl`}>
                                  <m.icon size={20} />
                               </div>
                               <span className="text-xs font-bold text-gray-700">{m.label}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Amount Input */}
                   <div className="space-y-4">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.select_amount}</p>
                      <div className="relative group">
                         <div className={`absolute ${isRtl ? 'right-6' : 'left-6'} top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl group-focus-within:text-indigo-600`}>৳</div>
                         <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full ${isRtl ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-5 bg-gray-50 border-2 border-transparent rounded-3xl outline-none text-2xl font-black focus:bg-white focus:border-indigo-100 transition-all text-gray-900`}
                         />
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {presets.map(p => (
                            <button 
                               key={p} 
                               onClick={() => setAmount(p.toString())}
                               className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                            >
                               +৳{p}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Action Button */}
                   <button 
                      onClick={handleTopUp}
                      className={`w-full py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${
                         isSuccess 
                         ? 'bg-emerald-600 text-white' 
                         : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                   >
                      {isSuccess ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                      <span>{isSuccess ? t.topup_success : t.confirm_topup}</span>
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Transaction History Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-full flex flex-col">
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-8">
                 <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><History size={20} /></div>
                 {t.recent_transactions}
              </h3>
              
              <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                 {transactions.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 space-y-4">
                       <History size={48} className="mx-auto opacity-20" />
                       <p className="text-xs font-bold uppercase tracking-widest">No transactions yet</p>
                    </div>
                 ) : (
                    transactions.slice(0, 10).map((tx) => (
                       <div key={tx.id} className="group flex items-center justify-between p-4 rounded-3xl bg-gray-50 hover:bg-white border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-default">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                tx.type === 'Top-up' || tx.type === 'Order Income' 
                                ? 'bg-emerald-100 text-emerald-600' 
                                : 'bg-red-100 text-red-600'
                             }`}>
                                {tx.type === 'Top-up' || tx.type === 'Order Income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                             </div>
                             <div>
                                <p className="text-sm font-black text-gray-800">{tx.type}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(tx.timestamp).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-sm font-black ${
                                tx.type === 'Top-up' || tx.type === 'Order Income' 
                                ? 'text-emerald-600' 
                                : 'text-red-600'
                             }`}>
                                {tx.type === 'Top-up' || tx.type === 'Order Income' ? '+' : '-'}৳{tx.amount.toLocaleString()}
                             </p>
                             <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{tx.status}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>

              {transactions.length > 0 && (
                 <button className="mt-8 w-full py-4 text-xs font-black text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-dashed border-indigo-100">
                    {t.view_details}
                    <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                 </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
