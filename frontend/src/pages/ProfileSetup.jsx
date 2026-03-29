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
    <div className="relative flex-1 flex flex-col justify-center items-center bg-bg-dark px-4 overflow-hidden h-screen w-screen">
       {/* Background Video (Silent/Dimmed) */}
       <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-20 brightness-50"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/20 via-bg-dark/60 to-bg-dark" />

      <div className="max-w-md w-full glass rounded-[3rem] p-12 border border-white/5 relative z-10 animate-fade-in-up backdrop-blur-3xl shadow-[0_0_80px_rgba(6,182,212,0.1)]">
         <div className="text-center mb-10">
            <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
               <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-3">Identity Required</h1>
            <p className="text-slate-500 font-bold tracking-[0.1em] uppercase text-[10px]">Establish your operator presence</p>
         </div>

         {error && (
            <div className="mb-6 bg-red-500/10 text-red-400 text-xs p-4 rounded-2xl border border-red-500/20 text-center font-bold animate-shake">
              {error}
            </div>
         )}

         <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Operator Alias</label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                    <Zap className="h-4 w-4 text-slate-600" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="input-dark pl-12"
                    placeholder="Enter mission name..."
                    autoFocus
                  />
               </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="btn-primary w-full group overflow-hidden"
            >
               <span className="relative z-10 flex items-center font-black">
                  {loading ? 'Sychronizing...' : 'Initialize Mission'}
                  <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
         </form>

         <div className="mt-12 pt-8 border-t border-white/5 flex justify-center items-center space-x-6 opacity-30">
            <ShieldCheck className="h-4 w-4" />
            <Globe className="h-4 w-4" />
         </div>
      </div>
      
      <div className="absolute bottom-12 text-slate-700 text-[10px] font-black tracking-[0.5em] uppercase opacity-40 animate-pulse">
        Secure | Decentralized | Neutral
      </div>
    </div>
  );
};

export default ProfileSetup;
