import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const LiveChatWidget: React.FC = () => {
  const { showToast } = useMarketplace();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to MTM Marketplace. How can I assist you with heavy machinery procurement, escrow protection, or verified freight today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputText;
    setInputText('');

    // Simulate intelligent MTM Assistant reply
    setTimeout(() => {
      let replyText = "Thank you for your inquiry. Our senior industrial engineering team in Lagos & Benin City has received your message and will coordinate shortly.";
      const lower = query.toLowerCase();

      if (lower.includes('price') || lower.includes('cost') || lower.includes('discount')) {
        replyText = "All prices on MTM are verified in NGN and USD with optional MTM Pro Rewards cashback discounts up to 7.5%.";
      } else if (lower.includes('escrow') || lower.includes('safety') || lower.includes('pay')) {
        replyText = "MTM Escrow holds 100% of funds securely until your machinery is delivered and successfully inspected on your factory floor.";
      } else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('freight')) {
        replyText = "We handle heavy flatbed trailer freight across all Nigerian industrial hubs (Ikeja, Aba, Nnewi, Port Harcourt, Kano) with full transit insurance.";
      } else if (lower.includes('spare') || lower.includes('maintenance')) {
        replyText = "We stock 100% OEM replacement parts with 24-hour dispatch for all listed machinery.";
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white px-4 py-3 rounded-full shadow-2xl transition transform hover:scale-105 font-bold text-xs cursor-pointer group border border-rose-300/40"
            title="Open MTM Live Industrial Support"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
            </div>
            <span className="hidden sm:inline">MTM Expert Live Chat</span>
          </button>
        )}
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-white text-slate-900 p-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#8B1520] font-bold shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">MTM Industrial Expert</h3>
                <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • Lagos & Benin City Hubs</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#8B1520] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-rose-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => setInputText("What is MTM Escrow Protection?")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8B1520] rounded-full whitespace-nowrap transition border border-slate-200 hover:border-rose-200 cursor-pointer"
            >
              🛡️ Escrow Safety
            </button>
            <button
              onClick={() => setInputText("Tell me about Pro Rewards cashback")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8B1520] rounded-full whitespace-nowrap transition border border-slate-200 hover:border-rose-200 cursor-pointer"
            >
              ⭐ Pro Rewards
            </button>
            <button
              onClick={() => setInputText("Book a certified factory floor inspection")}
              className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-[#8B1520] rounded-full whitespace-nowrap transition border border-slate-200 hover:border-rose-200 cursor-pointer"
            >
              🔍 Inspection
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your machinery or logistics query..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#8B1520] transition"
            />
            <button
              type="submit"
              className="p-2.5 bg-gradient-to-r from-[#48060C] via-[#7A101A] to-[#D83A46] hover:from-[#380409] hover:via-[#630C15] hover:to-[#B82531] text-white rounded-xl transition shadow cursor-pointer border border-[#7A101A]/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
