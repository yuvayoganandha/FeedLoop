import React, { useState } from 'react';
import { X, MapPin, Clock, Info, Package, Camera, Calendar, AlertCircle, ShoppingBag, PhoneCall, History, User, Heart, ChevronRight, CheckCircle, Box, CheckCircle2, LocateFixed, MonitorPlay } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const DonateModal = ({ isOpen, onClose, userLocation, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    description: '',
    phone: user?.phone || '',
    expiryTime: '',
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePost = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity || !formData.expiryTime) {
      return setError('Please fill all required fields');
    }

    setLoading(true);
    setError('');

    // Try to get address from coords
    let finalAddress = 'Near your location';
    try {
        setGeocoding(true);
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`, {
            headers: {
                'User-Agent': 'FeedLoop/1.0 (food-rescue-app)',
                'Accept': 'application/json',
                'Referer': window.location.origin
            }
        });
        const data = await res.json();
        finalAddress = data.display_name;
    } catch(err) {
        console.error('Geocoding failed');
    } finally {
        setGeocoding(false);
    }

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('quantity', formData.quantity);
    submissionData.append('description', formData.description);
    submissionData.append('phone', formData.phone);
    submissionData.append('expiryTime', formData.expiryTime);
    submissionData.append('location', JSON.stringify({
        lng: userLocation.lng,
        lat: userLocation.lat,
        address: finalAddress
    }));
    
    if (formData.image instanceof File) {
        submissionData.append('image', formData.image);
    } else if (formData.image) {
        submissionData.append('image', formData.image);
    }

    try {
        const res = await fetch(API_ENDPOINTS.FOOD, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: submissionData
        });

        if (res.ok) {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onSuccess();
            }, 2000);
        } else {
            const data = await res.json();
            setError(data.message || 'Error posting food');
        }
    } catch (err) {
        setError('Connection failed');
    } finally {
        setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] p-12 w-full max-w-sm shadow-2xl animate-scale-in text-center flex flex-col items-center">
            <div className="h-24 w-24 bg-[#e6f4ea] rounded-full flex items-center justify-center text-google-green mb-8 shadow-sm">
                <CheckCircle2 className="h-12 w-12" />
            </div>
            <h3 className="text-3xl font-bold text-[#202124] tracking-tight mb-3">Transmission Live</h3>
            <p className="text-[#5f6368] font-medium leading-relaxed uppercase tracking-[0.2em] text-[10px]">Your surplus is now visible to nearby rescuers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl relative my-auto animate-fade-in-up overflow-hidden">
        {/* Header (Superior Material Design) */}
        <div className="px-10 py-8 border-b border-[#f1f3f4] flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#202124] tracking-tight">Post Surplus Food</h2>
            <p className="text-[11px] font-bold text-google-blue uppercase tracking-widest mt-1">Initiating redistribution protocol</p>
          </div>
          <button onClick={onClose} className="h-10 w-10 bg-[#f8f9fa] hover:bg-[#f1f3f4] text-[#5f6368] rounded-full flex items-center justify-center transition-all border border-[#dadce0] shadow-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handlePost} className="p-10 space-y-8 custom-scrollbar max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-[#fce8e6] text-[#c5221f] p-4 rounded-xl border border-[#f1b4af] text-center text-xs font-bold animate-shake">
                {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Asset Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5f6368] group-focus-within:text-google-blue transition-colors">
                    <Box className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="input-dark pl-11 !rounded-xl"
                  placeholder="e.g. Samosas, Lunch Packs"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Quantity/Volume</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5f6368] group-focus-within:text-google-blue transition-colors">
                    <History className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-dark pl-11 !rounded-xl"
                  placeholder="e.g. 5 kg, 20 packets"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Mission Logistics (Expiry)</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5f6368] group-focus-within:text-google-blue transition-colors">
                    <Clock className="h-4 w-4" />
                </div>
                <input
                  type="datetime-local"
                  value={formData.expiryTime}
                  onChange={e => setFormData({ ...formData, expiryTime: e.target.value })}
                  className="input-dark pl-11 !rounded-xl font-bold uppercase"
                />
            </div>
            <p className="text-[10px] text-[#70757a] font-medium leading-relaxed ml-1 italic">Note: Food will be hidden after this time for safety.</p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Visual Log (Optional)</label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#5f6368] group-focus-within:text-google-blue transition-colors">
                    <Camera className="h-4 w-4" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                  className="input-dark pl-11 !rounded-xl pt-2 pb-2 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#e8f0fe] file:text-[#4285f4] hover:file:bg-[#d2e3fc]"
                />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#70757a] uppercase tracking-widest ml-1">Mission Intelligence</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="input-dark !rounded-2xl"
              placeholder="Freshly prepared home cooked meals, please carry your own bags..."
            />
          </div>

          <div className="bg-[#e8f0fe] p-6 rounded-2xl border border-[#4285f4]/20 flex items-start space-x-5 shadow-sm">
             <div className="h-10 w-10 bg-[#4285f4] text-white rounded-lg flex items-center justify-center shrink-0 shadow-md">
                <LocateFixed className="h-6 w-6" />
             </div>
             <div>
                <p className="text-sm font-bold text-[#202124] tracking-tight mb-1">Current Sector Coordinates</p>
                <p className="text-[11px] text-[#4285f4] font-black tracking-widest uppercase truncate">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)} (GPS Active)</p>
             </div>
          </div>
          
          <div className="pt-6">
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-google-blue hover:bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
            >
                {loading || geocoding ? 'Synchronizing Datastreams...' : 'Initialize Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateModal;
