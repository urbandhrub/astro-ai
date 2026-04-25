'use client';
import { useState } from 'react';

export default function PanjikaAI() {
  const [birthData, setBirthData] = useState({ name: '', dob: '', time: '', place: '' });
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [kundliGenerated, setKundliGenerated] = useState(false);

  const generateKundli = () => {
    if (birthData.name && birthData.dob) {
      setKundliGenerated(true);
      addMessage("assistant", `নমস্কার ${birthData.name}। কুণ্ডলী তৈরি হয়েছে। প্রশ্ন করুন।`);
    }
  };

  const addMessage = (role: string, content: string) => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    addMessage("user", input);
    const currentInput = input;
    setInput('');
    setLoading(true);

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: currentInput, 
        birthDetails: `${birthData.name}, ${birthData.dob} ${birthData.time}, ${birthData.place}` 
      })
    });

    const data = await res.json();
    addMessage("assistant", data.reply);
    setLoading(false);
  };

  const openVoice = () => {
    window.open("https://huggingface.co/spaces/Dhruboj/panjikaai", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0a0a2e] text-white">
      <header className="border-b border-yellow-500/30 py-6 bg-black/50 backdrop-blur sticky top-0">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🪔</span>
            <h1 className="text-4xl font-bold text-yellow-300">PanjikaAI</h1>
          </div>
          <p className="text-yellow-400">বাংলার পঞ্জিকা + AI পণ্ডিত জী</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="bg-white/5 border border-yellow-500/30 rounded-3xl p-8">
            <h2 className="text-2xl mb-6 text-yellow-300">কুণ্ডলী তৈরি করুন</h2>
            <input type="text" placeholder="নাম" className="w-full p-4 bg-white/10 border border-yellow-500/30 rounded-2xl mb-4" onChange={(e) => setBirthData({...birthData, name: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input type="date" className="p-4 bg-white/10 border border-yellow-500/30 rounded-2xl" onChange={(e) => setBirthData({...birthData, dob: e.target.value})} />
              <input type="time" className="p-4 bg-white/10 border border-yellow-500/30 rounded-2xl" onChange={(e) => setBirthData({...birthData, time: e.target.value})} />
            </div>
            <input type="text" placeholder="Kolkata, India" className="w-full mt-4 p-4 bg-white/10 border border-yellow-500/30 rounded-2xl" onChange={(e) => setBirthData({...birthData, place: e.target.value})} />
            <button onClick={generateKundli} className="mt-8 w-full py-5 bg-yellow-400 text-black font-bold rounded-3xl">কুণ্ডলী তৈরি করুন</button>
          </div>
        </div>

        <div className="bg-white/5 border border-yellow-500/30 rounded-3xl p-8 flex flex-col h-[650px]">
          <h2 className="text-2xl mb-4 text-yellow-300">Talk to AI Pandit Ji</h2>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4" id="chat">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-3xl ${m.role === 'user' ? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-yellow-400">Pandit Ji চিন্তা করছেন...</p>}
          </div>
          <div className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="আপনার প্রশ্ন লিখুন..." className="flex-1 bg-white/10 border border-yellow-500/30 rounded-3xl px-6 py-4" onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
            <button onClick={sendMessage} className="bg-yellow-400 text-black px-10 rounded-3xl font-semibold">পাঠান</button>
          </div>
        </div>
      </div>

      <button onClick={openVoice} className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-5xl shadow-2xl hover:scale-110">
        🎙️
      </button>
    </div>
  );
}
