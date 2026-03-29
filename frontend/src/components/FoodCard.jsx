import React, { useState } from 'react';
import { Clock, MapPin, User, Star, Utensils, Box, Archive, Timer, LocateFixed, UserCheck, Trophy, PackageSearch } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RatingModal from './RatingModal';

const FoodCard = ({ food, user }) => {
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const [showRating, setShowRating] = useState(false);
  
  const isExpired = new Date(food.expiryTime) < new Date();
  const isClaimed = food.status === 'claimed';

  const handleClaim = async () => {
      setError('');
      setClaiming(true);
      try {
          const res = await fetch(`http://localhost:5000/api/food/${food._id}/claim`, {
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
    <div className="glass-card rounded-[3rem] overflow-hidden relative group animate-fade-in-up">
      {/* Ribbon */}
      {(isClaimed || isExpired) && (
          <div className="absolute top-6 right-6 z-20">
              <div className={`text-slate-950 text-[9px] font-black tracking-[0.2em] px-5 py-2 rounded-full shadow-2xl border ${isClaimed ? 'bg-primary border-primary/20' : 'bg-red-500 border-red-500/20 text-white'}`}>
                  {isClaimed ? 'CLAIMED' : 'EXPIRED'}
              </div>
          </div>
      )}

      {/* Image / Header */}
      <div className="h-56 bg-slate-950 relative overflow-hidden">
          {food.image ? (
              <img src={food.image} alt={food.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100 brightness-75 group-hover:brightness-100" />
          ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-indigo-500/5 flex justify-center items-center text-primary/10">
                  <PackageSearch className="h-20 w-20 animate-pulse" />
              </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-card via-bg-card/40 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
               <h3 className="font-black text-white text-3xl truncate tracking-tighter drop-shadow-2xl">{food.name}</h3>
               <div className="flex items-center mt-2 space-x-2">
                  <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Available Now</p>
               </div>
          </div>
      </div>

      <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
             <div className="flex items-center space-x-3 text-slate-400 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
                <Archive className="h-4 w-4 text-primary" />
                <span className="font-black tracking-tight text-slate-200 text-sm">{food.quantity}</span>
             </div>
             
             <div className="flex items-center space-x-2 text-primary font-black bg-primary/5 px-4 py-2.5 rounded-2xl border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                <Timer className="h-4 w-4" />
                <span className="text-[10px] uppercase tracking-widest">
                    {isExpired ? 'Expired' : formatDistanceToNow(new Date(food.expiryTime), { addSuffix: true })}
                </span>
             </div>
          </div>

          <div className="space-y-3">
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed bg-white/5 p-4 rounded-3xl border border-white/5 italic">
                  "{food.description || 'No additional details provided.'}"
              </p>
              <div className="flex items-start space-x-3 text-slate-500 text-[10px] font-black leading-tight uppercase tracking-widest px-1">
                 <LocateFixed className="h-4 w-4 shrink-0 text-primary/30" />
                 <span className="line-clamp-1">{food.location.address || 'Location Hidden'}</span>
              </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white/5 rounded-2xl flex justify-center items-center text-primary font-black shadow-inner border border-white/5 group-hover:border-primary/30 transition-colors">
                      {food.donor?.name?.charAt(0) || <UserCheck className="h-6 w-6" />}
                  </div>
                  <div className="flex flex-col">
                      <p className="font-black text-white text-sm leading-none tracking-tight">{food.donor?.name || 'Anonymous'}</p>
                      <div className="flex items-center mt-2 space-x-1">
                          <Trophy className="h-3 w-3 text-primary animate-pulse" />
                          <span className="text-[9px] font-black text-slate-500 tracking-[0.2em] uppercase">{food.donor?.rating?.toFixed(1) || 'NEW'} RANK</span>
                      </div>
                  </div>
              </div>

              {!isClaimed && !isExpired && (
                 <button 
                     onClick={handleClaim}
                     disabled={claiming || food.donor?._id === user?._id}
                     className="btn-primary !py-3 !px-6 !text-[10px] !rounded-2xl"
                 >
                     {claiming ? '...' : (food.donor?._id === user?._id ? 'MY POST' : 'CLAIM')}
                 </button>
              )}
          </div>
          
          {error && <p className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center mt-4 bg-red-500/10 p-3 rounded-2xl border border-red-500/10 animate-shake">{error}</p>}
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
