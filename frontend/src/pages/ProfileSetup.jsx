import React, { useState } from 'react';
import { User, MapPin, Phone, ShieldCheck, ArrowRight, Save, LocateFixed, ChevronRight, Zap, Globe } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const ProfileSetup = ({ user, onComplete }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 3) return setError('Name must be at least 3 characters');
    
    setLoading(true);
    try {
      const resp = await fetch(`${API_ENDPOINTS.AUTH}/profile`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name })
      });
      const data = await resp.json();
      if (resp.ok) {
        onComplete(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection to node failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col justify-center items-center px-4 font-sans relative overflow-hidden">
      
      {/* Decorative Branding Elements (Superior Material) */}
      <div className="absolute top-20 left-20 h-40 w-40 bg-google-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 h-60 w-60 bg-google-green/5 rounded-full blur-3xl" />

      {/* Profile Card (Google Minimalist) */}
      <div className="max-w-[450px] w-full bg-white rounded-2xl border border-[#dadce0] p-12 shadow-sm animate-fade-in-up relative z-10">
         <div className="text-center mb-10">
            <div className="h-20 w-20 bg-[#e8f0fe] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#4285f4]/10">
               <User className="h-10 w-10 text-google-blue" />
            </div>
            <h1 className="text-2xl font-bold text-[#202124] tracking-tight mb-2">Create your alias</h1>
            <p className="text-sm text-[#5f6368] font-medium leading-relaxed">Establish your operator presence across the hub</p>
         </div>

         {error && (
            <div className="mb-6 bg-[#fce8e6] text-[#c5221f] text-xs p-4 rounded-xl border border-[#f1b4af] text-center font-bold animate-shake">
              {error}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-2">Display Name</label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-google-blue">
                    <Zap className="h-4 w-4 text-[#dadce0]" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-dark pl-11 !rounded-xl text-base"
                    placeholder="Enter mission alias..."
                    autoFocus
                  />
               </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full bg-google-blue hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all text-xs tracking-widest disabled:opacity-50"
            >
               <span className="flex items-center justify-center">
                  {loading ? 'SYNCHRONIZING...' : 'INITIALIZE MISSION'}
                  <ChevronRight className="h-4 w-4 ml-2" />
               </span>
            </button>
         </form>

         <div className="mt-12 pt-8 border-t border-[#f1f3f4] flex justify-center items-center space-x-6 opacity-20">
            <ShieldCheck className="h-4 w-4 text-[#5f6368]" />
            <Globe className="h-4 w-4 text-[#5f6368]" />
         </div>
      </div>
      
      <div className="absolute bottom-12 text-[#70757a] text-[11px] font-bold tracking-[0.4em] uppercase opacity-40 animate-pulse">
        Secure | Decentralized | Hub
      </div>
    </div>
  );
};

export default ProfileSetup;
