import React, { useState } from 'react';
import { X, MapPin, CheckCircle, Box, CheckCircle2, LocateFixed, MonitorPlay } from 'lucide-react';

const DonateModal = ({ isOpen, onClose, userLocation, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    description: '',
    expiryDate: '',
    expiryTime: '',
    address: 'Near current location',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (e.target.name === 'address') {
        setResolvedAddress(''); // Clear previous resolution if address changes
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.expiryDate || !formData.expiryTime) {
        return setError('Please fill all required fields');
    }
    setError('');
    setLoading(true);

    try {
        let lat = userLocation.lat;
        let lng = userLocation.lng;

        // Geocoding step
        if (formData.address && formData.address !== 'Near current location') {
            setGeocoding(true);
            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.address)}`);
                const geoData = await geoRes.json();
                if (geoData && geoData.length > 0) {
                    lat = parseFloat(geoData[0].lat);
                    lng = parseFloat(geoData[0].lon);
                    setResolvedAddress(geoData[0].display_name);
                } else {
                    throw new Error('Address not found. Using current location.');
                }
            } catch (geoErr) {
                console.warn(geoErr);
            } finally {
                setGeocoding(false);
            }
        }

        // Combine Date and Time
        const combinedExpiry = new Date(`${formData.expiryDate}T${formData.expiryTime}`).toISOString();

        const payload = {
            name: formData.name,
            quantity: formData.quantity,
            expiryTime: combinedExpiry,
            image: formData.image,
            address: resolvedAddress || formData.address,
            location: {
                lat,
                lng
            }
        };

        const res = await fetch('http://localhost:5000/api/food', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to donate');

        setSuccess(true);
        setTimeout(() => {
            onSuccess();
            onClose();
        }, 1500);

    } catch(err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-bg-dark/60 backdrop-blur-xl flex justify-center items-end sm:items-center z-50 animate-fade-in px-4">
      <div className="bg-bg-card w-full max-w-lg rounded-[3.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden border border-white/5 animate-fade-in-up relative">
         <div className="px-10 py-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
             <div>
                <h2 className="text-3xl font-black text-white tracking-tighter">Donate Food</h2>
                <div className="flex items-center space-x-2 mt-2">
                   <div className="h-1 w-6 bg-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">Enter Food Details</p>
                </div>
             </div>
             <button onClick={onClose} className="p-4 text-slate-500 hover:text-white bg-white/5 rounded-2xl border border-white/5 transition-all hover:rotate-90">
                 <X className="h-5 w-5" />
             </button>
         </div>

         {success ? (
             <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
                 <div className="h-28 w-28 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]">
                    <CheckCircle className="h-14 w-14 text-primary animate-bounce" />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black text-white tracking-tight">Donation Successful</h3>
                    <p className="text-slate-500 mt-3 font-medium uppercase tracking-[0.2em] text-[10px]">Your food has been listed</p>
                 </div>
             </div>
         ) : (
             <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                 {error && (
                     <div className="bg-red-500/10 text-red-400 text-[10px] p-4 rounded-2xl border border-red-500/20 font-black uppercase tracking-widest animate-shake">{error}</div>
                 )}
                 <div className="space-y-3">
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Food Name *</label>
                     <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Biriyani, Bread, Fruits" className="input-dark text-lg font-black" />
                 </div>

                 <div className="space-y-3">
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Description</label>
                     <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detail ingredients or dietary warnings..." className="input-dark text-sm h-28 resize-none font-medium leading-relaxed" />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Quantity *</label>
                         <div className="relative group">
                            <Box className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 5 Servings" className="input-dark pl-12 text-sm font-black" />
                         </div>
                     </div>
                     <div className="space-y-3">
                         <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Expiry Time *</label>
                         <div className="flex space-x-3">
                            <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="input-dark text-[10px] px-2 text-center" />
                            <input type="time" name="expiryTime" value={formData.expiryTime} onChange={handleChange} className="input-dark text-[10px] px-2 text-center" />
                          </div>
                     </div>
                 </div>

                 <div className="space-y-3">
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Pickup Location</label>
                     <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                             <LocateFixed className="h-5 w-5 text-slate-600" />
                         </div>
                         <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter pickup address..." className="input-dark pl-14 font-black text-sm" />
                     </div>
                     {geocoding && <p className="text-[10px] text-primary animate-pulse font-black ml-2 uppercase tracking-widest">Searching location...</p>}
                     {resolvedAddress && (
                        <div className="bg-primary/5 p-4 rounded-3xl border border-primary/20 flex items-start space-x-3 animate-fade-in">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight line-clamp-2">Resolved: {resolvedAddress}</p>
                        </div>
                     )}
                 </div>

                 <div className="space-y-3">
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Image URL</label>
                     <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                             <MonitorPlay className="h-5 w-5 text-slate-600" />
                         </div>
                         <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://image-link.com" className="input-dark pl-14 text-sm" />
                     </div>
                 </div>

                 <button type="submit" disabled={loading} className="btn-primary w-full py-5 text-lg shadow-[0_20px_40px_rgba(6,182,212,0.25)]">
                     <span className="font-black text-slate-900 tracking-[0.3em]">Post Donation</span>
                 </button>
             </form>
         )}
      </div>
    </div>
  );
};

export default DonateModal;
