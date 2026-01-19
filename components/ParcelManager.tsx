
import React from 'react';
import { Plus, Search, Trash2, Download, Eye, MapPin } from 'lucide-react';
import { Parcel, ParcelStatus, View } from '../types';

interface ParcelManagerProps {
  parcels: Parcel[];
  onAdd: (parcel: Partial<Parcel>) => void;
  onDelete: (id: string) => void;
  onViewTracking: (parcel: Parcel) => void;
}

const ParcelManager: React.FC<ParcelManagerProps> = ({ parcels, onAdd, onDelete, onViewTracking }) => {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [search, setSearch] = React.useState('');
  
  // Initialize weight as string '0.5' and use correct field names (phone, amount, exchange, note, type)
  const [formData, setFormData] = React.useState<Partial<Parcel>>({
    customerName: '',
    phone: '',
    address: '',
    amount: 0,
    exchange: 'No',
    weight: '0.5',
    note: '',
    type: 'Pickup'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    // Reset form with correct types and field names
    setFormData({
      customerName: '',
      phone: '',
      address: '',
      amount: 0,
      exchange: 'No',
      weight: '0.5',
      note: '',
      type: 'Pickup'
    });
    setShowAddForm(false);
  };

  // Update filtered search to use phone and id instead of mobile and serialNumber
  const filteredParcels = parcels.filter(p => 
    p.customerName.toLowerCase().includes(search.toLowerCase()) || 
    p.phone.includes(search) || 
    p.id.includes(search)
  );

  const exportToCSV = () => {
    const headers = ['Serial Number', 'Customer', 'Mobile', 'Address', 'Amount', 'Weight', 'Status', 'Date'];
    const rows = parcels.map(p => [
      p.id,
      p.customerName,
      p.phone,
      p.address,
      p.amount,
      p.weight,
      p.status,
      new Date(p.createdAt).toLocaleDateString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "express_parcels.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Parcels Management</h2>
        <div className="flex space-x-2">
          <button 
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors text-slate-600 font-medium"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Plus size={18} />
            <span>Add Parcel</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search by customer, mobile, or serial..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Serial / Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Condition (1% Fee)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map((parcel) => (
                <tr key={parcel.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-indigo-600">#{parcel.id}</p>
                    <p className="text-xs text-slate-400">{new Date(parcel.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{parcel.customerName}</p>
                    <p className="text-sm text-slate-500">{parcel.phone}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{parcel.address}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">৳{parcel.amount}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">EXCHANGE: {parcel.exchange === 'Yes' ? 'YES' : 'NO'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      parcel.status === ParcelStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                      parcel.status === ParcelStatus.DELIVERED ? 'bg-emerald-100 text-emerald-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onViewTracking(parcel)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Track"
                      >
                        <MapPin size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(parcel.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredParcels.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No parcels found match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Parcel Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scaleUp">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-slate-800">New Courier Entry</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Customer Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Delivery Address</label>
                <textarea 
                  required
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Condition Amount (৳)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Weight (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Parcel Type</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'Pickup' | 'Drop'})}
                  >
                    <option value="Pickup">Pickup</option>
                    <option value="Drop">Drop</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6 p-4 bg-slate-50 rounded-xl">
                 <div className="flex items-center space-x-2">
                   <input 
                    type="checkbox" 
                    id="exchange"
                    className="w-5 h-5 accent-indigo-600 rounded"
                    checked={formData.exchange === 'Yes'}
                    onChange={(e) => setFormData({...formData, exchange: e.target.checked ? 'Yes' : 'No'})}
                   />
                   <label htmlFor="exchange" className="font-semibold text-slate-700">Exchange Parcel?</label>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Invoice / Notes</label>
                <textarea 
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  placeholder="Extra instructions for delivery agent..."
                ></textarea>
              </div>

              <div className="pt-4 flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                >
                  Submit Parcel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components for the manager
const X: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default ParcelManager;
