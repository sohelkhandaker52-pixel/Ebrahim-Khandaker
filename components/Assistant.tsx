
import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAssistant } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Assistant: React.FC<{ t: any }> = ({ t }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    const response = await sendMessageToAssistant(userMessage);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const isRtl = document.documentElement.dir === 'rtl';

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto animate-fade-in">
      <div className="bg-indigo-600 p-6 rounded-t-3xl flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Bot size={24} /></div>
          <h2 className="font-bold text-lg">{t.smart_helpline}</h2>
        </div>
        <Sparkles size={24} className="text-indigo-200" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white border-x border-gray-100 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'rtl:flex-row-reverse rtl:space-x-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-800 border border-gray-100'}`}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && <div className="animate-pulse text-indigo-600 text-sm">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-50 rounded-b-3xl border-x border-b border-gray-100">
        <div className="relative">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} className={`w-full ${isRtl ? 'pr-6 pl-14' : 'pl-6 pr-14'} py-4 bg-white border border-gray-200 rounded-2xl shadow-sm outline-none`} placeholder="Type here..." />
          <button onClick={handleSend} className={`absolute ${isRtl ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl transition-all`}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
