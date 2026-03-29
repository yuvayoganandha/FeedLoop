import React, { useState } from 'react';
import { Phone, Lock, ChevronRight, ShieldCheck, Globe, Zap } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

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
      const resp = await fetch(`${API_ENDPOINTS.AUTH}/send-otp`, {
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
      const resp = await fetch(`${API_ENDPOINTS.AUTH}/verify-otp`, {
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
    <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col justify-center items-center px-4 font-sans">
      {/* Google-Style Sign-in Container */}
      <div className="max-w-[450px] w-full bg-white rounded-lg border border-[#dadce0] p-10 shadow-sm animate-fade-in-up">
         
         <div className="text-center mb-10">
            {/* Minimalist Logo */}
            <h1 className="text-[32px] font-medium tracking-tight text-[#202124] mb-2">FeedLoop</h1>
            <h2 className="text-2xl font-normal text-[#202124]">Sign in</h2>
            <p className="text-base text-[#202124] mt-3">Continue to Food Rescue</p>
         </div>

         {error && (
            <div className="mb-6 bg-[#fce8e6] text-[#c5221f] text-sm p-4 rounded-md border border-[#f5c2c7] flex items-center animate-shake font-medium">
              <span>{error}</span>
            </div>
         )}
         
         {step === 1 ? (
           <form onSubmit={handleSendOtp} className="space-y-6">
             <div className="space-y-1">
               <div className="relative group">
                 <input
                   type="tel"
                   value={phone}
                   onChange={e => setPhone(e.target.value)}
                   className="w-full bg-white border border-[#dadce0] rounded-md px-4 py-3.5 text-[#202124] focus:ring-2 focus:ring-[#4285f4]/30 focus:border-[#4285f4] outline-none transition-all placeholder:text-[#70757a] text-base"
                   placeholder="Phone number"
                   autoFocus
                 />
               </div>
               <p className="text-[12px] text-[#70757a] px-1 font-normal leading-relaxed mt-2">
                 Not your computer? Use a private browser window to sign in. <span className="text-google-blue font-medium cursor-pointer">Learn more</span>
               </p>
             </div>
             
             <div className="flex justify-between items-center pt-8">
                <button type="button" className="text-google-blue font-medium text-sm hover:text-blue-700">Create account</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-google-blue hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition-all text-sm disabled:opacity-50"
                >
                  {loading ? 'Next...' : 'Next'}
                </button>
             </div>
           </form>
         ) : (
           <form onSubmit={handleVerifyOtp} className="space-y-6">
             {mockOtpStore && (
                <div className="bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] p-5 rounded-lg text-center mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-wider mb-2 opacity-70">Verification Code</p>
                    <p className="text-4xl font-mono font-medium tracking-[0.3em] text-[#202124]">{mockOtpStore}</p>
                </div>
             )}
             <div className="space-y-1">
               <input
                 type="text"
                 maxLength={4}
                 value={otp}
                 onChange={e => setOtp(e.target.value)}
                 className="w-full bg-white border border-[#dadce0] rounded-md px-4 py-3.5 text-center text-3xl tracking-[0.6em] font-mono outline-none focus:ring-2 focus:ring-[#4285f4]/30 focus:border-[#4285f4] transition-all"
                 placeholder="----"
                 autoFocus
               />
             </div>
             
             <div className="flex justify-between items-center pt-8">
                <button type="button" onClick={() => setStep(1)} className="text-google-blue font-medium text-sm hover:text-blue-700">Revise contact</button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-google-blue hover:bg-blue-600 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition-all text-sm disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Next'}
                </button>
             </div>
           </form>
         )}

         {/* Footer/Help */}
         <div className="mt-12 flex items-center justify-between text-[#70757a] text-[12px]">
            <div className="flex space-x-4">
               <span>English (United States)</span>
            </div>
            <div className="flex space-x-6">
               <span>Help</span>
               <span>Privacy</span>
               <span>Terms</span>
            </div>
         </div>
      </div>
      
      {/* Decorative Branding */}
      <div className="mt-8 text-[#70757a] text-[13px] font-normal flex items-center space-x-2">
        <ShieldCheck className="h-4 w-4" />
        <span>One platform for everyone.</span>
      </div>
    </div>
  );
};

export default MockAuthModal;
