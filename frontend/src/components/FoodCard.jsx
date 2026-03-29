import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Star, Utensils, Box, Archive, Timer, LocateFixed, UserCheck, Trophy, PackageSearch, PhoneCall, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RatingModal from './RatingModal';
import { API_ENDPOINTS, API_BASE_URL } from '../config';

const FoodCard = ({ food, user }) => {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const [showRating, setShowRating] = useState(false);
  
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) return `${API_BASE_URL}${url}`;
    return url;
  };

  const calculateTimeLeft = () => {
    const difference = new Date(food.expiryTime) - new Date();
    if (difference <= 0) return 'Expired';
    
    const hours = Math.floor((difference / (1000 * 60 * 60)));
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h remaining`;
    }
    
    return `${hours}h ${minutes}m ${seconds}s remaining`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [food.expiryTime]);

  const isExpired = timeLeft === 'Expired';
  const isClaimed = food.status === 'claimed';

  const handleClaim = async () => {
      setError('');
      setClaiming(true);
      try {
          const res = await fetch(`${API_ENDPOINTS.FOOD}/${food._id}/claim`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
          const data = await res.json();
          if(!res.ok) {
              setError(data.message);
          } else {
              setShowRating(true);
          }
      } catch(err) {
          setError('Failed to claim food');
      } finally {
          setClaiming(false);
      }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#dadce0] overflow-hidden relative group hover:shadow-lg transition-all duration-300 animate-fade-in-up flex flex-col h-full">
      {/* Google-Style Status Pill */}
      {(isClaimed || isExpired) && (
          <div className="absolute top-4 right-4 z-20">
              <div className={`text-white text-[10px] font-bold tracking-wider px-4 py-1.5 rounded-full shadow-sm ${isClaimed ? 'bg-[#4285f4]' : 'bg-[#ea4335]'}`}>
                  {isClaimed ? 'CLAIMED' : 'EXPIRED'}
              </div>
          </div>
      )}

      {/* Hero Image Section */}
      <div className="h-48 bg-[#f1f3f4] relative overflow-hidden shrink-0">
          {food.image ? (
              <img src={getImageUrl(food.image)} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
              <div className="w-full h-full flex justify-center items-center text-[#dadce0]">
                  <PackageSearch className="h-16 w-16" />
              </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
                <h3 className="font-bold text-white text-2xl truncate tracking-tight drop-shadow-md">{food.name}</h3>
          </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1">
          {/* Metadata Row */}
          <div className="flex items-center justify-between mb-5">
             <div className="flex items-center space-x-2 text-[#5f6368] font-bold text-xs uppercase tracking-wider">
                <Archive className="h-4 w-4" />
                <span>{food.quantity}</span>
             </div>
             
             <div className="flex items-center space-x-2 text-[#4285f4] font-bold text-[10px] uppercase tracking-wider bg-[#e8f0fe] px-3 py-1 rounded-full">
                <Timer className="h-3.5 w-3.5" />
                <span>
                    {timeLeft}
                </span>
             </div>
          </div>

          <p className="text-sm text-[#5f6368] font-normal leading-relaxed mb-6 line-clamp-3 italic">
              "{food.description || 'No additional details provided.'}"
          </p>

          {/* Actionable Contact Block (Superior Redesign) */}
          <div className="mt-auto space-y-4">
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0] flex items-center justify-between group/contact transition-all shadow-sm">
                  <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 shrink-0 bg-[#e8f0fe] rounded-lg flex items-center justify-center text-[#4285f4]">
                          <PhoneCall className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="text-[9px] font-bold text-[#70757a] uppercase tracking-widest leading-none mb-1">Donor Mobile</p>
                          <p className="text-lg font-bold text-[#202124] tracking-tight leading-none select-all">{food.phone || (food.donor && food.donor.phone) || 'Contact Donor'}</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-2">
                      <button 
                          onClick={() => {
                              navigator.clipboard.writeText(food.phone || (food.donor && food.donor.phone) || '');
                              alert('Phone number copied!');
                          }}
                          className="p-2.5 shrink-0 inline-flex items-center justify-center bg-white text-[#5f6368] hover:text-[#4285f4] rounded-lg border border-[#dadce0] hover:border-[#4285f4]/30 transition-all active:scale-90"
                          title="Copy Number"
                      >
                          <Archive className="h-4 w-4" />
                      </button>
                      <a href={`tel:${food.phone || (food.donor && food.donor.phone) || ''}`} className="p-2.5 shrink-0 bg-[#4285f4] text-white rounded-lg inline-flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all shadow-sm">
                          <PhoneCall className="h-4 w-4" />
                      </a>
                  </div>
              </div>

              <div className="flex items-start space-x-2 text-[#70757a] text-[10px] font-medium leading-tight uppercase tracking-wider px-1">
                 <LocateFixed className="h-3.5 w-3.5 shrink-0 text-[#4285f4]/50" />
                 <span className="line-clamp-1">{food.location?.address || 'Location Hidden'}</span>
              </div>
          </div>

          {/* Donor Info & Claim Button */}
          <div className="pt-6 mt-6 border-t border-[#f1f3f4] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 shrink-0 bg-[#f1f3f4] rounded-full flex justify-center items-center text-[#4285f4] font-bold text-sm border border-[#dadce0]">
                      {food.donor?.name?.charAt(0) || <UserCheck className="h-5 w-5" />}
                  </div>
                  <div className="flex flex-col">
                      <p className="font-bold text-[#202124] text-xs leading-none tracking-tight">{food.donor?.name || 'Anonymous'}</p>
                      <div className="flex items-center mt-1.5 space-x-1">
                          <Trophy className="h-3 w-3 text-[#fbbc05]" />
                          <span className="text-[10px] font-bold text-[#70757a] tracking-wider uppercase">{food.donor?.rating?.toFixed(1) || 'NEW'} RANK</span>
                      </div>
                  </div>
              </div>

              {!isClaimed && !isExpired && (
                 <button 
                     onClick={handleClaim}
                     disabled={claiming || food.donor?._id === user?._id}
                     className="bg-google-blue hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-full shadow-sm hover:shadow-md transition-all text-[10px] tracking-wider disabled:opacity-40"
                 >
                     {claiming ? '...' : (food.donor?._id === user?._id ? 'YOURS' : 'RESCUE')}
                 </button>
              )}
          </div>
          
          {error && <p className="text-rose-600 text-[10px] font-bold uppercase tracking-widest text-center mt-4 bg-rose-50 p-2 rounded-lg border border-rose-100 animate-shake">{error}</p>}
      </div>

      <RatingModal 
          isOpen={showRating} 
          onClose={() => setShowRating(false)} 
          foodId={food._id}
          donorName={food.donor?.name}
          onSuccess={() => console.log('Rating submitted')} 
      />
    </div>
  );
};

export default FoodCard;
