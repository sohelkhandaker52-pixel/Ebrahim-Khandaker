
import React, { useState, useEffect } from 'react';
import { Lightbulb, Target, TrendingUp, ShieldCheck, MapPin, Truck, Zap, Info, ChevronRight, MessageCircle, Pencil, Save, X, Plus, Trash2, Sparkles } from 'lucide-react';

interface Tip {
  title: string;
  icon: any;
  color: string;
  description: string;
  tag: string;
}

interface Insight {
  label: string;
  value: string;
  trend: string;
}

const DEFAULT_TIPS: Tip[] = [
  {
    title: "Optimize Packaging",
    icon: 'Truck',
    color: "bg-emerald-100 text-[#00a651]",
    description: "Using the right box size can reduce shipping costs by up to 15%. Always wrap fragile items in bubble wrap to minimize returns due to damage.",
    tag: "Operations"
  },
  {
    title: "Address Accuracy",
    icon: 'MapPin',
    color: "bg-blue-100 text-blue-600",
    description: "Encourage customers to provide landmarks. 30% of failed deliveries happen due to incorrect or vague addresses.",
    tag: "Logistics"
  },
  {
    title: "Fast Dispatching",
    icon: 'Zap',
    color: "bg-amber-100 text-amber-600",
    description: "Orders dispatched within 4 hours of placement see a 40% higher customer satisfaction rating. Keep popular items pre-packed.",
    tag: "Growth"
  },
  {
    title: "Fraud Prevention",
    icon: 'ShieldCheck',
    color: "bg-red-100 text-red-600",
    description: "Verify new customer numbers via SMS or a quick call before shipping high-value items. Use the 'Fraud Check' tool frequently.",
    tag: "Security"
  }
];

const DEFAULT_INSIGHTS: Insight[] = [
  { label: "Trending Locations", value: "Dhaka, Chittagong, Sylhet", trend: "+12% Growth" },
  { label: "Peak Shipping Time", value: "3 PM - 7 PM Daily", trend: "Busy Hours" },
  { label: "Return Rate (System Avg)", value: "4.2%", trend: "Stable" }
];

const iconMap: Record<string, any> = {
  Truck, MapPin, Zap, ShieldCheck, Lightbulb, Target, TrendingUp, Info
};

const Advice: React.FC<{ t: any }> = ({ t }) => {
  const [activeAdvice, setActiveAdvice] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [tips, setTips] = useState<Tip[]>(() => {
    const saved = localStorage.getItem('eks_advice_tips');
    return saved ? JSON.parse(saved) : DEFAULT_TIPS;
  });

  const [insights, setInsights] = useState<Insight[]>(() => {
    const saved = localStorage.getItem('eks_advice_insights');
    return saved ? JSON.parse(saved) : DEFAULT_INSIGHTS;
  });

  useEffect(() => {
    localStorage.setItem('eks_advice_tips', JSON.stringify(tips));
  }, [tips]);

  useEffect(() => {
    localStorage.setItem('eks_advice_insights', JSON.stringify(insights));
  }, [insights]);

  const handleTipChange = (index: number, field: keyof Tip, value: string) => {
    const newTips = [...tips];
    newTips[index] = { ...newTips[index], [field]: value };
    setTips(newTips);
  };

  const handleInsightChange = (index: number, field: keyof Insight, value: string) => {
    const newInsights = [...insights];
    newInsights[index] = { ...newInsights[index], [field]: value };
    setInsights(newInsights);
  };

  const addTip = () => {
    setTips([...tips, { 
      title: "New Success Tip", 
      icon: 'Lightbulb', 
      color: "bg-indigo-100 text-indigo-600", 
      description: "Click edit to add details about this merchant success tip.", 
      tag: "Strategy" 
    }]);
  };

  const removeTip = (index: number) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  const addInsight = () => {
    setInsights([...insights, { label: "New Insight", value: "Value Here", trend: "0%" }]);
  };

  const removeInsight = (index: number) => {
    setInsights(insights.filter((_, i) => i !== index));
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Hero Section */}
      <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Lightbulb size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#00a651] p-1.5 rounded-lg text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#00a651]">Intelligence Hub</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4">{t.advice} & Market Insights</h2>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            Customizable suggestions to grow your business with EKS courier service. 
            Update these options to reflect current market trends or business specific goals.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-xl ${
                isEditing 
                ? 'bg-rose-600 text-white shadow-rose-900/20' 
                : 'bg-[#00a651] text-white shadow-emerald-950/20'
              }`}
            >
              {isEditing ? <X size={20} /> : <Pencil size={20} />}
              <span>{isEditing ? "Finish Editing" : "Configure Advice"}</span>
            </button>
            {isEditing && (
              <button 
                onClick={() => { setTips(DEFAULT_TIPS); setInsights(DEFAULT_INSIGHTS); }}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-bold transition-all border border-white/10"
              >
                Reset Defaults
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tips Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-gray-900">Merchant Success Tips</h3>
            {isEditing && (
              <button onClick={addTip} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                <Plus size={18} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {tips.map((tip, i) => (
              <div 
                key={i} 
                onClick={() => !isEditing && setActiveAdvice(activeAdvice === i ? null : i)}
                className={`bg-white border rounded-[2rem] p-6 transition-all relative ${
                  !isEditing ? 'cursor-pointer hover:shadow-xl hover:shadow-emerald-50/50' : 'cursor-default'
                } ${activeAdvice === i && !isEditing ? 'border-[#00a651] ring-4 ring-emerald-50' : 'border-gray-100'}`}
              >
                {isEditing && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeTip(i); }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 z-20"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4 w-full">
                    <div className={`${tip.color} p-3 rounded-2xl shrink-0`}>
                      {React.createElement(iconMap[tip.icon] || Lightbulb, { size: 20 })}
                    </div>
                    <div className="flex-1 space-y-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            value={tip.title}
                            onChange={(e) => handleTipChange(i, 'title', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1 text-sm font-black text-gray-900"
                            placeholder="Tip Title"
                          />
                          <input 
                            type="text" 
                            value={tip.tag}
                            onChange={(e) => handleTipChange(i, 'tag', e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600"
                            placeholder="Tag (e.g. Security)"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-extrabold text-gray-900">{tip.title}</h4>
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{tip.tag}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <ChevronRight size={18} className={`text-gray-300 transition-transform shrink-0 ${activeAdvice === i ? 'rotate-90 text-[#00a651]' : ''}`} />
                  )}
                </div>
                
                {(activeAdvice === i || isEditing) && (
                  <div className={`mt-4 pt-4 border-t border-gray-50 text-sm text-gray-600 leading-relaxed animate-fade-in ${isEditing ? 'block' : ''}`}>
                    {isEditing ? (
                      <textarea 
                        value={tip.description}
                        onChange={(e) => handleTipChange(i, 'description', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:bg-white"
                        rows={3}
                        placeholder="Detailed advice description..."
                      />
                    ) : (
                      tip.description
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights & Community */}
        <div className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Real-time Insights</h3>
              {isEditing && (
                <button onClick={addInsight} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                  <Plus size={18} />
                </button>
              )}
            </div>
            <div className="space-y-6">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group relative">
                  {isEditing && (
                    <button 
                      onClick={() => removeInsight(i)}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={10} />
                    </button>
                  )}
                  <div className="flex-1 space-y-1">
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-2">
                        <input 
                          type="text" 
                          value={insight.label}
                          onChange={(e) => handleInsightChange(i, 'label', e.target.value)}
                          className="bg-transparent border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-widest outline-none"
                          placeholder="Label"
                        />
                        <input 
                          type="text" 
                          value={insight.value}
                          onChange={(e) => handleInsightChange(i, 'value', e.target.value)}
                          className="bg-transparent border-b border-gray-200 text-sm font-black text-gray-800 outline-none"
                          placeholder="Value"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{insight.label}</p>
                        <p className="text-sm font-black text-gray-800 mt-0.5">{insight.value}</p>
                      </>
                    )}
                  </div>
                  <div className="shrink-0 ml-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={insight.trend}
                        onChange={(e) => handleInsightChange(i, 'trend', e.target.value)}
                        className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg outline-none w-20 text-center"
                        placeholder="Trend"
                      />
                    ) : (
                      <div className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-lg">
                        {insight.trend}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-[#00a651]/5 border border-[#00a651]/10 rounded-[2rem] flex items-start gap-4">
              <Info className="text-[#00a651] shrink-0" size={20} />
              <p className="text-xs font-bold text-gray-600 leading-relaxed">
                Data shown here is aggregated from across our network in Bangladesh. Use these metrics to plan your stock and delivery schedules.
              </p>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition-all">
             <div>
                <h4 className="text-lg font-black tracking-tight">Merchant Community</h4>
                <p className="text-indigo-200 text-xs font-medium mt-1">Join 50k+ sellers sharing advice daily.</p>
             </div>
             <div className="bg-white/20 p-4 rounded-3xl group-hover:scale-110 transition-transform">
                <MessageCircle size={28} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advice;
