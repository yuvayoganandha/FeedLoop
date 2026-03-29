import React, { useState } from 'react';
import { Phone, Lock, ChevronRight, ShieldCheck, Globe, Zap } from 'lucide-react';

const MockAuthModal = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [mockOtpStore, setMockOtpStore] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [homeLocation, setHomeLocation] = useState(null);

  const requestGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return setError('Enter a valid phone number');
    setError('');
    setLoading(true);
    
    try {
      const position = await requestGeolocation();
      setHomeLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    } catch(err) {
      console.warn('Geolocation failed', err);
      setHomeLocation({ lat: 13.0827, lng: 80.2707 }); // Default to Chennai
    }

    try {
      const resp = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await resp.json();
      if (resp.ok) {
        setMockOtpStore(data.mockOtp);
        setStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server Error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, homeLocation })
      });
      const data = await resp.json();
      if (resp.ok) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center bg-bg-dark px-4 overflow-hidden h-screen w-screen">
      {/* Dimmed Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10 brightness-50"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/20 via-bg-dark/60 to-bg-dark" />

      {/* Login Card */}
      <div className="max-w-md w-full glass rounded-[3rem] p-12 border border-white/5 relative z-10 animate-fade-in-up backdrop-blur-2xl shadow-[0_0_80px_rgba(6,182,212,0.1)]">
         <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-cyan-400 to-emerald-400 tracking-tighter mb-4 py-2">FeedLoop</h1>
            <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-[10px] opacity-80">Closing the circle on waste</p>
         </div>

         {error && (
            <div className="mb-6 bg-red-500/10 text-red-400 text-xs p-4 rounded-2xl border border-red-500/20 flex items-center animate-shake font-bold text-center justify-center">
              <span>{error}</span>
            </div>
         )}
         
         {step === 1 ? (
           <form onSubmit={handleSendOtp} className="space-y-8">
             <div className="space-y-3">
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Secure Link Access</label>
               <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                   <Phone className="h-5 w-5 text-slate-600 shadow-primary/20" />
                 </div>
                 <input
                   type="tel"
                   value={phone}
                   onChange={e => setPhone(e.target.value)}
                   className="input-dark pl-14 font-black"
                   placeholder="+91 98765 43210"
                 />
               </div>
             </div>
             <button
               type="submit"
               disabled={loading}
               className="btn-primary w-full group overflow-hidden"
             >
               <span className="relative z-10 flex items-center font-black">
                 {loading ? 'Processing...' : 'Generate Access'}
                 <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             </button>
           </form>
         ) : (
           <form onSubmit={handleVerifyOtp} className="space-y-8">
             {mockOtpStore && (
                <div className="bg-primary/5 border border-primary/20 text-primary p-6 rounded-[2.5rem] text-center mb-8 glass shadow-inner relative overflow-hidden group">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-60">Verification Code</p>
                    <p className="text-5xl font-mono font-black tracking-[0.4em] ml-3 text-white shadow-primary/50">{mockOtpStore}</p>
                    <div className="absolute inset-0 bg-primary/5 blur-xl animate-pulse" />
                </div>
             )}
             <div className="space-y-3">
               <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Identity Proof</label>
               <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                   <Lock className="h-5 w-5 text-slate-600" />
                 </div>
                 <input
                   type="text"
                   maxLength={4}
                   value={otp}
                   onChange={e => setOtp(e.target.value)}
                   className="input-dark pl-14 text-center text-3xl tracking-[0.8em] font-mono font-black"
                   placeholder="----"
                 />
               </div>
             </div>
             <button
               type="submit"
               disabled={loading}
               className="btn-primary w-full"
             >
               <span className="font-black">{loading ? 'Verifying...' : 'Authenticate'}</span>
             </button>
             <div className="flex justify-center pt-2">
                 <button type="button" onClick={() => setStep(1)} className="text-[10px] text-slate-500 hover:text-primary transition-colors font-black uppercase tracking-[0.3em] border-b border-transparent hover:border-primary/30 pb-1">Revise Contact</button>
             </div>
           </form>
         )}

         {/* Trust badge */}
         <div className="mt-12 pt-8 border-t border-white/5 flex justify-center items-center space-x-6 opacity-30">
            <ShieldCheck className="h-4 w-4" />
            <Globe className="h-4 w-4" />
            <Zap className="h-4 w-4 text-primary" />
         </div>
      </div>
      
      <div className="absolute bottom-12 text-slate-700 text-[10px] font-black tracking-[0.5em] uppercase opacity-40 animate-pulse">
        Encrypted | P2P | Global Hub
      </div>
    </div>
  );
};

export default MockAuthModal;
